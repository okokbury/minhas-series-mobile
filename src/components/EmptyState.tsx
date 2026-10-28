import { View, Text } from 'react-native';

type Props = {
    mensagem?: string;
};

export function EmptyState({ mensagem = 'Nenhuma série aqui ainda.' }: Props) {
    return (
        <View className="items-center mt-16">
            <Text className="text-5xl mb-2">📺</Text>
            <Text className="text-center text-gray-500">{mensagem}</Text>
            <Text className="text-center text-gray-400 mt-1">Toque no + para cadastrar uma.</Text>
        </View>
    );
}
