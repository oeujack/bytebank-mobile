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
    console.log('🔧 MODO DESENVOLVIMENTO: Simulando upload de imagem');
    console.log('📁 Image URI:', imageUri);
    
    // Simula processamento de imagem
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fileName = `transaction_${Date.now()}.jpg`;
    const mockImageUrl = `https://firebasestorage.googleapis.com/v0/b/mock-project/o/transactions%2F${fileName}?alt=media&token=mock-token`;
    
    console.log('✅ Upload simulado concluído:', mockImageUrl);
    
    Alert.alert(
      '🔧 Modo Desenvolvimento',
      'Upload simulado com sucesso!\n\nPara usar Firebase real:\n1. Configure as credenciais no .env\n2. Reinicie o servidor',
      [{ text: 'OK' }]
    );
    
    return mockImageUrl;
  }

  async function uploadImage(imageUri: string): Promise<string> {
    try {
      console.log('🚀 UPLOAD: Iniciando upload da imagem');
      console.log('📁 Image URI:', imageUri);
      setIsUploading(true);
      
      // Se está em modo desenvolvimento, usa mock
      if (isDevelopmentMode()) {
        console.log('🔧 UPLOAD: Modo desenvolvimento detectado');
        return await uploadImageMock(imageUri);
      }
      
      console.log('🔥 UPLOAD: Iniciando upload real no Firebase');
      
      // Redimensionar e comprimir a imagem
      console.log('📐 UPLOAD: Processando imagem...');
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
      console.log('✅ UPLOAD: Imagem processada:', processedImage.uri);

      // Criar um nome único para o arquivo
      const fileName = `transaction_${Date.now()}.jpg`;
      console.log('📝 UPLOAD: Nome do arquivo:', fileName);
      const storageRef = ref(storage, `transactions/${fileName}`);

      // Converter URI para blob
      console.log('🔄 UPLOAD: Convertendo URI para blob...');
      const response = await fetch(processedImage.uri);
      const blob = await response.blob();
      console.log('✅ UPLOAD: Blob criado, tamanho:', (blob.size / 1024 / 1024).toFixed(2), 'MB');

      // Verificar tamanho do arquivo (limite de 2MB após compressão)
      const maxSize = 2 * 1024 * 1024;
      if (blob.size > maxSize) {
        console.log('❌ UPLOAD: Arquivo muito grande');
        throw new AppError('Imagem muito grande mesmo após compressão. Tente uma imagem menor.');
      }

      console.log(`📤 UPLOAD: Enviando para Firebase...`);

      // Upload do arquivo com metadata
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          'uploaded': new Date().toISOString(),
          'originalSize': blob.size.toString(),
        }
      };

      await uploadBytes(storageRef, blob, metadata);
      console.log('✅ UPLOAD: Upload concluído, obtendo URL...');
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('🎉 UPLOAD: Sucesso! URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ UPLOAD: Erro durante upload:', error);
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
        console.log('🔧 MODO DESENVOLVIMENTO: Simulando exclusão de imagem');
        console.log('📁 Image URL:', imageUrl);
        return;
      }

      if (!imageUrl || !imageUrl.includes('firebase')) {
        console.log('URL inválida ou não é do Firebase, pulando exclusão');
        return;
      }

      // Extrair o caminho do arquivo da URL do Firebase
      const urlParts = imageUrl.split('/o/')[1];
      if (!urlParts) {
        throw new AppError('URL de imagem inválida');
      }
      
      const filePath = decodeURIComponent(urlParts.split('?')[0]);
      const fileRef = ref(storage, filePath);
      
      console.log('Deletando arquivo do Firebase:', filePath);
      await deleteObject(fileRef);
      console.log('Arquivo deletado com sucesso');
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
