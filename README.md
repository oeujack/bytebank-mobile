# ByteBank Mobile

Sistema de transações bancárias com API Node.js e app React Native/Expo.

## Como Rodar

### 1. API (Backend)
```bash
cd api
npm install
npm run migrate
npm start
```
API disponível em: `http://localhost:3333`

### 2. Mobile (App)
```bash
cd mobile
npm install
npm start
```

**Configurações importantes:**
- **API no celular físico**: Edite `mobile/src/services/api.ts` e troque `localhost` pelo IP da sua máquina
- **Firebase**: Chaves já configuradas no GitHub Secrets para CI/CD
- **Banco**: SQLite criado automaticamente em `api/src/database/database.db`

## Tecnologias
- **Backend**: Node.js, Express, SQLite, JWT
- **Mobile**: React Native, Expo, TypeScript, Firebase Storage
