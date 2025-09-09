import { Alert } from 'react-native';

export const useImageUploadMock = () => {
  const uploadImage = async (imageUri: string, transactionId: string) => {
    console.log('🔧 MODO DESENVOLVIMENTO: Simulando upload de imagem');
    console.log('📁 Image URI:', imageUri);
    console.log('🏷️ Transaction ID:', transactionId);
    
    // Simula um delay de upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Retorna uma URL simulada
    const mockImageUrl = `https://firebasestorage.googleapis.com/v0/b/mock-project/o/transactions%2F${transactionId}.jpg?alt=media&token=mock-token`;
    
    console.log('✅ Upload simulado concluído:', mockImageUrl);
    
    Alert.alert(
      '🔧 Modo Desenvolvimento',
      'Upload simulado com sucesso!\n\nPara usar o Firebase real, configure suas credenciais no arquivo .env',
      [{ text: 'OK' }]
    );
    
    return mockImageUrl;
  };

  return { uploadImage };
};
