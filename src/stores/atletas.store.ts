import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
// import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/alunos`;

interface AtletaInfo {
    codigo: string
    nome: string
    dataNascimento: Date
    sexo: string
    rg: string
    cpf: string
    email: string
    telCelular: string
    id: string
    isDeleting: boolean
}
  
export const useAtletasStore = defineStore({
    id: 'atletas',
    state: () => ({
        atletas: [] as AtletaInfo[], // | { loading?: boolean, error?: unknown },
        atleta: null as AtletaInfo | null,
    }),
    actions: {
        // async register(aluno) {
        //     await fetchWrapper.post(`${baseUrl}/register`, aluno);
        // },
        async getAll() {
            // this.alunos = { loading: true };
            try {
                const resp = await fetchWrapper.get(baseUrl, '');
                console.log(resp);
                this.atletas = resp.data;
            } catch (error) {
                console.log(error);
                // this.alunos = { error };
            }
        },
        // async getById(id) {
        //     this.aluno = { loading: true };
        //     try {
        //         this.aluno = await fetchWrapper.get(`${baseUrl}/${id}`);
        //     } catch (error) {
        //         this.aluno = { error };
        //     }
        // },
        // async update(id, params) {
        //     await fetchWrapper.put(`${baseUrl}/${id}`, params);

        //     // update stored aluno if the logged in aluno updated their own record
        //     const authStore = useAuthStore();
        //     if (id === authStore.aluno.id) {
        //         // update local storage
        //         const aluno = { ...authStore.aluno, ...params };
        //         localStorage.setItem('aluno', JSON.stringify(aluno));

        //         // update auth aluno in pinia state
        //         authStore.aluno = aluno;
        //     }
        // },
        async delete(id: string) {
            //aluno being deleted
            const objToDelete = this.atletas.find(x => x.id === id);
            if (objToDelete) {
                objToDelete.isDeleting = true;
                await fetchWrapper.delete(`${baseUrl}/${id}`, '');
                // remove aluno from list after deleted
                this.atletas = this.atletas.filter(x => x.id !== id);
            }
            // auto logout if the logged in aluno deleted their own record
            // const authStore = useAuthStore();
            // if (id === authStore.aluno.id) {
            //     authStore.logout();
            // }
        }
    }
});
