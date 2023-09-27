<script setup lang="ts">

import { onMounted, ref } from 'vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import { excluirAtleta, obterAtletas } from '@/views/atletas/Atleta.service';
import { AtletaDto } from '@/views/atletas/Atleta.dto';

const atletas = ref([] as AtletaDto[])

let showConfirm = ref(false);
let atletaExcluir = ref({
    id: '',
    nome: ''
});
function onDeleteClick(atletaId: string, atletaNome: string) {
    showConfirm.value = true;
    atletaExcluir.value = {
        id: atletaId,
        nome: atletaNome
    };
}

onMounted(async () => {
    carregar();
})

async function carregar() {
    try {
        const response = await obterAtletas(1, 10);
        const objAtletas = response.data as [AtletaDto]
        objAtletas.forEach(atleta => {
            atletas.value.push(atleta);
        });
    } catch (error) {
        alert(error);
    }
}

async function excluir() {
    showConfirm.value = false;
    try {
        await excluirAtleta(atletaExcluir.value.id);
    } catch (error) {
        alert(error);
    }
}

</script>

<template>
    <h1>Atletas</h1>
    <router-link to="/atletas/add" class="btn btn-sm btn-success mb-2">Novo Atleta</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 30%">Nome</th>
                <th style="width: 30%">Dt.Nasc</th>
                <th style="width: 30%">email</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="atletas">
                <tr v-for="atleta in atletas" :key="atleta.id">
                    <td>{{ atleta.nome }}</td>
                    <td>{{ atleta.dataNascimento }}</td>
                    <td>{{ atleta.email }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/atletas/edit/${atleta.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="onDeleteClick(atleta.id!, atleta.nome!)" class="btn btn-sm btn-danger btn-delete-user">
                            <!-- <span v-if="atleta.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span> -->
                            <span>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <!-- <tr v-if="alunos.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr> -->
            <!-- <tr v-if="alunos.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{alunos.error}}</div>
                </td>
            </tr> -->
        </tbody>
    </table>
    <ModalConfirm :show="showConfirm"
        @clicked-no="showConfirm=false"
        @clicked-yes="excluir"
    >
        <template #default>
            Confirma a exclusão do Atleta {{ atletaExcluir.nome }}
        </template>
    </ModalConfirm> 
    
</template>
