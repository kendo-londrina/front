<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { obterAtletas } from '@/views/atletas/Atleta.service';
import { AtletaDto } from '@/views/atletas/Atleta.dto';

const atletas = ref([] as AtletaDto[])

const router = useRouter();

function onRowClick(atletaId: string) {
    router.push({ path: `/atletas/edit/${atletaId}` });
}

onMounted(async () => {
    carregar();
})

async function carregar() {
    try {
        const response = await obterAtletas(1, 50);
        const objAtletas = response.data as [AtletaDto]
        objAtletas.forEach(atleta => {
            atletas.value.push(atleta);
        });
    } catch (error) {
        console.log(error);
    }
}

</script>

<template>
    <div class="header">
        <h1>Atletas</h1>
        <router-link to="/atletas/add" class="btn btn-sm btn-success mb-2">Novo Atleta</router-link>
    </div>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 20%">Código</th>
                <th style="width: 80%">Nome</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="atletas">
                <tr v-for="atleta in atletas" :key="atleta.id"
                    @click="onRowClick(atleta.id)"
                    class="table-row"
                >
                    <td>{{ atleta.codigo }}</td>
                    <td>{{ atleta.nome }}</td>
                </tr>
            </template>
        </tbody>
    </table>
    
</template>

<style>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}
.table-row {
    cursor: pointer;
}
</style>
