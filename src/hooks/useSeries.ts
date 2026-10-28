import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getSeries, toggleSerieConcluida, deleteSerie, contarSeries } from '../database/serieRepository';
import { Serie, SerieFilter } from '../types/serie';

// junta tudo que a lista precisa: carregar, filtrar, alternar, remover e os contadores
export function useSeries() {
    const [series, setSeries] = useState<Serie[]>([]);
    const [filtro, setFiltro] = useState<SerieFilter>('todas');
    const [total, setTotal] = useState(0);
    const [concluidas, setConcluidas] = useState(0);

    const carregar = useCallback(async () => {
        const [lista, contagem] = await Promise.all([getSeries(filtro), contarSeries()]);
        setSeries(lista);
        setTotal(contagem.total);
        setConcluidas(contagem.concluidas);
    }, [filtro]);

    // roda toda vez que a tela ganha foco (e quando o filtro muda)
    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    async function alternar(id: number) {
        await toggleSerieConcluida(id);
        await carregar();
    }

    async function remover(id: number) {
        await deleteSerie(id);
        await carregar();
    }

    return { series, filtro, setFiltro, total, concluidas, alternar, remover };
}
