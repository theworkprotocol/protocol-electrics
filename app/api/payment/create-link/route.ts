import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, customerName, customerEmail, jobRef } = body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: description,
              metadata: { jobRef: jobRef || "" },
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://www.protocolelectrics.com.au/pay/success",
      cancel_url: "https://www.protocolelectrics.com.au/pay/cancelled",
      customer_email: customerEmail || undefined,
      metadata: {
        jobRef: jobRef || "",
        customerName: customerName || "",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[stripe] Failed to create payment link:", err);
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 });
  }
}
