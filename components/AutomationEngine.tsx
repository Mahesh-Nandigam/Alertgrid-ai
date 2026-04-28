"use client";

import { useEffect } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AutomationEngine() {
  useEffect(() => {
    // 1. Listen for new/modified Critical incidents for Authority Notification
    const qNotify = query(
      collection(db, "incidents"), 
      where("priority", "==", "Critical"),
      where("authoritiesNotified", "!=", true)
    );

    const unsubscribeNotify = onSnapshot(qNotify, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added" || (change.type === "modified" && change.doc.data().priority === "Critical")) {
          const incident = { id: change.doc.id, ...change.doc.data() } as any;
          
          // Trigger the Notification API
          try {
            await fetch("/api/notify-emergency", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                incidentId: incident.id,
                type: incident.type,
                priority: incident.priority
              })
            });
            console.log(`[Automation] Authorities notified for incident ${incident.id}`);
          } catch (error) {
            console.error("Failed to trigger emergency notification:", error);
          }
        }
      });
    });

    // 2. Original background logic for Assignment, SLA and Escalation
    const qMain = query(collection(db, "incidents"), where("status", "in", ["active", "investigating"]));
    const unsubscribeMain = onSnapshot(qMain, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const incident = { id: change.doc.id, ...change.doc.data() } as any;
          if (incident.status === "active" && !incident.assignedTeam) {
            await autoAssignTeam(incident);
          }
        }
      });
    });

    const interval = setInterval(async () => {
      const qActive = query(collection(db, "incidents"), where("status", "in", ["active", "investigating"]));
      const snapshot = await getDocs(qActive);
      const now = Date.now();

      snapshot.forEach(async (docSnap) => {
        const incident = { id: docSnap.id, ...docSnap.data() } as any;
        const createdAt = incident.timestamp?.seconds * 1000 || now;
        const durationSeconds = (now - createdAt) / 1000;
        let updates: any = {};

        // SLA BREACH
        const threshold = (incident.priority === "Critical" || incident.priority === "High") ? 300 : 600;
        if (durationSeconds > threshold && !incident.slaBreached) {
          updates.slaBreached = true;
          updates.priority = incident.priority === "Low" ? "Medium" : incident.priority === "Medium" ? "High" : "Critical";
          await addDoc(collection(db, "violations"), {
            incidentId: incident.id,
            type: "SLA_BREACH",
            timestamp: Timestamp.now(),
            description: `Response delay exceeded ${threshold/60}m for ${incident.priority} incident.`
          });
        }

        // AUTO ESCALATION
        if (incident.status === "active" && durationSeconds > 120 && incident.priority !== "Critical") {
          updates.priority = "Critical";
          updates.description = `[AUTO-ESCALATED] ${incident.description}`;
        }

        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, "incidents", incident.id), updates);
        }
      });
    }, 10000);

    return () => {
      unsubscribeNotify();
      unsubscribeMain();
      clearInterval(interval);
    };
  }, []);

  return null;
}

async function autoAssignTeam(incident: any) {
  const teamsQuery = query(collection(db, "teams"), where("status", "==", "available"));
  const teamsSnap = await getDocs(teamsQuery);
  if (!teamsSnap.empty) {
    const bestTeam = teamsSnap.docs[0];
    await updateDoc(doc(db, "incidents", incident.id), {
      assignedTeam: bestTeam.data().name,
      status: "investigating",
      assignmentTimestamp: Timestamp.now()
    });
  }
}
