import { z } from "zod";

export const orderSchema = z.object({
  addressId: z.string().min(1, "L'adresse de livraison est requise"),
});

export const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  country: z.string().optional().default("France"),
  isDefault: z.boolean().optional().default(false),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
