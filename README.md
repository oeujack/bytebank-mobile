# ByteBank Mobile - Sistema Completo de Transações Bancárias

Este é um sistema completo de transações bancárias composto por uma API backend em Node.js e um aplicativo mobile desenvolvido com React Native/Expo.

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Knex.js** - Query builder para SQL
- **SQLite** - Banco de dados
- **JWT** - Autenticação via tokens
- **Swagger** - Documentação da API

### Frontend (Mobile)
- **React Native** - Framework mobile multiplataforma
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Gluestack UI** - Biblioteca de componentes
- **Firebase Storage** - Armazenamento de imagens

## 🔥 Configuração do Firebase

O projeto utiliza o Firebase Storage para upload de imagens das transações. Abaixo está a configuração atual:

### Projeto Firebase Configurado
- **Project ID**: `your-project-id`
- **Storage Bucket**: `your-project.firebasestorage.app`
- **Região**: us-central1

### Configuração de Ambiente

1. **Copie o arquivo de exemplo**:
```bash
cd mobile
cp .env.example .env
```

2. **Configure as variáveis no arquivo `.env`**:
```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

3. **Regras de Segurança do Firebase Storage**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /transactions/{allPaths=**} {
      allow read, write: if true; // Para desenvolvimento
      // Em produção, use: allow read, write: if request.auth != null;
    }
  }
}
```

### Modo de Desenvolvimento

O sistema detecta automaticamente se está em modo de desenvolvimento:
- **Desenvolvimento**: Simula uploads e retorna URLs mockadas
- **Produção**: Utiliza o Firebase Storage real

## 📁 Estrutura do Projeto

```
bytebank-mobile/
├── api/                    # Backend Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores da API
│   │   ├── database/       # Configuração do banco
│   │   ├── middlewares/    # Middlewares de autenticação
│   │   ├── routes/         # Rotas da API
│   │   └── utils/          # Utilitários
│   ├── package.json
│   └── README.md
├── mobile/                 # Frontend React Native
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos React
│   │   ├── hooks/          # Hooks customizados
│   │   ├── routes/         # Navegação
│   │   ├── screens/        # Telas do app
│   │   ├── services/       # Serviços (API, Firebase)
│   │   └── storage/        # Armazenamento local
│   ├── config/             # Configurações do Gluestack UI
│   ├── package.json
│   └── README.md
└── README.md              # Este arquivo
```

## 🚀 Como Executar

### 1. Configurar Backend (API)

```bash
cd api
npm install
npx knex migrate:latest
npm start
```

A API estará disponível em: `http://localhost:3333`

### 2. Configurar Frontend (Mobile)

```bash
cd mobile
npm install
```

Configure o arquivo `.env` com as credenciais do Firebase (veja seção de configuração acima).

```bash
npm start
```

O Expo Dev Tools estará disponível em: `http://localhost:8081`

## 📱 Funcionalidades

### Backend
- ✅ Sistema de autenticação JWT
- ✅ CRUD completo de usuários
- ✅ CRUD completo de transações
- ✅ Cálculo automático de saldos
- ✅ Documentação Swagger
- ✅ Middleware de autenticação
- ✅ Refresh tokens

### Frontend
- ✅ Autenticação de usuários
- ✅ Listagem de transações
- ✅ Criação/edição de transações
- ✅ Upload de fotos para Firebase Storage
- ✅ Visualização de saldos (Conta-Corrente e Poupança)
- ✅ Interface responsiva (mobile e web)
- ✅ Validação de formulários
- ✅ Navegação entre telas

### Tipos de Transação Suportados
- **Transferência**: Movimentação entre contas
- **Depósito**: Entrada de valores

### Tipos de Conta Suportados
- **Conta-Corrente**: Conta tradicional
- **Poupança**: Conta de poupança

## 🔧 Configurações Avançadas

### Compressão de Imagens
O sistema comprime automaticamente as imagens:
- **Largura máxima**: 800px
- **Qualidade**: 60%
- **Tamanho máximo**: 2MB

### Estrutura do Banco de Dados

```sql
-- Tabela de usuários
users:
- id (PK)
- name (varchar)
- email (varchar, unique)
- password (varchar, hashed)
- created_at (timestamp)
- updated_at (timestamp)

-- Tabela de transações
transactions:
- id (PK)
- user_id (FK)
- account_type ('conta-corrente' | 'poupanca')
- transaction_type ('transferencia' | 'deposito')
- amount (decimal)
- description (text, nullable)
- attachment_url (text, nullable)
- transaction_date (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

## 📝 Documentação da API

A documentação completa da API está disponível via Swagger em:
`http://localhost:3333/api-docs`

### Principais Endpoints

#### Autenticação
- `POST /sessions` - Login
- `POST /sessions/refresh` - Refresh token

#### Usuários
- `POST /users` - Criar usuário
- `GET /users/profile` - Perfil do usuário
- `PUT /users` - Atualizar usuário

#### Transações
- `GET /transactions` - Listar transações
- `POST /transactions` - Criar transação
- `PUT /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Excluir transação
- `GET /transactions/balance` - Consultar saldos

## 🔒 Segurança

- Todas as rotas de transações são protegidas por autenticação JWT
- Senhas são hasheadas usando bcrypt
- Tokens têm tempo de expiração configurável
- Upload de imagens limitado por tamanho e tipo

## 🌐 Suporte Multi-plataforma

O aplicativo mobile funciona em:
- **iOS** (via Expo Go ou build nativo)
- **Android** (via Expo Go ou build nativo)
- **Web** (React Native Web)

## 📄 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato.
