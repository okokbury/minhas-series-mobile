export interface UserProfile {
    id: number;
    nome: string;
    email: string;
    fotoUri: string | null;
    updatedAt: string;
}

export type SaveProfileInput = Omit<UserProfile, 'id' | 'updatedAt'>;
