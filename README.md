# 🥦 Garde-Manger — PWA

Application mobile pour gérer votre garde-manger et obtenir des recettes via l'IA Gemini.

## 📁 Structure du projet

```
garde-manger-pwa/
├── index.html          ← Application complète (autoportante)
├── manifest.json       ← Manifest PWA (icône, nom, plein écran…)
├── sw.js               ← Service Worker (cache offline)
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-32x32.png
│   └── favicon-16x16.png
└── README.md
```

---

## 🚀 Déploiement sur GitHub Pages (5 minutes)

### 1. Créer un dépôt GitHub

1. Connectez-vous sur [github.com](https://github.com).
2. Cliquez sur **New repository**.
3. Donnez-lui un nom, par exemple `garde-manger`.
4. Laissez-le **Public** (requis pour GitHub Pages gratuit).
5. Cliquez sur **Create repository**.

### 2. Uploader les fichiers

**Option A — via l'interface web (la plus simple) :**

1. Sur la page du dépôt, cliquez sur **Add file → Upload files**.
2. Glissez-déposez **tous les fichiers et le dossier `icons/`** d'un coup.
3. Cliquez sur **Commit changes**.

**Option B — via Git :**

```bash
git clone https://github.com/VOTRE_PSEUDO/garde-manger.git
# Copiez tous les fichiers dans le dossier cloné
cd garde-manger
git add .
git commit -m "Initial PWA deploy"
git push origin main
```

### 3. Activer GitHub Pages

1. Dans votre dépôt, allez dans **Settings → Pages** (menu de gauche).
2. Sous **Source**, sélectionnez **Deploy from a branch**.
3. Choisissez la branche **main** (ou master) et le dossier **/ (root)**.
4. Cliquez sur **Save**.

Après ~1 minute, votre app sera accessible à :
```
https://VOTRE_PSEUDO.github.io/garde-manger/
```

---

## 📱 Installer l'application sur votre téléphone

### Android (Chrome)
1. Ouvrez l'URL dans Chrome.
2. Un bandeau « Ajouter à l'écran d'accueil » devrait apparaître automatiquement.  
   Sinon, tapez les **⋮ trois points** → **Ajouter à l'écran d'accueil**.
3. Confirmez. L'icône apparaît sur votre écran d'accueil.
4. Lancez depuis l'icône → l'app s'ouvre **en plein écran**, sans barre d'adresse.

### iOS (Safari)
1. Ouvrez l'URL dans **Safari** (obligatoire, pas Chrome).
2. Tapez l'icône **Partager** (carré avec flèche vers le haut).
3. Faites défiler et choisissez **Sur l'écran d'accueil**.
4. Confirmez. L'app s'ouvre ensuite en plein écran comme une app native.

---

## 🔑 Configuration de l'app

### Clé Gemini (obligatoire pour les recettes et l'analyse)

1. Rendez-vous sur [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Connectez-vous et cliquez sur **Create API key**.
3. Dans l'app → **Réglages → Connexion à l'IA** → collez la clé.

### Google Drive (optionnel, pour sauvegarder sur le cloud)

Le domaine doit correspondre exactement à l'URL GitHub Pages.

1. Sur [console.cloud.google.com](https://console.cloud.google.com) :
   - Créez un projet.
   - Activez l'**API Google Drive**.
   - Configurez l'écran de consentement OAuth (externe, ajoutez votre adresse e-mail comme utilisateur test).
   - Créez un **identifiant OAuth → Application Web**.
   - Dans **Origines JavaScript autorisées**, ajoutez :
     ```
     https://VOTRE_PSEUDO.github.io
     ```
2. Copiez l'**identifiant client** (`xxxx.apps.googleusercontent.com`).
3. Dans l'app → **Réglages → Sauvegarde sur Google Drive** → collez l'ID.

---

## 🔄 Mise à jour de l'application

Pour mettre à jour l'app, re-uploadez simplement `index.html` (et les autres fichiers si modifiés) sur GitHub. Le Service Worker détectera la mise à jour au prochain lancement et affichera un message.

---

## ✅ Fonctionnalités PWA

| Fonctionnalité | État |
|---|---|
| Installation écran d'accueil | ✅ |
| Plein écran (sans barre d'adresse) | ✅ |
| Icônes adaptatives (Android / iOS) | ✅ |
| Cache offline (app utilisable sans réseau) | ✅ |
| Données locales persistantes (localStorage) | ✅ |
| Sauvegarde cloud (Google Drive) | ✅ optionnel |
| Raccourcis d'application | ✅ Android |
| Notifications | ❌ non implémenté |

---

*Fait avec ❤️ et Gemini AI*
