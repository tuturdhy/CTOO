# PosturAï - Exercices guidés intelligents

Application web interactive qui aide les utilisateurs à réaliser des exercices sportifs en toute sécurité avec guidage intelligent et analyse de posture en temps réel.

## 🚀 Fonctionnalités

- **Mode pédagogique (sans caméra)** : Animations SVG + guidage étape par étape
- **Mode intelligent (avec caméra)** : Analyse de posture en temps réel avec TensorFlow.js/MoveNet
- **Questionnaire de santé** : Personnalisation des exercices selon les douleurs/limitations
- **Système de badges** : Suivi de progression et récompenses
- **Historique des sessions** : Suivi des performances

## 📋 Prérequis

- Node.js 16+ et npm

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

## 🏃 Lancer le projet

### Mode développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`

### Build de production
```bash
npm run build
```

### Prévisualiser le build
```bash
npm run preview
```

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Badge.jsx
│   ├── ExerciseCard.jsx
│   ├── ExerciseSVG.jsx
│   └── icons/
├── data/               # Données et configurations
│   ├── exercises.js
│   └── survey.js
├── pages/              # Pages principales
│   ├── Landing.jsx
│   ├── OnboardingSurvey.jsx
│   ├── ExerciseList.jsx
│   ├── ExercisePlayerNoCam.jsx
│   ├── ExercisePlayerCam.jsx
│   └── UserProfile.jsx
├── utils/              # Utilitaires
│   └── storage.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## 🎯 Utilisation

1. **Page d'accueil** : Cliquez sur "Commencer" pour démarrer
2. **Questionnaire** : Répondez aux questions sur votre profil de santé
3. **Liste d'exercices** : Consultez les exercices recommandés selon votre profil
4. **Mode sans caméra** : Apprenez avec animations et conseils
5. **Mode avec caméra** : Analysez votre posture en temps réel (nécessite autorisation caméra)
6. **Profil** : Consultez votre historique et badges

## 🔒 Confidentialité

- **100% local** : Toute analyse caméra se fait sur votre appareil
- **Aucune image envoyée** : Les vidéos ne quittent jamais votre navigateur
- **Données stockées localement** : Utilisation de localStorage (mode invité)

## 🛠️ Technologies utilisées

- **React 18** : Framework UI
- **Vite** : Build tool et dev server
- **React Router** : Navigation
- **TensorFlow.js** : Détection de pose
- **MoveNet** : Modèle de détection de pose (TensorFlow)

## 📝 Notes

- Le mode caméra nécessite HTTPS en production (ou localhost en développement)
- Les données sont stockées dans le localStorage du navigateur
- Compatible mobile et desktop

## 🐛 Dépannage

### La caméra ne fonctionne pas
- Vérifiez que vous avez autorisé l'accès à la caméra
- En production, HTTPS est requis pour accéder à la caméra
- Testez d'abord sur localhost en développement

### Les modèles TensorFlow ne se chargent pas
- Vérifiez votre connexion internet (premier chargement)
- Les modèles sont mis en cache après le premier téléchargement

## 📄 Licence

Ce projet est un exemple de démonstration.
