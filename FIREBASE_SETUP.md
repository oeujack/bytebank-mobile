# 🔥 Configuração do Firebase para ByteBank Mobile

## 📋 Passos para resolver o erro de CORS e problemas de upload

### 1. 🚀 Criar Projeto no Firebase Console

1. Acesse https://console.firebase.google.com/
2. Clique em "Adicionar projeto" 
3. Nome do projeto: `bytebank-mobile` (ou nome de sua escolha)
4. Desabilite Google Analytics (não é necessário para este projeto)
5. Clique em "Criar projeto"

### 2. 🔧 Configurar Firebase Storage

1. No console do Firebase, vá para "Storage" no menu lateral
2. Clique em "Começar"
3. Escolha "Começar no modo de teste" (permite leitura/escrita por 30 dias)
4. Escolha uma localização próxima (southamerica-east1 para Brasil)

### 3. ⚙️ Obter Configurações do Projeto

1. No console do Firebase, clique no ícone de engrenagem ⚙️ → "Configurações do projeto"
2. Role até "Seus aplicativos" e clique em "Aplicativo da Web" `</>`
3. Nome do app: `ByteBank Mobile`
4. Marque "Configure o Firebase Hosting"
5. Clique em "Registrar app"
6. **COPIE** o objeto `firebaseConfig` que aparecerá

### 4. 📝 Atualizar arquivo .env

Abra o arquivo `.env` na pasta `mobile` e substitua pelos valores reais:

```bash
FIREBASE_API_KEY=sua-api-key-aqui
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
FIREBASE_APP_ID=seu-app-id
```

### 5. 🔒 Configurar Regras de Security

No Firebase Console → Storage → Rules, use estas regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /transactions/{fileName} {
      // Permite upload de imagens até 5MB
      allow read, write: if request.resource == null 
        || (request.resource.size < 5 * 1024 * 1024 
            && request.resource.contentType.matches('image/.*'));
    }
  }
}
```

### 6. 🎯 Configurações de Quota (IMPORTANTE)

No Firebase Console → Storage → Usage:
1. Verifique os limites de cota
2. Para desenvolvimento, os limites gratuitos são:
   - **1GB de armazenamento**
   - **1GB/dia de download**
   - **20K operações/dia**

### 7. 🔄 Reiniciar o Servidor

Após configurar o .env:
```bash
# Pare o servidor (Ctrl+C)
# Reinicie:
cd mobile
npx expo start --web --clear
```

## 🛠️ Melhorias Implementadas

### ✅ Compressão Automática de Imagens
- Redimensiona imagens para máximo 800px de largura
- Compressão JPEG com qualidade 60%
- Limite de 2MB após compressão

### ✅ Verificação de Tamanho
- Validação de tamanho antes do upload
- Mensagens de erro específicas
- Logs detalhados para debug

### ✅ Configurações de Rede Otimizadas
- Timeout aumentado para 60 segundos
- Metadata adicional nos uploads
- Tratamento específico de erros CORS

## 🎯 Resultado Esperado

Após seguir estes passos:
- ✅ Uploads de imagem funcionarão corretamente
- ✅ Erro de CORS será resolvido
- ✅ Imagens serão automaticamente comprimidas
- ✅ Melhor performance e confiabilidade

## 📞 Troubleshooting

### Se ainda houver erro de CORS:
1. Verifique se o `.env` tem valores reais (não placeholders)
2. Confirme se o projeto Firebase está ativo
3. Verifique as regras de Security do Storage

### Se houver erro de tamanho:
1. O sistema agora comprime automaticamente
2. Limite máximo: 2MB após compressão
3. Dimensões: máximo 800px de largura

---

🚀 **Dica**: As imagens agora são automaticamente otimizadas antes do upload!
