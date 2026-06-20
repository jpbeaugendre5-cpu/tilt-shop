# TILT.SHOP — Todo

## Phase 1 : Base de données & Backend
- [x] Schema DB : products, categories, orders, order_items, cart, cart_items, favorites, ai_campaigns, ai_pricing_history, ai_validation_queue, ai_metrics
- [x] Migration SQL et application
- [x] Helpers DB dans server/db.ts
- [x] Routers tRPC : products, categories, cart, orders, favorites, ai, admin

## Phase 2 : Frontend Client
- [x] index.css — charte Noir/Jaune/Blanc, typographie, animations
- [x] client/index.html — fonts Google (Space Grotesk + Inter)
- [x] App.tsx — routes complètes (/, /catalogue, /produit/:id, /panier, /checkout, /confirmation, /compte, /admin/*)
- [x] Navbar — logo TILT.SHOP, navigation, panier, compte
- [x] Footer — liens, réseaux, newsletter
- [x] Page Home — Hero animé, produits phares, sections IA, réassurance
- [x] Page Catalogue — filtres, recherche, grille produits, badges Innovation/Tendance
- [x] Page Fiche Produit — images, description, recommandations IA, ajout panier
- [x] Page Panier — récapitulatif, quantités, total
- [x] Page Checkout — formulaire livraison, confirmation
- [x] Page Confirmation — succès commande
- [x] Page Compte — historique commandes, favoris, paramètres
- [x] Chatbot IA — assistant shopping flottant (AIChatWidget)

## Phase 3 : Tableau de bord Admin IA
- [x] Layout Admin — sidebar 90/10, navigation, indicateur IA actif
- [x] Dashboard Overview — métriques KPIs, graphiques recharts, contrôle 90/10
- [x] Gestion Produits — CRUD complet avec formulaire
- [x] Gestion Pub IA — campagnes générées par IA, CTR, ROI, pause/play
- [x] File de Validation Humaine — décisions IA en attente, Approuver/Rejeter
- [x] Pricing Dynamique IA — analyse par produit, historique ajustements
- [x] Gestion Commandes — liste, stats, recherche

## Phase 4 : Données de démonstration
- [x] Seed 12 produits innovants avec images
- [x] Seed 7 campagnes pub IA (active, paused, pending_approval, draft)
- [x] Seed 6 décisions en file de validation humaine
- [x] Seed 5 historiques de pricing dynamique IA
- [x] Seed 7 jours de métriques IA pour le dashboard

## Phase 5 : Tests & Livraison
- [x] 11/11 Tests Vitest passés
- [x] 0 erreur TypeScript
- [x] Charte graphique revue : pro et rassurante
- [x] Checkpoint final

## Phase 6 : Images & Dynamisme (demande utilisateur)
- [x] Générer une image hero produits innovants pour la homepage
- [x] Générer 12 images produits + 1 image hero (charte noir/jaune)
- [x] Injecter les 12 produits avec images dans la base de données
- [x] Ajouter une vraie image visuelle dans le Hero (mise en page 2 colonnes)
- [x] Ajouter 4 catégories
- [x] Intégrer AIChatWidget sur toutes les pages
- [x] Retirer toute fausse preuve sociale (conformité politique avis)
- [x] Vérifier le rendu final avec produits affichés (capture validée)
