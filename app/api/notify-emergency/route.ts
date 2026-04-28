import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { incidentId, type, priority } = await req.json();

    if (priority !== "Critical") {
      return NextResponse.json({ error: "Only Critical incidents trigger authority notification." }, { status: 400 });
    }

    // Determine service type based on incident type
    let serviceType = "Police";
    if (type.toLowerCase().includes("fire")) serviceType = "Fire Dept";
    if (type.toLowerCase().includes("medical")) serviceType = "Ambulance";

    // 1. Log the notification in "emergency_logs"
    const logRef = await addDoc(collection(db, "emergency_logs"), {
      incidentId,
      serviceType,
      status: "Dispatched",
      timestamp: Timestamp.now(),
      dispatchId: `DISP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });

    // 2. Update the incident to reflect notification status
    await updateDoc(doc(db, "incidents", incidentId), {
      authoritiesNotified: true,
      notificationTime: Timestamp.now(),
      serviceNotified: serviceType
    });

    return NextResponse.json({ 
      success: true, 
      service: serviceType, 
      logId: logRef.id 
    });
  } catch (error) {
    console.error("Notification API Error:", error);
    return NextResponse.json({ error: "Failed to notify authorities." }, { status: 500 });
  }
}
