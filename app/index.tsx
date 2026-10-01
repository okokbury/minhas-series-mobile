import { useCallback, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getSeries } from '../src/database/serieRepository';
import { Serie, SerieFilter } from '../src/types/serie';
const FILTROS: { valor: SerieFilter; label: string }[] = [
  { valor: 'todas', label: 'Todos' },
  { valor: 'assistindo', label: 'Assistindo' },
  { valor: 'concluidas', label: 'Concluídas' },
];

export default function ListaLivros() {
  const [livros, setLivros] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');
  useFocusEffect(
    useCallback(() => {
      getSeries(filtro).then(setLivros);
    }, [filtro])
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="flex-row gap-2 mb-4">
        {FILTROS.map((f) => {
          const ativo = f.valor === filtro;
          return (
            <Pressable
              key={f.valor}
              onPress={() => setFiltro(f.valor)}
              className={`px-4 py-2 rounded-full border ${
                ativo ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
              }`}
            >
              <Text className={ativo ? 'text-white font-bold' : 'text-gray-700'}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>


      <Pressable
        onPress={() => router.push('/form')}
        className="bg-green-600 rounded-lg p-3 mb-4"
      >
        <Text className="text-white text-center font-bold">+ Novo livro</Text>
      </Pressable>


      <FlatList
        data={livros}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-8">Nenhum livro aqui ainda.</Text>
        }
        renderItem={({ item }) => {
          const lido = item.concluida === 1;
          return (
            <Pressable
              onPress={() => router.push(`/detalhe?id=${item.id}`)}
              className={`bg-white rounded-lg p-4 mb-3 border-l-4 ${
                lido ? 'opacity-60 border-green-500' : 'border-blue-500'
              }`}
            >
              <Text className={`text-lg font-bold ${lido ? 'line-through' : ''}`}>
                {item.titulo}
              </Text>
              <Text className="text-gray-600">Disponivel em: {item.plataforma}</Text>
              <Text className="text-gray-600">{item.temporadas} temporadas</Text>
              <Text className="text-gray-600">Nota: {item.nota}/5</Text>
              <Text className="text-yellow-600">
                {item.nota != null ? `Nota: ${item.nota}/5` : 'Sem nota'}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
