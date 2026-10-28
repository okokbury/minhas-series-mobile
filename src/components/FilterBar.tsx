import { View, Text, Pressable } from 'react-native';
import { SerieFilter } from '../types/serie';

const FILTROS: { valor: SerieFilter; label: string }[] = [
    { valor: 'todas', label: 'Todas' },
    { valor: 'assistindo', label: 'Assistindo' },
    { valor: 'concluidas', label: 'Concluídas' },
];

type Props = {
    filtro: SerieFilter;
    onChange: (filtro: SerieFilter) => void;
};

export function FilterBar({ filtro, onChange }: Props) {
    return (
        <View className="flex-row gap-2 mb-4">
            {FILTROS.map((f) => {
                const ativo = f.valor === filtro;
                return (
                    <Pressable
                        key={f.valor}
                        onPress={() => onChange(f.valor)}
                        className={`px-4 py-2 rounded-full border ${ativo ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                    >
                        <Text className={ativo ? 'text-white font-bold' : 'text-gray-700'}>{f.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
