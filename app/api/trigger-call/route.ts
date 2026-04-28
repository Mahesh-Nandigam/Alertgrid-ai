import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { numbers, message } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const flowSid = process.env.TWILIO_STUDIO_FLOW_SID;

    if (!accountSid || !authToken || !flowSid) {
      return NextResponse.json({ error: "Twilio credentials not configured." }, { status: 500 });
    }

    const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
    
    const results = await Promise.all(
      numbers.map(async (to: string) => {
        try {
          // Trigger Twilio Studio Flow using REST API
          const response = await fetch(
            `https://studio.twilio.com/v2/Flows/${flowSid}/Executions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: authHeader,
              },
              body: new URLSearchParams({
                To: to,
                From: fromNumber || "",
                Parameters: JSON.stringify({ message }),
              }),
            }
          );

          if (!response.ok) {
            const err = await response.json();
            console.error(`Twilio Error for ${to}:`, err);
            return { number: to, status: "failed", error: err.message };
          }

          return { number: to, status: "success" };
        } catch (error: any) {
          return { number: to, status: "failed", error: error.message };
        }
      })
    );

    const successCount = results.filter(r => r.status === "success").length;
    const failureCount = results.length - successCount;

    return NextResponse.json({ 
      success: true, 
      results,
      summary: { successCount, failureCount }
    });

  } catch (error: any) {
    console.error("Twilio Trigger API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
