# CAHIER DES CHARGES — PANDORE
## Plateforme E-Commerce & Livraison Premium

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
PANDORE est une plateforme e-commerce premium développée dans le cadre d'un projet étudiant. Elle simule un système complet de vente en ligne avec gestion des livraisons, des paiements, des newsletters et de la configuration du site.

### 1.2 Objectifs
- Fournir une expérience d'achat fluide et moderne aux clients
- Permettre à l'administrateur de gérer l'intégralité de la plateforme
- Offrir aux livreurs une interface dédiée pour gérer leurs livraisons
- Simuler un système de paiement réaliste sans intégration bancaire réelle

### 1.3 Périmètre
Application web full-stack accessible via navigateur, sans application mobile native.

---

## 2. ACTEURS DU SYSTÈME

| Acteur | Description |
|--------|-------------|
| **Client (Customer)** | Utilisateur final qui parcourt le catalogue, commande et suit ses livraisons |
| **Administrateur (Admin)** | Gestionnaire de la plateforme avec accès complet |
| **Livreur (Delivery Man)** | Personnel de livraison avec accès à sa file d'attente |

---

## 3. BESOINS FONCTIONNELS

### 3.1 Authentification
- **F01** — Inscription d'un nouveau compte client
- **F02** — Connexion par identifiant/mot de passe
- **F03** — Déconnexion sécurisée
- **F04** — Rafraîchissement automatique du token JWT (HTTP-only cookies)
- **F05** — Récupération des informations de l'utilisateur connecté

### 3.2 Catalogue
- **F06** — Affichage de la liste des produits actifs
- **F07** — Recherche par nom, description, catégorie ou tag
- **F08** — Filtrage par catégorie, tag, prix min/max
- **F09** — Tri par prix ou date de création
- **F10** — Affichage du détail d'un produit (attributs, stock, produits liés)
- **F11** — Historique des produits récemment consultés

### 3.3 Panier & Commande
- **F12** — Ajout/suppression/modification de quantité dans le panier
- **F13** — Persistance du panier en localStorage (Zustand)
- **F14** — Sélection d'une adresse de livraison sauvegardée ou saisie manuelle
- **F15** — Sélection d'un moyen de paiement
- **F16** — Validation de la commande avec vérification du stock
- **F17** — Simulation de confirmation de paiement (délai 2s + référence SIM-XXXX)
- **F18** — Consultation de l'historique des commandes
- **F19** — Suivi du statut d'une commande

### 3.4 Wishlist
- **F20** — Ajout/suppression d'un produit dans la wishlist
- **F21** — Affichage de la wishlist
- **F22** — Ajout au panier depuis la wishlist

### 3.5 Profil utilisateur
- **F23** — Modification des informations personnelles (nom, email, téléphone)
- **F24** — Upload et suppression de l'avatar
- **F25** — Gestion des adresses de livraison (CRUD + adresse par défaut)
- **F26** — Changement de mot de passe
- **F27** — Gestion de l'abonnement newsletter

### 3.6 Newsletter
- **F28** — Abonnement via le footer ou la page profil
- **F29** — Désabonnement à tout moment
- **F30** — Vérification du statut d'abonnement

### 3.7 Devises
- **F31** — Sélection de la devise d'affichage dans la navbar
- **F32** — Conversion des prix en temps réel (base XAF)
- **F33** — Persistance du choix de devise (localStorage)

### 3.8 Administration — Catalogue
- **F34** — CRUD complet sur les produits (nom, slug, prix, stock, image, catégorie, tags, attributs)
- **F35** — CRUD complet sur les catégories
- **F36** — CRUD complet sur les tags
- **F37** — Gestion des sections de la page d'accueil (hero carousel, product row, category banner, promo banner)

### 3.9 Administration — Commandes
- **F38** — Consultation de toutes les commandes avec filtrage par statut
- **F39** — Assignation d'une commande à un livreur

### 3.10 Administration — Paiements
- **F40** — CRUD sur les moyens de paiement (nom, logo, instructions)
- **F41** — Consultation de l'historique des paiements

### 3.11 Administration — Newsletter
- **F42** — Création et édition de newsletters (éditeur Markdown)
- **F43** — Envoi simulé d'une newsletter aux abonnés actifs
- **F44** — Consultation de la liste des abonnés

### 3.12 Administration — Devises
- **F45** — CRUD sur les devises (code, nom, symbole, taux vs XAF)
- **F46** — Définition de la devise par défaut

### 3.13 Administration — Configuration du site
- **F47** — Modification des informations du site (nom, tagline, description, logo)
- **F48** — Modification des informations de contact (email, téléphone, adresse)
- **F49** — Configuration du prix et seuil de livraison gratuite
- **F50** — Gestion des réseaux sociaux (CRUD)
- **F51** — Suppression du logo

### 3.14 Administration — Utilisateurs
- **F52** — Consultation de tous les utilisateurs
- **F53** — Modification du rôle et du statut d'un utilisateur
- **F54** — Suppression d'un compte utilisateur

### 3.15 Livraison
- **F55** — Consultation de la file d'attente des commandes assignées
- **F56** — Mise à jour du statut d'une commande (assigned → picked_up → in_transit → delivered)

---

## 4. BESOINS NON FONCTIONNELS

| ID | Exigence |
|----|----------|
| **NF01** | Sécurité : tokens JWT stockés en cookies HTTP-only (inaccessibles au JavaScript) |
| **NF02** | Performance : TanStack Query pour le cache et la revalidation des données |
| **NF03** | Réactivité : interface responsive (mobile, tablette, desktop) |
| **NF04** | UX : animations fluides via Framer Motion |
| **NF05** | Persistance : panier et devise persistés en localStorage via Zustand |
| **NF06** | Découplage : chaque app Django a une responsabilité unique |
| **NF07** | Extensibilité : architecture modulaire permettant l'ajout de nouvelles fonctionnalités |
| **NF08** | Simulation : les paiements et envois de newsletters sont simulés (pas de vrai prestataire) |

---

## 5. STACK TECHNIQUE

### Backend
| Technologie | Rôle |
|-------------|------|
| Python 3.x | Langage principal |
| Django 5.x | Framework web |
| Django REST Framework | API REST |
| SimpleJWT | Authentification JWT |
| SQLite | Base de données (développement) |

### Frontend
| Technologie | Rôle |
|-------------|------|
| Next.js 16 (App Router) | Framework React SSR/CSR |
| TypeScript | Typage statique |
| Axios | Client HTTP + intercepteurs |
| TanStack Query v5 | Cache et synchronisation serveur |
| Zustand | État global client (panier, devise) |
| Framer Motion | Animations |
| Shadcn/UI + Tailwind CSS | Composants UI |
| @uiw/react-md-editor | Éditeur Markdown (newsletter) |

---

## 6. ARCHITECTURE BACKEND

```
backend/
  authentication/   → JWT cookie login, logout, refresh, register, me
  users/            → User model, profil, mot de passe, gestion admin
  addresses/        → ShippingAddress CRUD
  wishlist/         → Wishlist toggle
  payments/         → PaymentMethod + Payment simulé
  newsletter/       → Subscriber + Newsletter draft/send
  currencies/       → Currency + taux de change (base XAF)
  site_config/      → SiteSettings singleton + SocialLink
  catalog/          → Category, Tag, Product, HomepageSection
  orders/           → Order, OrderItem, DeliveryAssignment
  core/             → Permissions partagées (IsAdminRole, IsDelivery)
```

---

## 7. MODÈLE DE DONNÉES PRINCIPAL

### Entités clés
- **User** : id, username, email, role (admin/delivery/customer), phone, avatar
- **Product** : id, name, slug, description, price (XAF), stock, image, category, tags
- **Order** : id, customer, status, shipping_address, total_price, items[]
- **Payment** : id, order, method, status (pending/confirmed/failed), transaction_ref
- **Currency** : id, code, name, symbol, rate (vs XAF), is_default
- **SiteSettings** : singleton — nom, logo, contact, shipping config

### Statuts de commande
```
pending → assigned → picked_up → in_transit → delivered
                                              cancelled (depuis pending)
```

### Statuts de paiement
```
pending → confirmed
        → failed
```

---

## 8. ENDPOINTS API PRINCIPAUX

```
POST   /api/auth/login/
POST   /api/auth/register/
GET    /api/catalog/products/
POST   /api/orders/checkout/
POST   /api/payments/{orderId}/confirm/
GET    /api/currencies/
GET    /api/site-config/
POST   /api/newsletter/subscribe/
```

---

## 9. CONTRAINTES

- Les prix sont **toujours stockés en XAF** — la conversion est faite côté client
- Un seul singleton `SiteSettings` (pk=1 forcé)
- Une seule devise par défaut à la fois
- Le panier est **client-side uniquement** (Zustand + localStorage)
- Les paiements et newsletters sont **simulés** — aucun prestataire réel en développement
- Les tokens JWT ne sont **jamais exposés au JavaScript** (HTTP-only cookies)

---

## 10. COMPTES DE DÉMONSTRATION

| Identifiant | Mot de passe | Rôle |
|-------------|--------------|------|
| admin | admin123 | Administrateur |
| delivery1 | delivery123 | Livreur |
| delivery2 | delivery123 | Livreur |
| customer1 | customer123 | Client |

---

*Document rédigé dans le cadre du projet étudiant PANDORE — v2.4*
