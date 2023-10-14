import { fetchWrapper } from '@/helpers';
import { AtletaDto } from '@/views/atletas/Atleta.dto';

const baseUrl = `${import.meta.env.API_URL}/alunos`;

export async function obterAtletas(page?: number, rows?: number) {
    try {
        let url = baseUrl + '/';
        if (page && rows) {
            url = `${baseUrl}/?page=${page}&row=${rows}`;
        }
        const response = await fetchWrapper.get(url, '');
        return response;
    } catch (error) {
        console.error(error);
    }
}

export async function obterAtleta(idAtleta: string) {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/?id=${idAtleta}`, '');
        return response[0];
    } catch (error) {
        console.error(error);
    }
}

export async function alterarAtleta(atleta: AtletaDto) {
    try {
        await fetchWrapper.put(`${baseUrl}/${atleta.id}`, JSON.stringify(atleta));
    } catch (error) {
        console.error(error);
    }
}

export async function inserirAtleta(atleta: AtletaDto) {
    try {
        await fetchWrapper.post(`${baseUrl}`, JSON.stringify(atleta));
    } catch (error) {
        console.error(error);
    }
}

export async function excluirAtleta(idAtleta: string) {
    try {
        await fetchWrapper.delete(`${baseUrl}/${idAtleta}`, '');
    } catch (error) {
        console.error(error);
    }
}