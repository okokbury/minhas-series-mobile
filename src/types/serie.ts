export interface Serie {
    id: number;
    titulo: string;
    plataforma: string;
    temporadas: number;
    nota: number | null;
    concluida: number;
    createdAt: string;
}

export type CreateSerieInput = Omit<Serie, 'id' | 'createdAt' | 'concluida'>;

export type UpdateSerieInput = Partial<CreateSerieInput> & { id: number };

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas' 
