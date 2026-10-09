import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { BOOKING_FUNCTION_DECLARATIONS, checkAvailabilityHandler, proposeBookingHandler } from "@/lib/booking-tool";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Le message est obligatoire." }, { status: 400 });
    }

    // Convert history format to Gemini Contents format
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((h: { role: string; text: string }) => {
        contents.push({
          role: h.role === "model" ? "model" : "user",
          parts: [{ text: h.text }]
        });
      });
    }

    // Append current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Call Gemini 3.8 Flash with function declarations
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: BOOKING_FUNCTION_DECLARATIONS as any }],
        temperature: 0.5
      }
    });

    let replyText = response.text || "";
    const toolCallsExecuted: any[] = [];

    // Check if model returned function calls
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      for (const call of functionCalls) {
        if (call.name === "check_availability") {
          const result = checkAvailabilityHandler((call.args as any)?.date);
          toolCallsExecuted.push({ name: call.name, args: call.args, result });
          if (!replyText) {
            replyText = `Voici les créneaux disponibles pour le ${result.date} : ${result.availableSlots.slice(0, 4).join(", ")}. Souhaitez-vous que je prépare votre réservation ?`;
          }
        } else if (call.name === "propose_booking") {
          const result = proposeBookingHandler(call.args as any);
          toolCallsExecuted.push({ name: call.name, args: call.args, result });
          if (!replyText) {
            replyText = `C'est noté. Je prépare votre rendez-vous pour le ${result.details.date} à ${result.details.time} (${result.details.motif}). Je vous redirige vers la confirmation.`;
          }
        }
      }
    }

    if (!replyText && toolCallsExecuted.length === 0) {
      replyText = "Je suis à votre écoute pour toute question concernant le cabinet du Dr. Larbi Nassiba ou pour vous aider à réserver une consultation.";
    }

    return NextResponse.json({
      reply: replyText,
      toolCalls: toolCallsExecuted
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement par l'assistante." },
      { status: 500 }
    );
  }
}
