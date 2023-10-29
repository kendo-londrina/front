<script setup lang="ts">

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { vMaska } from "maska"
import { AtletaDto } from '@/views/atletas/Atleta.dto';
import ModalConfirm from '@/components/ModalConfirm.vue';
import {
    TheGeneroRadio,
    ThePaisAutocomplete,
    TheUfAutocomplete,
    TheMunicipioAutocomplete
} from '@/components';
import { alterarAtleta, excluirAtleta, inserirAtleta, obterAtleta }
    from '@/views/atletas/Atleta.service';

const route = useRoute()
const router = useRouter();

function isValidDate(s: string) {
  var bits = s.split('/');
  var d = new Date(Number(bits[2]), Number(bits[1]) - 1, Number(bits[0]));
  return d && (d.getMonth() + 1) == Number(bits[1]);
}

const validationSchema = Yup.object().shape({
    codigo: Yup.string(),
    nome: Yup.string().required('Informe o Nome'),
    email: Yup.string().email('Informe um e-mail válido'),
    dataNascimento: Yup.string()
        .required('Informe a Data de Nascimento')
        .test('valid-date', 'Informe uma data válida no formato dd/mm/aaaa',
            function(value) {
                return isValidDate(value as string);
            }),
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
    sexo: "N",
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

watch(() =>
    [
        atleta.value.nacionalidade,
        atleta.value.ufNascimento,
    ],
    async (newValue, oldValue) => {
        if (newValue[0] !== oldValue[0]) {
            if (oldValue[0] != '') {
                atleta.value.ufNascimento = '';
            }
        }
        if (newValue[1] !== oldValue[1]) {
            if (oldValue[1] != '') {
                atleta.value.cidadeNascimento = '';
            }
        }
    }
)

const isBrasileiro = computed(() => {
  return atleta.value.nacionalidade === 'Brasil';
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

async function onSubmit(values: any) {
    if (route.params.id) {
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
            <Field name="dataNascimento" type="text"
                v-maska data-maska="##/##/####"
                class="form-control"
                :class="{ 'is-invalid': errors.dataNascimento }" />
            <div class="invalid-feedback">{{ errors.dataNascimento }}</div>
            <label>Data de Nascimento</label>
        </div>

        <div class="form-floating mb-3">
            <ThePaisAutocomplete
                v-model="atleta.nacionalidade"
            ></ThePaisAutocomplete>
            <label>País de Nascimento</label>
        </div>
        <Field hidden name="nacionalidade" type="text"/>
        <div class="form-floating mb-3" v-if="isBrasileiro">
            <TheUfAutocomplete
                v-model="atleta.ufNascimento"
            ></TheUfAutocomplete>
            <label>UF de Nascimento</label>
        </div>
        <Field hidden name="ufNascimento" type="text"/>
        <div class="form-floating mb-3" v-if="isBrasileiro">
            <TheMunicipioAutocomplete
                :uf="atleta.ufNascimento"
                v-model="atleta.cidadeNascimento"
            ></TheMunicipioAutocomplete>
            <label>Cidade de Nascimento</label>
        </div>
        <Field hidden name="cidadeNascimento" type="text"/>
        <div>
            <label class="genero-label">Gênero</label>
            <div class="genero-radio">
                <TheGeneroRadio 
                    v-model="atleta.sexo">
                </TheGeneroRadio>
            </div>
            <Field hidden name="sexo" type="text" />
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

        <Field hidden name="id" type="text" />

        <div class="form-group">
            <button class="btn btn-primary" :disabled="isSubmitting">
                <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                Salvar
            </button>
        </div>
    </Form>
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

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}
.genero-label {
    opacity: .65;
    font-size: small;
    margin-left: 15px;
}
.genero-radio {
    padding-left: 20px;
    margin-bottom: 20px;
}
</style>
