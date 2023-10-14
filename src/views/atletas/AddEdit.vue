<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AtletaDto } from '@/views/atletas/Atleta.dto';
import ModalConfirm from '@/components/ModalConfirm.vue';
import { alterarAtleta, excluirAtleta, inserirAtleta, obterAtleta }
    from '@/views/atletas/Atleta.service';

const route = useRoute()
const router = useRouter();

const atleta = ref({
    codigo: "",
    nome: "",
    dataNascimento: "",
    nacionalidade: "",
    ufNascimento: "",
    cidadeNascimento: "",
    sexo: "",
    rg: "",
    cpf: "",
    email: "",
    telCelular: "",
    religiao: "",
    id: ""
})

onMounted(async () => {
    if (route.params.id) {
        popularForm(route.params.id as string);
    }
})

async function popularForm(idAtleta: string) {
    try {
        const response = await obterAtleta(idAtleta);
        const objAtleta = response as AtletaDto;
        atleta.value.codigo = objAtleta.codigo;
        atleta.value.nome = objAtleta.nome;
        const x = new Date(objAtleta.dataNascimento);
        atleta.value.dataNascimento = x.toISOString().substring(0, 10);
        atleta.value.nacionalidade = objAtleta.nacionalidade;
        atleta.value.ufNascimento = objAtleta.ufNascimento
        atleta.value.cidadeNascimento = objAtleta.cidadeNascimento;
        atleta.value.sexo = objAtleta.sexo;
        atleta.value.rg = objAtleta.rg;
        atleta.value.cpf = objAtleta.cpf;
        atleta.value.email = objAtleta.email;
        atleta.value.telCelular = objAtleta.telCelular;
        atleta.value.religiao = objAtleta.religiao;
        atleta.value.id = objAtleta.id;
    } catch (error) {
        alert(error);
    }
}

async function formSubmit() {
    if (route.params.id) {
        await alterarAtleta(atleta.value).catch(e => alert(e));
    } else {
        await inserirAtleta(atleta.value).catch(e => alert(e));
    }
    router.push({ path: '/atletas' });
}

let showConfirm = ref(false);
let atletaExcluir = ref({
    id: '',
    nome: ''
});

function onExcluirClick() {
    showConfirm.value = true;
    atletaExcluir.value = {
        id: atleta.value.id ,
        nome: atleta.value.nome 
    };
}

async function excluir() {
    showConfirm.value = false;
    try {
        await excluirAtleta(atletaExcluir.value.id);
        router.push({ path: '/atletas' });
    } catch (error) {
        alert(error);
    }
}
</script>

<template>
    <div class="header">
        <div>
            <h5 v-if="$route.params.id">
                Alterar Atleta
            </h5>
            <h5 v-else>
                Inserir Novo Atleta
            </h5>
        </div>
        <div>
            <router-link :to="`/atletas`" class="btn btn-sm btn-primary mr-1">Lista de Atletas</router-link>
        </div>
    </div>

    <form @submit.prevent="formSubmit">
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.codigo" 
            >
            <label>Código</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.nome"
            >
            <label>Nome</label>
        </div>
        <div class="form-floating mb-3">
            <input type="date" class="form-control"
                max="9999-01-01"
                v-model="atleta.dataNascimento"
            >
            <label>Data de nascimento</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.nacionalidade"
            >
            <label>Nacionalidade</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.ufNascimento"
            >
            <label>UF de nascimento</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.cidadeNascimento"
            >
            <label>Cidade de nascimento</label>
        </div>

        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.sexo"
            >
            <label>Gênero</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.rg"
            >
            <label>RG</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.cpf"
            >
            <label>CPF</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.email"
            >
            <label>e-mail</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                v-model="atleta.telCelular"
            >
            <label>Tel.Celular</label>
        </div>
        <div>
            <button class="btn btn-primary">
                Salvar
            </button>
        </div>
    </form>
    <br>
    <button class="btn btn-danger"
        v-if="$route.params.id"
        @click="onExcluirClick()"
    >
        Excluir o(a) atleta: {{ atleta.nome }}
    </button>

    <ModalConfirm :show="showConfirm"
        @clicked-no="showConfirm=false"
        @clicked-yes="excluir"
    >
        <template #default>
            Confirma a exclusão do Atleta {{ atletaExcluir.nome }} ?
        </template>
    </ModalConfirm> 

</template>

<style>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}
</style>
