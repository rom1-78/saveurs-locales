import { z } from "zod";

export const connexionSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const inscriptionSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "PRODUCTEUR"]).optional().default("CLIENT"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ConnexionInput = z.infer<typeof connexionSchema>;
export type InscriptionInput = z.infer<typeof inscriptionSchema>;
