import { fetchWrapper } from '@/helpers';
import { AtletaDto } from '@/views/atletas/Atleta.dto';

const baseUrl = `${import.meta.env.VITE_API_URL}/alunos`;

export async function obterAtleta(idAtleta: string) {
    const response = await fetchWrapper.get(`${baseUrl}/?id=${idAtleta}`, '');
    return response[0];
}

export async function alterarAtleta(atleta: AtletaDto) {
    try {
        const response = await fetchWrapper.put(`${baseUrl}/${atleta.id}`, JSON.stringify(atleta));
        console.log(response);
        alert('wait');
    } catch (error) {
        console.log(error);
        alert('error');
    }
}

export async function inserirAtleta(atleta: AtletaDto) {
    try {
        console.log(JSON.stringify(atleta));
        alert(`${baseUrl}`);
        const response = await fetchWrapper.post(`${baseUrl}`, JSON.stringify(atleta));
        console.log(response);
        alert('wait');
    } catch (error) {
        console.log(error);
        alert('error');
    }
}

export async function excluirAtleta(idAtleta: string) {
    try {
        const response = await fetchWrapper.delete(`${baseUrl}/${idAtleta}`, '');
        console.log(response);
        alert('wait');
    } catch (error) {
        console.log(error);
        alert('error');
    }
}