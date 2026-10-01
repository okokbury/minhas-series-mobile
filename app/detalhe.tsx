import { useCallback, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getSerieById, toggleSerieConcluida, deleteSerie } from '../src/database/serieRepository'; // banco SÓ via repositório
import { Serie } from '../src/types/serie';

export default function DetalheSerie() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const serieId = Number(id);
    const [serie, setSerie] = useState<Serie | null>(null);

    const carregar = useCallback(() => {
        getSerieById(serieId!).then(setSerie);
    }, [serieId]);

    useFocusEffect(carregar);

    async function toggleConcluida() {
        await toggleSerieConcluida(serieId!);
        carregar();
    }

    function editar() {
        router.push(`/form?id=${serieId}`);
    }

    function excluir() {
        Alert.alert('Excluir serie', `Excluir "${serie?.titulo}"? Nao e possível desfazer essa acao.`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    await deleteSerie(serieId!);
                    router.back();
                },
            },
        ]);
    }

    if (!serie) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <Text className="text-gray-500">Carregando...</Text>
            </View>
        );
    }

    const concluida = serie.concluida === 1;

    return (
        <View className="flex-1 bg-gray-100 p-4">
            {/* ---------- Dados ---------- */}
            <View className="bg-white rounded-lg p-4 mb-4">
                <Text className="text-2xl font-bold mb-2">{serie.titulo}</Text>
                <Text className="text-gray-700">Plataforma: {serie.plataforma}</Text>
                <Text className="text-gray-700">Temporadas: {serie.temporadas}</Text>
                {/* nota pode ser null: mostra estrelas acesas até a nota, ou "Sem nota" */}
                <Text className="text-yellow-500 text-xl mt-1">
                    {serie.nota != null ? '★'.repeat(serie.nota) + '☆'.repeat(5 - serie.nota) : 'Sem nota'}
                </Text>
                <Text className={`mt-2 font-bold ${concluida ? 'text-green-600' : 'text-blue-600'}`}>
                    {concluida ? 'Concluída' : 'Em andamento'}
                </Text>
                {/* createdAt é ISO; toLocaleDateString deixa no formato dd/mm/aaaa */}
                <Text className="text-gray-400 mt-1">
                    Cadastrado em {new Date(serie.createdAt).toLocaleDateString('pt-BR')}
                </Text>
            </View>

            {/* ---------- Ações ---------- */}
            <Pressable onPress={toggleConcluida} className="bg-green-600 rounded-lg p-3 mb-3">
                {/* O texto do botão depende do estado atual */}
                <Text className="text-white text-center font-bold">
                    {concluida ? 'Marcar como não concluída' : 'Marcar como concluída'}
                </Text>
            </Pressable>

            <Pressable onPress={editar} className="bg-blue-600 rounded-lg p-3 mb-3">
                <Text className="text-white text-center font-bold">Editar</Text>
            </Pressable>

            <Pressable onPress={excluir} className="bg-red-600 rounded-lg p-3">
                <Text className="text-white text-center font-bold">Excluir</Text>
            </Pressable>
        </View>
    );
}