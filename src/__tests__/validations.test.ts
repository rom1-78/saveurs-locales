import { productSchema, productFilterSchema } from "@/lib/validations/product";

describe("productSchema", () => {
  test("valide un produit correct", () => {
    const result = productSchema.safeParse({
      name: "Fromage de chèvre",
      description: "Un délicieux fromage artisanal de notre ferme",
      price: 8.5,
      stock: 20,
      unit: "pièce",
      categoryId: "cat-123",
    });
    expect(result.success).toBe(true);
  });

  test("rejette un nom trop court", () => {
    const result = productSchema.safeParse({
      name: "A",
      description: "Une description valide assez longue",
      price: 8.5,
      stock: 20,
      unit: "pièce",
      categoryId: "cat-123",
    });
    expect(result.success).toBe(false);
  });

  test("rejette un prix négatif", () => {
    const result = productSchema.safeParse({
      name: "Fromage",
      description: "Une description valide assez longue",
      price: -5,
      stock: 20,
      unit: "pièce",
      categoryId: "cat-123",
    });
    expect(result.success).toBe(false);
  });

  test("rejette un stock négatif", () => {
    const result = productSchema.safeParse({
      name: "Fromage",
      description: "Une description valide assez longue",
      price: 8.5,
      stock: -1,
      unit: "pièce",
      categoryId: "cat-123",
    });
    expect(result.success).toBe(false);
  });
});

describe("productFilterSchema", () => {
  test("accepte un filtre vide", () => {
    const result = productFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  test("applique les valeurs par défaut", () => {
    const result = productFilterSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(12);
  });

  test("rejette une limite trop élevée", () => {
    const result = productFilterSchema.safeParse({ limit: 100 });
    expect(result.success).toBe(false);
  });
});
