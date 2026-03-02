"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function addToCart() {
    if (!session) {
      router.push("/auth/connexion");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const res = await fetch("/api/panier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    if (res.ok) {
      setMessage("Ajouté au panier !");
      setTimeout(() => setMessage(""), 3000);
    } else {
      const data = await res.json();
      setMessage(data.error || "Erreur lors de l'ajout");
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-lg font-medium w-12 text-center">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Button onClick={addToCart} isLoading={isLoading} className="w-full">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Ajouter au panier
      </Button>

      {message && (
        <p
          className={`text-sm text-center ${message.includes("Erreur") ? "text-red-600" : "text-green-600"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
