import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';
import { storage } from '@services/firebase';
import { AppError } from '@utils/AppError';
import Constants from 'expo-constants';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  // Detecta se está em modo de desenvolvimento (credentials placeholder)
  const isDevelopmentMode = () => {
    const storageBucket = Constants.expoConfig?.extra?.firebaseStorageBucket || "your-project.appspot.com";
    return storageBucket.includes('your-project') || storageBucket === 'your-project.appspot.com';
  };

  async function selectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        allowsMultipleSelection: false,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      throw new AppError('Erro ao selecionar imagem');
    }
  }

  async function uploadImageMock(imageUri: string): Promise<string> {
    // Simula processamento de imagem
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fileName = `transaction_${Date.now()}.jpg`;
    const mockImageUrl = `https://firebasestorage.googleapis.com/v0/b/mock-project/o/transactions%2F${fileName}?alt=media&token=mock-token`;
    
    Alert.alert(
      '🔧 Modo Desenvolvimento',
      'Upload simulado com sucesso!\n\nPara usar Firebase real:\n1. Configure as credenciais no .env\n2. Reinicie o servidor',
      [{ text: 'OK' }]
    );
    
    return mockImageUrl;
  }

  async function uploadImage(imageUri: string): Promise<string> {
    try {
      setIsUploading(true);
      
      // Se está em modo desenvolvimento, usa mock
      if (isDevelopmentMode()) {
        return await uploadImageMock(imageUri);
      }
      
      // Redimensionar e comprimir a imagem
      const processedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 800 } },
        ],
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Criar um nome único para o arquivo
      const fileName = `transaction_${Date.now()}.jpg`;
      const storageRef = ref(storage, `transactions/${fileName}`);

      // Converter URI para blob
      const response = await fetch(processedImage.uri);
      const blob = await response.blob();

      // Verificar tamanho do arquivo (limite de 2MB após compressão)
      const maxSize = 2 * 1024 * 1024;
      if (blob.size > maxSize) {
        throw new AppError('Imagem muito grande mesmo após compressão. Tente uma imagem menor.');
      }

      // Upload do arquivo com metadata
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          'uploaded': new Date().toISOString(),
          'originalSize': blob.size.toString(),
        }
      };

      await uploadBytes(storageRef, blob, metadata);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteImage(imageUrl: string): Promise<void> {
    try {
      // Se está em modo desenvolvimento, apenas simula a exclusão
      if (isDevelopmentMode()) {
        return;
      }

      if (!imageUrl || !imageUrl.includes('firebase')) {
        return;
      }

      // Extrair o caminho do arquivo da URL do Firebase
      const urlParts = imageUrl.split('/o/')[1];
      if (!urlParts) {
        throw new AppError('URL de imagem inválida');
      }
      
      const filePath = decodeURIComponent(urlParts.split('?')[0]);
      const fileRef = ref(storage, filePath);
      
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      // Não lança erro para não interromper a exclusão da transação
      // se a imagem não existir mais no Firebase
    }
  }

  return {
    selectImage,
    uploadImage,
    deleteImage,
    isUploading
  };
}
