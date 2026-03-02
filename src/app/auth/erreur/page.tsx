"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";

export default function AuthErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <h1 className="text-2xl font-bold text-red-600">
            Erreur d&apos;authentification
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Une erreur est survenue lors de l&apos;authentification. Veuillez
            réessayer.
          </p>
          <Link href="/auth/connexion">
            <Button>Retour à la connexion</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
