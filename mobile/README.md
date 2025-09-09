# ByteBank Mobile - Sistema de Transações

## Configuração do Firebase

### 1. Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga as instruções para criar o projeto

### 2. Configurar Firebase Storage

1. No console do Firebase, vá para "Storage"
2. Clique em "Começar"
3. Configure as regras de segurança:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /transactions/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Configurar o app

1. No console do Firebase, vá para "Configurações do projeto"
2. Na aba "Geral", role até "Seus apps"
3. Clique no ícone da web `</>`
4. Registre o app com um nome
5. Copie a configuração do Firebase

### 4. Configurar no projeto

1. Copie o arquivo `.env.example` para `.env`
2. Substitua as variáveis pelos valores do seu projeto Firebase
3. Atualize o arquivo `src/services/firebase.ts` com suas configurações

### 5. Funcionalidades implementadas

#### Backend (API)
- ✅ Migração para tabela de transações
- ✅ Controller com CRUD completo
- ✅ Rotas autenticadas para transações
- ✅ Endpoint para consultar saldos

#### Frontend (Mobile)
- ✅ Tela de listagem de transações
- ✅ Tela de adicionar/editar transação
- ✅ Upload de fotos para Firebase Storage
- ✅ Visualização de saldos com botão ver/esconder
- ✅ Botões de editar e excluir em cada transação
- ✅ Validação de campos obrigatórios
- ✅ Suporte para Conta-Corrente e Poupança
- ✅ Tipos de transação: Transferência e Depósito

### 6. Como usar

1. Faça login no app
2. Na tela inicial, você verá:
   - Seção de saldos (clique em "Ver" para mostrar/esconder)
   - Lista de transações
   - Botão "+" para adicionar nova transação

3. Para adicionar uma transação:
   - Clique no botão "+"
   - Selecione o tipo de conta
   - Selecione o tipo de transação
   - Informe o valor
   - Adicione uma descrição (opcional)
   - **Obrigatório**: Anexe uma foto
   - Clique em "Criar Transação"

4. Para editar uma transação:
   - Clique no ícone de lápis na transação
   - Edite os campos desejados
   - Clique em "Salvar Alterações"

5. Para excluir uma transação:
   - Clique no ícone de lixeira na transação
   - Confirme a exclusão

### 7. Estrutura do banco de dados

```sql
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

### 8. Executar o projeto

#### API
```bash
cd api
npm install
npx knex migrate:latest
npm start
```

#### Mobile
```bash
cd mobile
npm install
npm start
```

### 9. Dependências adicionais instaladas

- `firebase` - SDK do Firebase para web
- `expo-image-picker` - Seleção de imagens
- `expo-image` - Componente de imagem otimizado

### 10. Notas importantes

- O upload de foto é **obrigatório** para criar/editar transações
- As fotos são armazenadas no Firebase Storage
- A URL da foto é salva no banco de dados
- Os saldos são calculados dinamicamente baseados nas transações
- Todas as operações são autenticadas
- O projeto funciona tanto no mobile quanto na web
