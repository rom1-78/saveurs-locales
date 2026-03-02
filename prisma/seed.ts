import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "fruits" },
      update: {},
      create: { name: "Fruits", slug: "fruits", description: "Fruits frais de saison" },
    }),
    prisma.category.upsert({
      where: { slug: "legumes" },
      update: {},
      create: { name: "Légumes", slug: "legumes", description: "Légumes frais du potager" },
    }),
    prisma.category.upsert({
      where: { slug: "fromages" },
      update: {},
      create: { name: "Fromages", slug: "fromages", description: "Fromages artisanaux" },
    }),
    prisma.category.upsert({
      where: { slug: "viandes" },
      update: {},
      create: { name: "Viandes", slug: "viandes", description: "Viandes d'élevage local" },
    }),
    prisma.category.upsert({
      where: { slug: "miel-confitures" },
      update: {},
      create: { name: "Miel & Confitures", slug: "miel-confitures", description: "Miel et confitures maison" },
    }),
    prisma.category.upsert({
      where: { slug: "boissons" },
      update: {},
      create: { name: "Boissons", slug: "boissons", description: "Jus, cidres et boissons artisanales" },
    }),
    prisma.category.upsert({
      where: { slug: "pain-patisserie" },
      update: {},
      create: { name: "Pain & Pâtisserie", slug: "pain-patisserie", description: "Pain et pâtisseries artisanales" },
    }),
  ]);

  // Admin
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@saveurslocales.fr" },
    update: {},
    create: {
      name: "Administrateur",
      email: "admin@saveurslocales.fr",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Producteur
  const producerPassword = await bcrypt.hash("Producteur123!", 12);
  const producer = await prisma.user.upsert({
    where: { email: "jean@fermedusoleil.fr" },
    update: {},
    create: {
      name: "Jean Dupont",
      email: "jean@fermedusoleil.fr",
      password: producerPassword,
      role: "PRODUCTEUR",
    },
  });

  // Client
  const clientPassword = await bcrypt.hash("Client123!", 12);
  const client = await prisma.user.upsert({
    where: { email: "marie@email.fr" },
    update: {},
    create: {
      name: "Marie Martin",
      email: "marie@email.fr",
      password: clientPassword,
      role: "CLIENT",
    },
  });

  // Adresse pour le client
  await prisma.address.upsert({
    where: { id: "seed-address-1" },
    update: {},
    create: {
      id: "seed-address-1",
      userId: client.id,
      label: "Domicile",
      street: "12 rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      isDefault: true,
    },
  });

  // Produits
  const products = [
    {
      name: "Tomates cerises bio",
      slug: "tomates-cerises-bio",
      description: "Tomates cerises cultivées en plein champ, sans pesticides. Parfaites pour vos salades et apéritifs. Récoltées à maturité pour un goût incomparable.",
      price: 4.50,
      stock: 50,
      unit: "kg",
      categoryId: categories[1].id,
    },
    {
      name: "Fraises Gariguette",
      slug: "fraises-gariguette",
      description: "Fraises Gariguette cultivées sous serre non chauffée. Sucrées et parfumées, elles sont idéales pour les desserts ou à déguster nature.",
      price: 6.00,
      stock: 30,
      unit: "barquette",
      categoryId: categories[0].id,
    },
    {
      name: "Camembert fermier",
      slug: "camembert-fermier",
      description: "Camembert au lait cru, affiné pendant 4 semaines minimum. Fabriqué de manière traditionnelle dans notre fromagerie.",
      price: 5.50,
      stock: 20,
      unit: "piece",
      categoryId: categories[2].id,
    },
    {
      name: "Miel de lavande",
      slug: "miel-de-lavande",
      description: "Miel récolté dans les champs de lavande de Provence. Un goût délicat et fleuri, parfait pour accompagner vos tartines et tisanes.",
      price: 12.00,
      stock: 40,
      unit: "pot",
      categoryId: categories[4].id,
    },
    {
      name: "Jus de pomme artisanal",
      slug: "jus-de-pomme-artisanal",
      description: "Jus de pomme pressé à froid, sans sucre ajouté ni conservateur. Fabriqué avec des pommes de notre verger.",
      price: 3.80,
      stock: 60,
      unit: "litre",
      categoryId: categories[5].id,
    },
    {
      name: "Pain au levain",
      slug: "pain-au-levain",
      description: "Pain au levain naturel, pétri à la main et cuit au feu de bois. Croûte croustillante et mie aérée.",
      price: 4.00,
      stock: 15,
      unit: "piece",
      categoryId: categories[6].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        producerId: producer.id,
        images: [],
      },
    });
  }

  console.log("Seed completed!");
  console.log("---");
  console.log("Comptes de test :");
  console.log("  Admin:      admin@saveurslocales.fr / Admin123!");
  console.log("  Producteur: jean@fermedusoleil.fr / Producteur123!");
  console.log("  Client:     marie@email.fr / Client123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
