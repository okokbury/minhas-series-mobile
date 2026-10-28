import { getDatabase } from './database';
import { UserProfile, SaveProfileInput } from '../types/profile';

// o app tem um perfil só, sempre com id = 1
const PERFIL_ID = 1;

export async function getProfile(): Promise<UserProfile | null> {
    const db = await getDatabase();
    return db.getFirstAsync<UserProfile>('SELECT * FROM profile WHERE id = ?', [PERFIL_ID]);
}

export async function saveProfile(input: SaveProfileInput): Promise<UserProfile> {
    const db = await getDatabase();
    const updatedAt = new Date().toISOString();
    // cria na primeira vez e atualiza nas próximas
    await db.runAsync(
        'INSERT INTO profile (id, nome, email, fotoUri, updatedAt) VALUES (?, ?, ?, ?, ?) ' +
        'ON CONFLICT(id) DO UPDATE SET nome = excluded.nome, email = excluded.email, ' +
        'fotoUri = excluded.fotoUri, updatedAt = excluded.updatedAt',
        [PERFIL_ID, input.nome, input.email, input.fotoUri, updatedAt]
    );
    return { id: PERFIL_ID, ...input, updatedAt };
}
