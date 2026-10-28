import { useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

type Props = {
    onCapture: (uri: string) => void;
    onCancel: () => void;
};

export function CameraCapture({ onCapture, onCancel }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [lado, setLado] = useState<CameraType>('front');
    const [pronta, setPronta] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // ainda carregando a permissão
    if (!permission) return <View className="flex-1 bg-black" />;

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-gray-100 items-center justify-center p-6">
                <Text className="text-center text-gray-700 mb-4">
                    Precisamos da sua permissão para usar a câmera.
                </Text>
                <Pressable onPress={requestPermission} className="bg-blue-600 rounded-lg px-4 py-3 mb-3">
                    <Text className="text-white font-bold">Permitir câmera</Text>
                </Pressable>
                <Pressable onPress={onCancel}>
                    <Text className="text-gray-500">Cancelar</Text>
                </Pressable>
            </View>
        );
    }

    async function tirarFoto() {
        // só tira foto depois que a câmera avisou que está pronta
        if (!pronta) return;
        const foto = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
        if (foto) onCapture(foto.uri);
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView
                ref={cameraRef}
                facing={lado}
                onCameraReady={() => setPronta(true)}
                style={{ flex: 1 }}
            />
            <View className="flex-row items-center justify-around py-6 bg-black">
                <Pressable onPress={onCancel}>
                    <Text className="text-white text-lg">Cancelar</Text>
                </Pressable>
                <Pressable
                    onPress={tirarFoto}
                    className="w-20 h-20 rounded-full border-4 border-white bg-white/30"
                />
                <Pressable onPress={() => setLado(lado === 'front' ? 'back' : 'front')}>
                    <Text className="text-white text-lg">Virar</Text>
                </Pressable>
            </View>
        </View>
    );
}
