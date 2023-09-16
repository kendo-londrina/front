<script setup lang="ts">
import { fetchWrapper } from '@/helpers';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const baseUrl = `${import.meta.env.VITE_API_URL}/alunos`;
const route = useRoute()

// let atleta = ref([])

// const getAtleta = () => {
//     atleta = [];
//     // atleta = await fetchWrapper.get( `${baseUrl}/${ id}`, '');
// }

onMounted(async () => {
    
    // novoAtleta = route.params.id ? true : false;
    if (route.params.id) {
        popularForm(route.params.id as string);
    } else {

    }
    // const id = route.params.id;
    // console.log(id);
    // const atleta = await fetchWrapper.get(`${baseUrl}/?id=${id}`, '');
    // console.log(atleta);
    // alert('here');
})

async function popularForm(idAtleta: string) {
    const response = await fetchWrapper.get(`${baseUrl}/?id=${idAtleta}`, '');
    const objAtleta = response[0];
    console.log(response);
    console.log(objAtleta);
    atleta.value.codigo = objAtleta.codigo;
    atleta.value.nome = objAtleta.nome;
}

function formSubmitted() {
    alert(atleta);
    console.log(atleta);
}

// let novoAtleta = false;
const atleta = ref({
    codigo: "",
    nome: "",
})

</script>

<template>
    Bora !!!
    <br />
    O id do atleta é {{ $route.params.id }}
    <br />

    <form class="add-form"
        @submit="formSubmitted"
    >
        <input v-model="atleta.codigo" type="text" 
            placeholder="código opcional, se informado deve ser único"
        >
        <input v-model="atleta.nome" type="text" 
            placeholder="nome completo"
        >
        <br>
        código: {{ atleta.codigo }}
        <br>
        nome: {{ atleta.nome }}

        <button class="btn btn-primary">
            Salvar
        </button>

        {{ atleta }}


    </form>

</template>
