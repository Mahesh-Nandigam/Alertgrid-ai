import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "demo-key";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateTacticalPlan(scenario: string, location: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are an industrial emergency response AI for AlertGrid AI.
      Scenario: ${scenario} detected at ${location}
      Generate a high-impact tactical response plan.

      Provide:
      1. CRITICAL_ACTION: A single most important first step (max 10 words)
      2. TACTICAL_STEPS: 4-5 highly specific, actionable bullets (e.g., "Shut down HVAC", "Evacuate via Exit B")
      3. TEAM_ASSIGNMENTS: Who needs to go where
      4. SAFETY_PRECAUTION: One critical danger to avoid

      Avoid generic advice. Be precise and professional.
      Format the response as a valid JSON object like this:
      {
        "criticalAction": "...",
        "steps": ["...", "..."],
        "assignments": ["...", "..."],
        "precaution": "..."
      }
    `;

    if (apiKey === "demo-key") {
       // Return realistic mock JSON for demo purposes
       return JSON.stringify({
         criticalAction: "INITIATE IMMEDIATE LOCKDOWN OF AFFECTED ZONE",
         steps: [
           "Activate localized fire suppression systems",
           "Disable all non-emergency elevator services",
           "Deploy manual override on electronic access gates",
           "Broadcast emergency frequency on all handheld units"
         ],
         assignments: [
           "Security Team Alpha to North Perimeter",
           "Medical Response to Lobby Staging Area",
           "Maintenance Team to Central Valve Room"
         ],
         precaution: "AVOID USING WATER-BASED EXTINGUISHERS ON ELECTRICAL FIRES"
       });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating tactical plan:", error);
    return null;
  }
}

// Alias for backward compatibility and specialized incident logging
export const generateIncidentResponse = generateTacticalPlan;
