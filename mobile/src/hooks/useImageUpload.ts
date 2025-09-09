import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@services/firebase';
import { AppError } from '@utils/AppError';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  async function selectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      throw new AppError('Erro ao selecionar imagem');
    }
  }

  async function uploadImage(imageUri: string): Promise<string> {
    try {
      setIsUploading(true);
      
      // Criar um nome único para o arquivo
      const fileName = `transaction_${Date.now()}.jpg`;
      const storageRef = ref(storage, `transactions/${fileName}`);

      // Converter URI para blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload do arquivo
      await uploadBytes(storageRef, blob);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      throw new AppError('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  }

  return {
    selectImage,
    uploadImage,
    isUploading
  };
}
