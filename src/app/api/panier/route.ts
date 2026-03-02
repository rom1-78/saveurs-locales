import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Récupérer le panier
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          category: true,
          producer: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return NextResponse.json({ items: cartItems, total });
}

// POST - Ajouter au panier
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { productId, quantity = 1 } = await request.json();

  // Vérifier le produit et le stock
  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  if (product.stock < quantity) {
    return NextResponse.json(
      { error: "Stock insuffisant" },
      { status: 400 }
    );
  }

  // Ajouter ou mettre à jour
  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      userId: session.user.id,
      productId,
      quantity,
    },
  });

  return NextResponse.json(cartItem);
}

// DELETE - Supprimer du panier
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { productId } = await request.json();

  await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
