import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const addressId = session.metadata?.addressId;

    if (!userId || !addressId) {
      return NextResponse.json({ error: "Metadata manquante" }, { status: 400 });
    }

    // Récupérer le panier
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        orderNumber: generateOrderNumber(),
        totalAmount,
        paymentStatus: "PAID",
        status: "CONFIRMED",
        stripeSessionId: session.id,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
        delivery: {
          create: {
            status: "PENDING",
          },
        },
      },
    });

    // Mettre à jour les stocks
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Vider le panier
    await prisma.cartItem.deleteMany({ where: { userId } });

    // Notification
    await prisma.notification.create({
      data: {
        userId,
        title: "Commande confirmée",
        message: `Votre commande ${order.orderNumber} a été confirmée. Merci pour votre achat !`,
      },
    });
  }

  return NextResponse.json({ received: true });
}
