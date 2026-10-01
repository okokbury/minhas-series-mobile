import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getSerieById, createSerie, updateSerie } from '../src/database/serieRepository';

export default function FormSerie() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const serieId = id ? parseInt(id) : null;
    const editando = serieId !== null;
    const [titulo, setTitulo] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [temporadas, setTemporadas] = useState('');
    const [nota, setNota] = useState<number | null>(null);

    useEffect(() => {
        if (serieId === null) return;

        getSerieById(serieId).then((serie) => {
            if (!serie) return;
            setTitulo(serie.titulo);
            setPlataforma(serie.plataforma);
            setTemporadas(String(serie.temporadas));
            setNota(serie.nota);
        });
    }, [serieId]);

    function tocarEstrela(valor: number) {
        setNota(nota === valor ? null : valor);
    }

    async function salvar() {
        if (titulo.trim() === '' || plataforma.trim() === '') {
            Alert.alert('Erro', 'Por favor, titulo e plataforma são obrigatórios.');
            return;
        }
        const temporadasNum = Number(temporadas);
        if (temporadas.trim() === '' || !Number.isInteger(temporadasNum) || temporadasNum <= 0) {
            Alert.alert('Erro', 'Por favor, informe um número válido de temporadas.');
            return;
        }
        const input = {
            titulo: titulo.trim(),
            plataforma: plataforma.trim(),
            temporadas: temporadasNum,
            nota: nota ?? 0,
        }

        if (editando) {
            await updateSerie(serieId!, input);
        } 
        else {
            await createSerie(input);
        }


        router.back();
    }
    return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">
        {editando ? 'Editar serie' : 'Novo serie'}
      </Text>
 
      {/* ---------- Campos de texto ---------- */}
      <Text className="text-gray-700 mb-1">Serie</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo} // recebe a string nova e guarda no estado
        placeholder="Ex.: The Bear"
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
      />
 
      <Text className="text-gray-700 mb-1">Plataforma</Text>
      <TextInput
        value={plataforma}
        onChangeText={setPlataforma}
        placeholder="Ex.: Netflix"
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
      />
 
      <Text className="text-gray-700 mb-1">Temporadas</Text>
      <TextInput
        value={temporadas}
        onChangeText={setTemporadas}
        keyboardType="numeric" // só abre teclado numérico; o valor CONTINUA sendo string
        placeholder="Ex.: 5"
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
      />
 
      {/* ---------- Nota com 5 estrelas ---------- */}
      <Text className="text-gray-700 mb-1">Nota (toque de novo para remover)</Text>
      <View className="flex-row gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((valor) => {
          // Estrela "acesa" se o valor dela é <= nota escolhida (ex.: nota 3 acende 1, 2 e 3).
          const acesa = nota !== null && valor <= nota;
          return (
            <Pressable key={valor} onPress={() => tocarEstrela(valor)}>
              <Text className={`text-4xl ${acesa ? 'text-yellow-500' : 'text-gray-300'}`}>★</Text>
            </Pressable>
          );
        })}
      </View>
 
      {/* ---------- Salvar ---------- */}
      <Pressable onPress={salvar} className="bg-blue-600 rounded-lg p-3">
        <Text className="text-white text-center font-bold">Salvar</Text>
      </Pressable>
    </View>
  );
}

