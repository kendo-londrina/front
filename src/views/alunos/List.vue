<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAlunosStore } from '@/stores';

const alunosStore = useAlunosStore();
const { alunos } = storeToRefs(alunosStore);

alunosStore.getAll();
</script>

<template>
    <h1>Users</h1>
    <router-link to="/users/add" class="btn btn-sm btn-success mb-2">Add User</router-link>
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
            <template v-if="alunos">
                <tr v-for="user in alunos" :key="user.id">
                    <td>{{ user.nome }}</td>
                    <td>{{ user.dataNascimento }}</td>
                    <td>{{ user.email }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="alunosStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
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
