<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAtletasStore } from '@/stores';

const atletasStore = useAtletasStore();
const { atletas } = storeToRefs(atletasStore);

atletasStore.getAll();
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
                        <router-link :to="`/users/edit/${atleta.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="atletasStore.delete(atleta.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="atleta.isDeleting">
                            <span v-if="atleta.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
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
</template>
