import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSeries } from '../src/hooks/useSeries';
import { FilterBar } from '../src/components/FilterBar';
import { SerieItem } from '../src/components/SerieItem';
import { EmptyState } from '../src/components/EmptyState';
import { Serie } from '../src/types/serie';

export default function ListaSeries() {
  const { series, filtro, setFiltro, total, concluidas, alternar, remover } = useSeries();

  function confirmarRemocao(serie: Serie) {
    Alert.alert('Excluir série', `Excluir "${serie.titulo}"? Não é possível desfazer essa ação.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => remover(serie.id) },
    ]);
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* contador calculado com COUNT no SQL */}
      <Text className="text-gray-500 mb-3">
        {total} série{total === 1 ? '' : 's'} · {concluidas} concluída{concluidas === 1 ? '' : 's'}
      </Text>

      <FilterBar filtro={filtro} onChange={setFiltro} />

      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 96 }}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <SerieItem
            serie={item}
            onPress={() => router.push(`/detalhe?id=${item.id}`)}
            onAlternar={() => alternar(item.id)}
            onRemover={() => confirmarRemocao(item)}
          />
        )}
      />

      {/* FAB: botão flutuante para cadastrar */}
      <Pressable
        onPress={() => router.push('/form')}
        className="absolute bottom-8 right-6 w-16 h-16 rounded-full bg-green-600 items-center justify-center shadow-lg"
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </Pressable>
    </View>
  );
}
