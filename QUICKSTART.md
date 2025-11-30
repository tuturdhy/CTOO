# Guide de démarrage rapide - PosturAï

## Installation et lancement

```bash
# 1. Installer les dépendances
cd frontend
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir http://localhost:3000 dans votre navigateur
```

## Première utilisation

1. **Page d'accueil** : Cliquez sur "Commencer"
2. **Questionnaire** : Répondez aux questions sur votre profil de santé
3. **Liste d'exercices** : Consultez les exercices recommandés
4. **Choisir un exercice** :
   - **Sans caméra** : Mode pédagogique avec animations
   - **Avec caméra** : Mode intelligent avec analyse en temps réel

## Exercices disponibles

- **Squat modifié** : Renforcement des jambes avec amplitude réduite
- **Pont de fessiers** : Renforcement des fessiers et ischio-jambiers
- **Planche modifiée** : Gainage du tronc
- **Rotation d'épaule** : Mobilité et renforcement des épaules

## Mode caméra

⚠️ **Important** :
- Nécessite une autorisation d'accès à la caméra
- En production, HTTPS est requis
- Fonctionne sur localhost en développement
- Traitement 100% local (aucune image envoyée)

## Données stockées

Les données sont stockées dans le `localStorage` du navigateur :
- Profil de santé (questionnaire)
- Historique des sessions
- Badges obtenus

Pour réinitialiser : Ouvrez la console du navigateur et exécutez `localStorage.clear()`

## Dépannage

### Erreur "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### La caméra ne fonctionne pas
- Vérifiez les permissions du navigateur
- Testez sur Chrome ou Firefox
- En production, assurez-vous d'utiliser HTTPS

### Les modèles TensorFlow ne se chargent pas
- Vérifiez votre connexion internet
- Les modèles sont téléchargés au premier chargement
- Vérifiez la console pour les erreurs

## Build de production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

