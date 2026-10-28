import { useEffect, useState } from 'react';
import { Directory, File, Paths } from 'expo-file-system';
import { getProfile, saveProfile } from '../database/profileRepository';
import { UserProfile, SaveProfileInput } from '../types/profile';

// a foto da câmera fica numa pasta temporária; copiamos para documentos para não sumir
async function guardarFoto(uriTemporaria: string): Promise<string> {
    const pasta = new Directory(Paths.document, 'perfil');
    if (!pasta.exists) pasta.create();
    const destino = new File(pasta, `foto-${Date.now()}.jpg`);
    await new File(uriTemporaria).copy(destino);
    return destino.uri;
}

function apagarFoto(uri: string) {
    const arquivo = new File(uri);
    if (arquivo.exists) arquivo.delete();
}

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        getProfile()
            .then(setProfile)
            .finally(() => setCarregando(false));
    }, []);

    async function salvar(input: SaveProfileInput) {
        let fotoUri = input.fotoUri;
        const fotoAntiga = profile?.fotoUri ?? null;

        // foto nova (ainda temporária): copia para documentos
        if (fotoUri && fotoUri !== fotoAntiga) {
            fotoUri = await guardarFoto(fotoUri);
        }
        // trocou ou removeu a foto: apaga o arquivo antigo
        if (fotoAntiga && fotoAntiga !== fotoUri) {
            apagarFoto(fotoAntiga);
        }

        const salvo = await saveProfile({ ...input, fotoUri });
        setProfile(salvo);
    }

    return { profile, carregando, salvar };
}
