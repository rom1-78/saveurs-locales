# Saveurs Locales

![CI Pipeline](https://github.com/rom1-78/saveurs-locales/actions/workflows/ci.yml/badge.svg?branch=dev)
![CD Pipeline](https://github.com/rom1-78/saveurs-locales/actions/workflows/cd.yml/badge.svg)

Marketplace e-commerce locale connectant des producteurs (fermiers, artisans) directement avec des consommateurs. Construite avec Next.js 14, PostgreSQL, Stripe et NextAuth.

## Stack technique

| Techno | Role |
|--------|------|
| **Next.js 14** (App Router) | Framework fullstack |
| **PostgreSQL + Prisma 5** | Base de donnees + ORM |
| **NextAuth v4** (JWT) | Authentification |
| **Stripe** | Paiement |
| **Tailwind CSS** | Styling |
| **Zod** | Validation des donnees |

## Architecture du projet

```
src/
├── app/
│   ├── page.tsx                    # Page d'accueil (hero, avantages, CTA)
│   ├── (shop)/                     # Pages boutique
│   │   ├── produits/               # Catalogue + detail produit
│   │   ├── panier/                 # Panier (auth requise)
│   │   └── commandes/              # Historique commandes (auth requise)
│   ├── auth/                       # Connexion, inscription, erreur
│   ├── producteur/                 # Dashboard producteur (role PRODUCTEUR/ADMIN)
│   ├── admin/                      # Dashboard admin (role ADMIN)
│   └── api/                        # Routes API REST
├── components/                     # Composants reutilisables (UI, layout, produits, panier)
├── lib/                            # Auth config, Prisma client, Stripe, utils, validations
├── types/                          # Types NextAuth augmentes
└── middleware.ts                   # Protection des routes par role
```

## Roles utilisateur

| Role | Acces |
|------|-------|
| **CLIENT** | Catalogue, panier, commandes, avis |
| **PRODUCTEUR** | Tout CLIENT + dashboard producteur, gestion produits/commandes |
| **ADMIN** | Tout + dashboard admin, gestion utilisateurs |

## Installation

### Prerequis

- **Node.js** v18+
- **PostgreSQL** en cours d'execution
- **Stripe CLI** (optionnel, pour tester les webhooks)

### 1. Installer les dependances

```bash
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Editez le fichier `.env` :

```env
# PostgreSQL - ajustez selon votre config
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saveurs_locales?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""  # OBLIGATOIRE - generez avec : openssl rand -base64 32

# Stripe (mode test) - recuperez vos cles sur dashboard.stripe.com
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Initialiser la base de donnees

```bash
# Creer les tables
npm run db:migrate

# Peupler avec les donnees de test (categories, utilisateurs, produits)
npm run db:seed
```

### 4. Lancer le serveur

```bash
npm run dev
```

L'application tourne sur **http://localhost:3000**.

## Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| `npm run dev` | `next dev` | Serveur de developpement |
| `npm run build` | `next build` | Build de production |
| `npm run start` | `next start` | Serveur de production |
| `npm run lint` | `next lint` | Linter ESLint |
| `npm test` | `jest` | Lancer les tests |
| `npm run test:coverage` | `jest --coverage` | Tests avec couverture |
| `npm run db:generate` | `prisma generate` | Generer le client Prisma |
| `npm run db:migrate` | `prisma migrate dev` | Appliquer les migrations |
| `npm run db:push` | `prisma db push` | Push schema sans migration |
| `npm run db:seed` | `npx tsx prisma/seed.ts` | Peupler la base de donnees |
| `npm run db:studio` | `prisma studio` | Interface visuelle de la BDD |

## Comptes de test

Crees automatiquement par `npm run db:seed` :

| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@saveurslocales.fr` | `Admin123!` |
| Producteur | `jean@fermedusoleil.fr` | `Producteur123!` |
| Client | `marie@email.fr` | `Client123!` |

## Routes API

| Methode | URL | Auth | Description |
|---------|-----|------|-------------|
| `GET` | `/api/produits` | Public | Lister les produits (filtres: `category`, `search`, `page`, `limit`) |
| `POST` | `/api/produits` | PRODUCTEUR+ | Creer un produit |
| `GET` | `/api/produits/[id]` | Public | Detail d'un produit avec avis |
| `PUT` | `/api/produits/[id]` | Proprietaire/ADMIN | Modifier un produit |
| `DELETE` | `/api/produits/[id]` | Proprietaire/ADMIN | Supprimer un produit |
| `GET` | `/api/produits/categories` | Public | Lister les categories |
| `GET` | `/api/panier` | Auth | Voir le panier |
| `POST` | `/api/panier` | Auth | Ajouter au panier |
| `DELETE` | `/api/panier` | Auth | Supprimer du panier |
| `POST` | `/api/stripe` | Auth | Creer une session de paiement |
| `POST` | `/api/stripe/webhook` | Stripe | Webhook post-paiement |
| `POST` | `/api/auth/inscription` | Public | Inscription |

## Guide de test des fonctionnalites

### 1. Page d'accueil

- Ouvrir **http://localhost:3000**
- Verifier le hero, les avantages, le CTA "Decouvrir nos produits"

### 2. Inscription et connexion

- Aller sur `/auth/inscription` et creer un compte (CLIENT ou PRODUCTEUR)
- Verifier les validations (email invalide, mot de passe trop court)
- Aller sur `/auth/connexion` et se connecter avec un compte de test
- Verifier que le header s'adapte au role (liens contextuels)

### 3. Catalogue produits

- Aller sur `/produits`
- Tester la **recherche** par mot-cle
- Tester le **filtre par categorie**
- Tester le **filtre par prix** (min/max)
- Tester la **pagination**
- Cliquer sur un produit pour voir sa **page detail**

### 4. Panier

> Connexion requise (ex: `marie@email.fr` / `Client123!`)

- Sur une page produit, ajuster la quantite et cliquer "Ajouter au panier"
- Aller sur `/panier`
- Verifier les produits, prix et quantites
- Tester la suppression d'un article
- Verifier le calcul du total

### 5. Paiement Stripe

- Depuis le panier, cliquer "Passer commande"
- Redirection vers Stripe Checkout
- Carte de test : `4242 4242 4242 4242`, date future, CVC quelconque
- Apres paiement, verifier la creation de la commande

### 6. Commandes

- Aller sur `/commandes`
- Verifier la liste avec les statuts
- Cliquer sur une commande pour voir le detail (articles, adresse, montant)

### 7. Avis produit

- Sur une page produit, laisser un avis (note + commentaire)
- Verifier qu'il apparait dans la liste des avis

### 8. Dashboard Producteur

> Connexion requise : `jean@fermedusoleil.fr` / `Producteur123!`

- `/producteur` : stats (produits, commandes, revenus)
- `/producteur/produits` : liste de ses produits
- `/producteur/produits/nouveau` : creer un nouveau produit
- `/producteur/commandes` : commandes contenant ses produits

### 9. Dashboard Admin

> Connexion requise : `admin@saveurslocales.fr` / `Admin123!`

- `/admin` : stats globales (utilisateurs, produits, commandes, revenus)
- `/admin/utilisateurs` : liste et roles des utilisateurs

### 10. Protection des routes

| Situation | Route testee | Resultat attendu |
|-----------|-------------|------------------|
| Deconnecte | `/panier`, `/commandes`, `/producteur`, `/admin` | Redirection vers `/auth/connexion` |
| CLIENT | `/producteur`, `/admin` | Redirection vers `/` |
| PRODUCTEUR | `/admin` | Redirection vers `/` |

### 11. Webhook Stripe (avance)

Pour tester le webhook qui finalise les commandes localement :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copiez le `whsec_...` affiche dans votre `.env` comme `STRIPE_WEBHOOK_SECRET`.

## Schema de la base de donnees

### Modeles principaux

- **User** : id, name, email, password (hashe), phone, role, timestamps
- **Category** : name, slug, description, image
- **Product** : name, slug, description, price, images[], stock, unit, isActive (lie a Category et User/producteur)
- **CartItem** : userId, productId, quantity (contrainte unique userId+productId)
- **Order** : orderNumber, status, paymentStatus, stripeSessionId, totalAmount (lie a User et Address)
- **OrderItem** : orderId, productId, quantity, unitPrice
- **Address** : userId, label, street, city, postalCode, country, isDefault
- **Delivery** : orderId, trackingNumber, estimatedDate, deliveredAt, status
- **Review** : userId, productId, rating (1-5), comment (contrainte unique userId+productId)
- **Notification** : userId, title, message, isRead

### Enums

- **Role** : `CLIENT`, `PRODUCTEUR`, `ADMIN`
- **OrderStatus** : `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- **PaymentStatus** : `PENDING`, `PAID`, `FAILED`, `REFUNDED`

## Docker

```bash
# Lancer avec Docker Compose (app + PostgreSQL)
docker compose up -d

# Voir les logs
docker compose logs -f

# Arreter
docker compose down
```

## DevOps

- **CI** : Lint + Test (Node 18/20/22) + Build (GitHub Actions)
- **CD** : Deploy staging (branche `test`) + production (branche `main`)
- **Branches** : `main` (prod) / `test` (staging) / `dev` (dev) / `feature/*`
- **Health check** : `GET /api/health`
