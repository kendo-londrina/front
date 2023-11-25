import { fetchWrapper } from '@/helpers';
import { FamiliaDto } from '@/views/familias/Familia.dto';

const baseUrl = `${import.meta.env.VITE_API_URL}/familias`;

export async function obterFamilias(page?: number, rows?: number) {
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

export async function obterFamilia(idFamilia: string) {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/?id=${idFamilia}`, '');
        return response[0];
    } catch (error) {
        console.error(error);
    }
}

export async function alterarFamilia(familia: FamiliaDto) {
    try {
        await fetchWrapper.put(`${baseUrl}/${familia.id}`, JSON.stringify(familia));
    } catch (error) {
        console.error(error);
    }
}

export async function inserirFamilia(familia: FamiliaDto) {
    try {
        await fetchWrapper.post(`${baseUrl}`, JSON.stringify(familia));
    } catch (error) {
        console.error(error);
    }
}

export async function excluirFamilia(idFamilia: string) {
    try {
        await fetchWrapper.delete(`${baseUrl}/${idFamilia}`, '');
    } catch (error) {
        console.error(error);
    }
}
