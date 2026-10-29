import '../global.css'; //descobri q esse erro eh fake erro, funciona normal no app
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { runMigrations } from '../src/database/database';

export default function RootLayout() {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    runMigrations()
      // confirma se a tabela ta la
      .then(() => setPronto(true))
      .catch((e) => console.error('Erro nas migrations', e));
  }, []);

  if (!pronto) return null;

  return (
    // no iOS 26 o header fica transparente por cima da tela se não tiver cor de fundo
    <Stack
      screenOptions={{
        headerTransparent: false,
        headerStyle: { backgroundColor: '#ffffff' },
      }}
    >

      <Stack.Screen name="index" options={{ title: 'Minhas Séries' }} />
      <Stack.Screen name="form" options={{ title: 'Serie' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes da Série' }} />
      <Stack.Screen name="profile" options={{ title: 'Meu perfil' }} />
    </Stack>
  );
}