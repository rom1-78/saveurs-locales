import { formatPrice, slugify, truncate, generateOrderNumber } from "@/lib/utils";

describe("formatPrice", () => {
  test("formate un prix en euros", () => {
    const result = formatPrice(12.5);
    expect(result).toContain("12,50");
    expect(result).toContain("€");
  });

  test("formate un prix à 0", () => {
    const result = formatPrice(0);
    expect(result).toContain("0,00");
  });
});

describe("slugify", () => {
  test("convertit un texte simple en slug", () => {
    expect(slugify("Fromage de Chèvre")).toBe("fromage-de-chevre");
  });

  test("supprime les accents", () => {
    expect(slugify("Pâté de Campagne")).toBe("pate-de-campagne");
  });

  test("supprime les caractères spéciaux", () => {
    expect(slugify("Miel & Confiture!")).toBe("miel-confiture");
  });

  test("gère les espaces multiples", () => {
    expect(slugify("Pain   au   levain")).toBe("pain-au-levain");
  });
});

describe("truncate", () => {
  test("tronque un texte trop long", () => {
    expect(truncate("Bonjour le monde", 7)).toBe("Bonjour...");
  });

  test("ne tronque pas un texte court", () => {
    expect(truncate("Court", 10)).toBe("Court");
  });

  test("gère la longueur exacte", () => {
    expect(truncate("Exact", 5)).toBe("Exact");
  });
});

describe("generateOrderNumber", () => {
  test("commence par SL-", () => {
    const order = generateOrderNumber();
    expect(order).toMatch(/^SL-/);
  });

  test("a le bon format", () => {
    const order = generateOrderNumber();
    expect(order).toMatch(/^SL-\d{6}-[A-Z0-9]{5}$/);
  });

  test("génère des numéros uniques", () => {
    const order1 = generateOrderNumber();
    const order2 = generateOrderNumber();
    expect(order1).not.toBe(order2);
  });
});
