import {
  Box,
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  Toast,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';

import BackgroundImg from '@assets/backgroundx.png';
import Logo from '@assets/logoBytebank.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { useCallback, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert, DeviceEventEmitter } from 'react-native';

type FormData = {
  email: string;
  password: string;
};

export function SignIn() {
  const { singIn } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [hasBiometricSupport, setHasBiometricSupport] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setHasBiometricSupport(compatible);

        const creds = await SecureStore.getItemAsync('user_credentials');
        setSavedCredentials(creds);
      })();
    }, [])
  );

  async function handleBiometricLogin() {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se para entrar',
      fallbackLabel: 'Usar senha',
    });

    if (biometricAuth.success) {
      const creds = await SecureStore.getItemAsync('user_credentials');
      if (creds) {
        const { email, password } = JSON.parse(creds);
        await handleSignIn({ email, password });
      }
    } else {
      Alert.alert('Erro', 'Falha na autenticação biométrica.');
    }
  }

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('biometricEnabled', async () => {
      const creds = await SecureStore.getItemAsync('user_credentials');
      setSavedCredentials(creds);
    });

    return () => sub.remove();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await singIn(email, password);
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.';

      toast.show({
        placement: 'top',
        render: () => (
          <Toast backgroundColor="$red500" action="error" variant="outline">
            <ToastTitle color="$white">{title}</ToastTitle>
          </Toast>
        ),
      });
    }
  }

  const existingCreds = SecureStore.getItemAsync('user_credentials');

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={600}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          position="absolute"
        />

        <Box
          position="absolute"
          top={0}
          left={0}
          w="$full"
          h="$full"
          bg="rgba(0,0,0,0.4)"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Controle suas finanças com simplicidade.
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Acesse a conta</Heading>
            <Controller
              control={control}
              name="email"
              rules={{ required: 'Informe o e-mail' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{ required: 'Informe a senha' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <Button
              title="Acessar"
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
            {hasBiometricSupport && !!savedCredentials && (
              <Button
                title="Entrar com biometria"
                onPress={handleBiometricLogin}
                mt="$4"
              />
            )}
          </Center>

          <Center flex={1} justifyContent="flex-end" marginTop="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Ainda não tem acesso?
            </Text>

            <Button
              title="Criar conta"
              variant="outline"
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
