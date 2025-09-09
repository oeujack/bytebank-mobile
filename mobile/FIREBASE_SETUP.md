# Configuração do Firebase Storage

## Passo a passo para configurar o Firebase

### 1. Criar projeto no Firebase Console

1. Acesse https://console.firebase.google.com/
2. Clique em "Criar um projeto"
3. Digite o nome do projeto (ex: "bytebank-transactions")
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Ativar Firebase Storage

1. No menu lateral, clique em "Storage"
2. Clique em "Começar"
3. Escolha "Começar no modo de teste"
4. Selecione a localização (escolha uma próxima ao Brasil, ex: southamerica-east1)
5. Clique em "Concluído"

### 3. Configurar regras de segurança

1. Ainda na página do Storage, clique na aba "Regras"
2. Substitua o conteúdo pelas seguintes regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir acesso a imagens de transações apenas para usuários autenticados
    match /transactions/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Clique em "Publicar"

### 4. Obter configurações do projeto

1. Clique no ícone de engrenagem ao lado de "Visão geral do projeto"
2. Clique em "Configurações do projeto"
3. Role até a seção "Seus apps"
4. Clique no ícone da web `</>`
5. Digite um nome para o app (ex: "bytebank-web")
6. **NÃO** marque a opção "Configurar também o Firebase Hosting"
7. Clique em "Registrar app"
8. Copie a configuração que aparece (objeto `firebaseConfig`)

### 5. Configurar no projeto

1. Abra o arquivo `mobile/src/services/firebase.ts`
2. Substitua o objeto `firebaseConfig` pelos dados do seu projeto:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "sua-app-id"
};
```

### 6. Testar a configuração

1. Execute o projeto mobile: `npm start`
2. Tente criar uma nova transação
3. Adicione uma foto - ela deve ser enviada para o Firebase Storage
4. Verifique no Firebase Console se a imagem apareceu na pasta `transactions/`

### 7. Estrutura no Firebase Storage

As imagens serão organizadas da seguinte forma:
```
/transactions/
  ├── transaction_1725840000000.jpg
  ├── transaction_1725840001000.jpg
  └── ...
```

### 8. Solução de problemas

#### Erro de CORS
Se encontrar erros de CORS, adicione as seguintes origens permitidas no Firebase:
- `http://localhost:19006` (Expo web)
- `exp://192.168.x.x:19000` (Expo mobile)

#### Erro de autenticação
Certifique-se de que:
- O usuário está logado no app
- As regras do Storage permitem acesso autenticado
- A configuração do Firebase está correta

#### Erro de upload
Verifique se:
- A imagem foi selecionada corretamente
- A conexão com internet está funcionando
- O bucket do Storage está correto na configuração

### 9. Configuração alternativa (Environment Variables)

Para maior segurança, você pode usar variáveis de ambiente:

1. Crie um arquivo `.env` na pasta `mobile/`
2. Adicione as configurações:

```env
FIREBASE_API_KEY=sua-api-key
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=sua-app-id
```

3. Instale a biblioteca para variáveis de ambiente:
```bash
npm install react-native-dotenv
```

4. Configure o babel.config.js para incluir o plugin
