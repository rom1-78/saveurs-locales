import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Récupérer le panier
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }

  // Vérifier l'adresse par défaut
  const address = await prisma.address.findFirst({
    where: { userId: session.user.id, isDefault: true },
  });

  if (!address) {
    return NextResponse.json(
      { error: "Veuillez ajouter une adresse de livraison" },
      { status: 400 }
    );
  }

  // Créer la session Stripe
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: session.user.email!,
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          images: item.product.images.slice(0, 1),
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    })),
    metadata: {
      userId: session.user.id,
      addressId: address.id,
    },
    success_url: `${process.env.NEXTAUTH_URL}/commandes?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/panier?cancelled=true`,
  });

  return NextResponse.json({ url: stripeSession.url });
}
