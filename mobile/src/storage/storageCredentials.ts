import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_KEY = 'user_credentials';

export async function saveCredentials(email: string, password: string) {
  try {
    await SecureStore.setItemAsync(
      CREDENTIALS_KEY,
      JSON.stringify({ email, password })
    );
    console.log(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Erro ao salvar credenciais', error);
  }
}

export async function getCredentials() {
  try {
    const data = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao buscar credenciais', error);
    return null;
  }
}

export async function removeCredentials() {
  try {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Erro ao remover credenciais', error);
  }
}
