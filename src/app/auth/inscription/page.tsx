"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";

export default function InscriptionPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      role: formData.get("role") as string,
    };

    const res = await fetch("/api/auth/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      if (body.details) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of body.details.issues || []) {
          if (issue.path?.[0]) {
            fieldErrors[issue.path[0]] = issue.message;
          }
        }
        setErrors(fieldErrors);
      } else {
        setError(body.error || "Une erreur est survenue");
      }
      setIsLoading(false);
      return;
    }

    // Connexion automatique après inscription
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Créer un compte
          </h1>
          <p className="text-center text-gray-500 mt-1">
            Rejoignez la communauté Saveurs Locales
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              id="name"
              name="name"
              label="Nom complet"
              placeholder="Jean Dupont"
              error={errors.name}
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="votre@email.fr"
              error={errors.email}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              placeholder="Min. 8 caractères"
              error={errors.password}
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmer le mot de passe"
              placeholder="Retapez votre mot de passe"
              error={errors.confirmPassword}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Je suis
              </label>
              <select
                name="role"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                defaultValue="CLIENT"
              >
                <option value="CLIENT">Un consommateur</option>
                <option value="PRODUCTEUR">Un producteur local</option>
              </select>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Créer mon compte
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link
              href="/auth/connexion"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
