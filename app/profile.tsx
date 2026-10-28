import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Alert, Modal, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useProfile } from '../src/hooks/useProfile';
import { CameraCapture } from '../src/components/CameraCapture';

export default function PerfilScreen() {
    const { profile, carregando, salvar } = useProfile();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [fotoUri, setFotoUri] = useState<string | null>(null);
    const [cameraAberta, setCameraAberta] = useState(false);

    // preenche o formulário quando o perfil termina de carregar
    useEffect(() => {
        if (!profile) return;
        setNome(profile.nome);
        setEmail(profile.email);
        setFotoUri(profile.fotoUri);
    }, [profile]);

    async function onSalvar() {
        if (nome.trim() === '') {
            Alert.alert('Erro', 'Informe seu nome.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            Alert.alert('Erro', 'Informe um email válido.');
            return;
        }
        await salvar({ nome: nome.trim(), email: email.trim(), fotoUri });
        router.back();
    }

    if (carregando) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 p-4">
            {/* ---------- Foto ---------- */}
            <View className="items-center mb-6">
                {fotoUri ? (
                    <Image source={{ uri: fotoUri }} className="w-32 h-32 rounded-full mb-3" />
                ) : (
                    <View className="w-32 h-32 rounded-full bg-gray-300 items-center justify-center mb-3">
                        <Text className="text-5xl">👤</Text>
                    </View>
                )}
                <View className="flex-row gap-4">
                    <Pressable onPress={() => setCameraAberta(true)}>
                        <Text className="text-blue-600 font-bold">{fotoUri ? 'Trocar foto' : 'Tirar foto'}</Text>
                    </Pressable>
                    {fotoUri && (
                        <Pressable onPress={() => setFotoUri(null)}>
                            <Text className="text-red-600 font-bold">Remover</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {/* ---------- Campos ---------- */}
            <Text className="text-gray-700 mb-1">Nome</Text>
            <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
            />

            <Text className="text-gray-700 mb-1">Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="voce@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-white border border-gray-300 rounded-lg p-3 mb-6"
            />

            <Pressable onPress={onSalvar} className="bg-blue-600 rounded-lg p-3">
                <Text className="text-white text-center font-bold">Salvar</Text>
            </Pressable>

            {/* câmera em tela cheia */}
            <Modal visible={cameraAberta} animationType="slide" onRequestClose={() => setCameraAberta(false)}>
                <CameraCapture
                    onCapture={(uri) => {
                        setFotoUri(uri);
                        setCameraAberta(false);
                    }}
                    onCancel={() => setCameraAberta(false)}
                />
            </Modal>
        </View>
    );
}
