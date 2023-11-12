<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { obterFamilias } from '@/views/familias/Familia.service';
import { FamiliaDto } from '@/views/familias/Familia.dto';

const familias = ref([] as FamiliaDto[])

const router = useRouter();

function onRowClick(familiaId: string) {
    router.push({ path: `/familias/edit/${familiaId}` });
}

onMounted(async () => {
    carregar();
})

async function carregar() {
    try {
        const response = await obterFamilias(1, 50);
        const objFamilias = response.data as [FamiliaDto];
        objFamilias.forEach(familia => {
            familias.value.push(familia);
        });
    } catch (error) {
        console.log(error);
    }
}

</script>

<template>
    <div class="header">
        <h1>Familias</h1>
        <router-link to="/familias/add" class="btn btn-sm btn-success mb-2">Nova Família</router-link>
    </div>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 100%">Nome</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="familias">
                <tr v-for="familia in familias" :key="familia.id"
                    @click="onRowClick(familia.id)"
                    class="table-row"
                >
                    <td>{{ familia.nome }}</td>
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
