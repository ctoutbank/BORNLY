import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: { credentials: 'include' },
  plugins: Platform.OS === 'web' ? [] : [expoClient({ scheme: 'bornly', storagePrefix: 'bornly', storage: SecureStore })],
});

const MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: 'Já existe uma conta com este e-mail.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Já existe uma conta com este e-mail.',
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha incorretos.',
  INVALID_PASSWORD: 'Senha incorreta.',
  INVALID_EMAIL: 'Confira o e-mail digitado.',
  PASSWORD_TOO_SHORT: 'A senha precisa ter pelo menos 8 caracteres.',
};

export const isExistingAccount = (error: { code?: string } | null | undefined) => !!error?.code?.startsWith('USER_ALREADY_EXISTS');

export const authErrorMessage = (error: { code?: string; status?: number } | null | undefined) =>
  (error?.code && MESSAGES[error.code]) || (error?.status === 429 ? 'Muitas tentativas. Aguarde um minuto.' : 'Não foi possível concluir. Verifique sua conexão e tente de novo.');
