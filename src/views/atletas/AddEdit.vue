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
    const id = route.params.id;
    console.log(id);
    const atletas = await fetchWrapper.get(baseUrl, '');
    console.log(atletas);
    // alert('here');
})


const newItem = ref("");
const modalidade = ref("Individual");
const graduacao = ref("Não graduado");
const praticaIai = ref(false);
const modalidades = ref([]);

</script>

<template>
    Bora !!!
    <br />
    O id do atleta é {{ $route.params.id }}
    <br />
    <div>
        <input v-model="newItem" type="text" placeholder="digite algo aqui ...">
        {{ newItem }}
    </div>
    <div>
        <label>
            <input type="radio" v-model="modalidade" value="Individual">
            Individual
        </label>
        <label>
            <input type="radio" v-model="modalidade" value="Equipe">
            Equipe
        </label>
        Modalidade selecionada: {{ modalidade }}
    </div>
    <div>
        <label>
            <select v-model="graduacao">
                <option value="Não graduado">Não graduado</option>
                <option value="1o.Dan">1o.Dan</option>
                <option value="2o.Dan">2o.Dan</option>
                <option value="3o.Dan">3o.Dan</option>
                <option value="4o.Dan">4o.Dan</option>
                <option value="5o.Dan">5o.Dan</option>
                <option value="6o.Dan">6o.Dan</option>
                <option value="7o.Dan">7o.Dan</option>
            </select>
        </label>
        Graduação atual: {{ graduacao }}
    </div>
    <div>
        <label>
            <input type="checkbox" v-model="praticaIai">
            Pratica Iaido
        </label>
        {{ praticaIai }}
    </div>
    <div>
        <label>
            <input type="checkbox" v-model="modalidades" value="Iaido">
            Iaido
        </label>
        <label>
            <input type="checkbox" v-model="modalidades" value="Jodo">
            Jodo
        </label>
        <label>
            <input type="checkbox" v-model="modalidades" value="Kendo">
            Kendo
        </label>
        {{ modalidades }}
    </div>
    <form class="add-iem-form"
        @submit=""
    ></form>

</template>
