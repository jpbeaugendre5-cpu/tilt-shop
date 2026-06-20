# Guide de déploiement — TILT.SHOP

Ce document explique comment héberger **TILT.SHOP** sur votre propre infrastructure.

> **Important — Type d'application**
> TILT.SHOP n'est **pas** un simple site statique. C'est une **application full-stack** :
> - **Frontend** : React 19 + Vite + Tailwind CSS 4
> - **Backend** : Node.js + Express + tRPC (un serveur Node doit tourner en permanence)
> - **Base de données** : MySQL 8+ (ou compatible TiDB)
>
> Un hébergement « mutualisé » classique (type OVH perso, simple FTP pour HTML) **ne suffit pas**. Il vous faut un hébergeur capable d'exécuter **Node.js** + une **base MySQL**. Voir la section « Hébergeurs compatibles » plus bas.

---

## 1. Contenu de l'archive

```
tilt-shop/
├── client/              → Code frontend (React)
├── server/              → Code backend (Express + tRPC)
├── drizzle/             → Schéma de base de données + migrations
├── shared/              → Types partagés
├── storage/             → Helpers de stockage de fichiers (S3)
├── package.json         → Dépendances et scripts
├── SEED_DATA.sql        → Données de démarrage (12 produits, campagnes, etc.)
├── GUIDE_DEPLOIEMENT.md → Ce fichier
└── .env.example         → Modèle de variables d'environnement (à créer, voir étape 3)
```

> `node_modules` n'est **pas** inclus (volontairement). Il sera régénéré avec `pnpm install`.

---

## 2. Prérequis sur le serveur

- **Node.js 20+** (idéalement 22) et **pnpm** (`npm install -g pnpm`)
- Une **base de données MySQL 8+** accessible (locale ou managée)
- Un certificat **HTTPS** (Let's Encrypt, Cloudflare, ou fourni par l'hébergeur)

---

## 3. Variables d'environnement

Créez un fichier `.env` à la racine du projet avec **au minimum** :

```bash
# --- Base de données (OBLIGATOIRE) ---
DATABASE_URL="mysql://utilisateur:motdepasse@adresse-hote:3306/tiltshop"

# --- Sécurité session (OBLIGATOIRE) ---
JWT_SECRET="remplacez-par-une-longue-chaine-aleatoire-securisee"

# --- Port d'écoute (souvent fourni par l'hébergeur) ---
PORT=3000
```

### Fonctionnalités dépendantes de l'écosystème Manus

Certaines fonctionnalités utilisent des services Manus et **cesseront de fonctionner hors de Manus** sauf si vous les remplacez :

| Fonctionnalité | Variable concernée | Solution hors Manus |
|---|---|---|
| Connexion / comptes utilisateurs | `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` | Remplacer par votre propre OAuth (Google, Auth0…) ou un système email/mot de passe |
| Chatbot IA & recommandations | `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Brancher votre clé OpenAI / autre fournisseur LLM |
| Images produits (CDN) | URLs CloudFront dans `SEED_DATA.sql` | Réhéberger les images chez vous et mettre à jour les URLs |
| Stockage de fichiers | Clés S3 | Configurer votre propre bucket S3 / compatible |

> Sans ces remplacements, le **catalogue, le panier, le checkout et l'admin** fonctionnent ; mais la **connexion** et le **chatbot IA** devront être reconnectés à vos propres services.

---

## 4. Installation et build

```bash
# 1. Décompresser l'archive et entrer dans le dossier
unzip tilt-shop.zip && cd tilt-shop

# 2. Installer les dépendances
pnpm install

# 3. Créer les tables dans votre base MySQL
pnpm drizzle-kit generate     # génère le SQL de migration
pnpm drizzle-kit migrate      # applique le schéma à votre base

# 4. (Optionnel) Charger les données de démarrage
#    Via votre client MySQL :
mysql -u UTILISATEUR -p NOM_BASE < SEED_DATA.sql

# 5. Compiler l'application pour la production
pnpm build

# 6. Démarrer le serveur
pnpm start
```

Le serveur écoute alors sur le port défini (`PORT`, par défaut 3000). Placez un **reverse proxy** (Nginx, Caddy) devant pour gérer le HTTPS et le domaine.

---

## 5. Exemple de configuration Nginx

```nginx
server {
    listen 443 ssl;
    server_name votre-domaine.com;

    ssl_certificate     /chemin/fullchain.pem;
    ssl_certificate_key /chemin/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Pour maintenir le serveur Node actif en permanence, utilisez **PM2** :

```bash
npm install -g pm2
pm2 start "pnpm start" --name tilt-shop
pm2 save && pm2 startup
```

---

## 6. Hébergeurs compatibles (Node + MySQL)

| Hébergeur | Node.js | MySQL | Remarque |
|---|---|---|---|
| **Railway** | Oui | Oui (add-on) | Déploiement simple par Git |
| **Render** | Oui | Oui (managé) | Plan gratuit disponible |
| **Fly.io** | Oui | Via add-on | Bon pour le global |
| **VPS** (Hetzner, OVH VPS, DigitalOcean) | Oui | À installer | Contrôle total, nécessite config manuelle |
| **PlanetScale / TiDB Cloud** | — | Oui | Base de données managée seule |

> Hébergement mutualisé FTP classique (sites HTML statiques) : **non compatible** car il n'exécute pas Node.js.

---

## 7. Promotion d'un compte en administrateur

Une fois connecté avec votre méthode d'authentification, exécutez en base :

```sql
UPDATE users SET role = 'admin' WHERE email = 'votre-email@exemple.com';
```

Vous aurez alors accès au tableau de bord IA sur `/admin`.

---

## 8. Récapitulatif des pages

**Public** : `/` (accueil), `/catalogue`, `/produit/:id`, `/panier`, `/checkout`, `/confirmation`, `/compte`
**Admin** : `/admin` (dashboard), `/admin/produits`, `/admin/campagnes`, `/admin/validation`, `/admin/pricing`, `/admin/commandes`

---

Pour toute question sur l'hébergement Manus (plus simple, tout est préconfiguré), le bouton **Publish** dans l'interface reste l'option la plus rapide.
