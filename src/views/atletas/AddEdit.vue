<script setup lang="ts">
import { fetchWrapper } from '@/helpers';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AtletaDto } from '@/views/atletas/Atleta.dto';

const baseUrl = `${import.meta.env.VITE_API_URL}/alunos`;
const route = useRoute()

onMounted(async () => {
    
    // novoAtleta = route.params.id ? true : false;
    if (route.params.id) {
        popularForm(route.params.id as string);
    } else {

    }
})

async function popularForm(idAtleta: string) {
    const response = await fetchWrapper.get(`${baseUrl}/?id=${idAtleta}`, '');
    const objAtleta = response[0] as AtletaDto;
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
}

async function alterarAtleta(idAtleta: string) {
    await fetchWrapper.put(`${baseUrl}/${idAtleta}`, JSON.stringify(atleta.value));
}

function formSubmit() {
    if (route.params.id) {
        alterarAtleta(route.params.id as string);
    } else {

    }
}

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
    religiao: ""
})

</script>

<template>

    <div>
        O id do atleta é {{ $route.params.id }}
    </div>
    <form @submit="formSubmit">
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                placeholder="código opcional, se informado deve ser único"
                v-model="atleta.codigo" 
            >
            <label>Código</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control"
                placeholder="nome completo"
                v-model="atleta.nome"
            >
            <label>Nome</label>
        </div>
        <div class="form-floating mb-3">
            <input type="date" class="form-control"
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

        <button class="btn btn-primary">
            Salvar
        </button>
    </form>

</template>
