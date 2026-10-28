import { View, Text, Pressable } from 'react-native';
import { Serie } from '../types/serie';

type Props = {
    serie: Serie;
    onPress: () => void;
    onAlternar: () => void;
    onRemover: () => void;
};

export function SerieItem({ serie, onPress, onAlternar, onRemover }: Props) {
    const concluida = serie.concluida === 1;
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onRemover}
            className={`flex-row items-center bg-white rounded-lg p-4 mb-3 border-l-4 ${concluida ? 'opacity-60 border-green-500' : 'border-blue-500'}`}
        >
            <View className="flex-1">
                <Text className={`text-lg font-bold ${concluida ? 'line-through' : ''}`}>{serie.titulo}</Text>
                <Text className="text-gray-600">Disponível em: {serie.plataforma}</Text>
                <Text className="text-gray-600">{serie.temporadas} temporada{serie.temporadas === 1 ? '' : 's'}</Text>
                <Text className="text-yellow-600">{serie.nota != null ? `Nota: ${serie.nota}/5` : 'Sem nota'}</Text>
            </View>

            {/* botão redondo para marcar/desmarcar sem abrir o detalhe */}
            <Pressable
                onPress={onAlternar}
                hitSlop={8}
                className={`w-9 h-9 rounded-full border-2 items-center justify-center ${concluida ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
            >
                <Text className="text-white font-bold">{concluida ? '✓' : ''}</Text>
            </Pressable>
        </Pressable>
    );
}
