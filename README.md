# Stellar Imperiums — Frontend

Frontend du jeu de gestion de colonie spatiale **Stellar Imperiums**.

## Stack technique

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router v7
- Axios

## Prérequis

- Node.js 22+
- npm

## Installation

```bash
cp .env.example .env
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

## Structure du projet

```
src/
├── assets/       # Images, fonts, icônes
├── components/   # Composants réutilisables
├── contexts/     # Context providers (auth, etc.)
├── hooks/        # Custom hooks
├── pages/        # Pages de l'application
├── services/     # Services API (Axios)
├── types/        # Types TypeScript
└── utils/        # Utilitaires
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l'API backend |

## Liens

- [API Backend](https://github.com/pierrick-fonquerne/stellar-imperiums-api)
- [Projet GitHub](https://github.com/users/pierrick-fonquerne/projects/7)
