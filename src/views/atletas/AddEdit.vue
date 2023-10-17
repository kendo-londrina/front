<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { vMaska } from "maska"
import { AtletaDto } from '@/views/atletas/Atleta.dto';
import ModalConfirm from '@/components/ModalConfirm.vue';
import { alterarAtleta, excluirAtleta, inserirAtleta, obterAtleta }
    from '@/views/atletas/Atleta.service';

const route = useRoute()
const router = useRouter();

const validationSchema = Yup.object().shape({
    codigo: Yup.string(),
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('e-mail inválido'),
    dataNascimento: Yup.date()
        .required('Data de Nascimento é obrigatório')
        .typeError('Data inválida'),
    nacionalidade: Yup.string(),
    ufNascimento: Yup.string(),
    cidadeNascimento: Yup.string(),
    sexo: Yup.string(),
    rg: Yup.string(),
    cpf: Yup.string(),
    telCelular: Yup.string(),
    religiao: Yup.string(),
    id: Yup.string(),
});

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
        const objDate = new Date(objAtleta.dataNascimento);
        atleta.value.dataNascimento = objDate.toISOString().substring(0, 10);
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

// async function formSubmit() {
//     if (route.params.id) {
//         await alterarAtleta(atleta.value).catch(e => alert(e));
//     } else {
//         await inserirAtleta(atleta.value).catch(e => alert(e));
//     }
//     router.push({ path: '/atletas' });
// }
async function onSubmit(values: any) {
    console.log(values);
    console.log(atleta.value);
    if (route.params.id) {
        values.id = route.params.id;
        console.log(values);
        await alterarAtleta(values).catch(e => alert(e));
    } else {
        await inserirAtleta(values).catch(e => alert(e));
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

    <Form :initial-values="atleta"
        @submit="onSubmit"
        :validation-schema="validationSchema"
        v-slot="{ errors, isSubmitting }"
    >
        <div class="form-floating mb-3">
            <Field name="codigo" type="text" class="form-control"
                :class="{ 'is-invalid': errors.codigo }" />
            <div class="invalid-feedback">{{ errors.codigo }}</div>
            <label>Código</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="nome" type="text" class="form-control"
                :class="{ 'is-invalid': errors.nome }" />
            <div class="invalid-feedback">{{ errors.nome }}</div>
            <label>Nome</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="telCelular" type="text" class="form-control"
                v-maska data-maska="(##)#####-####"
                :class="{ 'is-invalid': errors.telCelular }" />
            <div class="invalid-feedback">{{ errors.telCelular }}</div>
            <label>Tel.Celular</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="email" type="text" class="form-control"
                :class="{ 'is-invalid': errors.email }" />
            <div class="invalid-feedback">{{ errors.email }}</div>
            <label>e-mail</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="dataNascimento" type="date" class="form-control"
                :class="{ 'is-invalid': errors.dataNascimento }" />
            <div class="invalid-feedback">{{ errors.dataNascimento }}</div>
            <label>Data de Nascimento</label>
        </div>

        <div class="form-floating mb-3">
            <Field name="nacionalidade" type="text" class="form-control"
                :class="{ 'is-invalid': errors.nacionalidade }" />
            <div class="invalid-feedback">{{ errors.nacionalidade }}</div>
            <label>País de Nascimento</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="ufNascimento" type="text" class="form-control"
                :class="{ 'is-invalid': errors.ufNascimento }" />
            <div class="invalid-feedback">{{ errors.ufNascimento }}</div>
            <label>UF de nascimento</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="cidadeNascimento" type="text" class="form-control"
                :class="{ 'is-invalid': errors.cidadeNascimento }" />
            <div class="invalid-feedback">{{ errors.cidadeNascimento }}</div>
            <label>Cidade de nascimento</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="sexo" type="text" class="form-control"
                :class="{ 'is-invalid': errors.sexo }" />
            <div class="invalid-feedback">{{ errors.sexo }}</div>
            <label>Gênero</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="rg" type="text" class="form-control"
                :class="{ 'is-invalid': errors.rg }" />
            <div class="invalid-feedback">{{ errors.rg }}</div>
            <label>RG</label>
        </div>
        <div class="form-floating mb-3">
            <Field name="cpf" type="text" class="form-control"
                v-maska data-maska="###.###.###-##"
                :class="{ 'is-invalid': errors.cpf }" />
            <div class="invalid-feedback">{{ errors.cpf }}</div>
            <label>CPF</label>
        </div>

        <div class="form-group">
            <button class="btn btn-primary" :disabled="isSubmitting">
                <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                Salvar
            </button>
        </div>
    </Form>
    <!-- <form @submit.prevent="formSubmit">
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
    </form> -->
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
