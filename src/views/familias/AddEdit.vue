<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { FamiliaDto } from '@/views/familias/Familia.dto';
import ModalConfirm from '@/components/ModalConfirm.vue';
import { alterarFamilia, excluirFamilia, inserirFamilia, obterFamilia }
    from '@/views/familias/Familia.service';

const route = useRoute()
const router = useRouter();

const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Informe o Nome da Família'),
});

const familia = ref({
    nome: "",
    id: ""
})

onMounted(async () => {
    if (route.params.id) {
        popularForm(route.params.id as string);
    }
})

async function popularForm(idFamilia: string) {
    try {
        const response = await obterFamilia(idFamilia);
        const objFamilia = response as FamiliaDto;
        familia.value.nome = objFamilia.nome;
        familia.value.id = objFamilia.id;
    } catch (error) {
        alert(error);
    }
}

async function onSubmit(values: any) {
    if (route.params.id) {
        await alterarFamilia(values).catch(e => alert(e));
    } else {
        await inserirFamilia(values).catch(e => alert(e));
    }
    router.push({ path: '/familias' });    
}

let showConfirm = ref(false);
let familiaExcluir = ref({
    id: '',
    nome: ''
});

function onExcluirClick() {
    showConfirm.value = true;
    familiaExcluir.value = {
        id: familia.value.id ,
        nome: familia.value.nome 
    };
}

async function excluir() {
    showConfirm.value = false;
    try {
        await excluirFamilia(familiaExcluir.value.id);
        router.push({ path: '/familias' });
    } catch (error) {
        alert(error);
    }
}
</script>

<template>
    <div class="header">
        <div>
            <h5 v-if="$route.params.id">
                Alterar Família
            </h5>
            <h5 v-else>
                Inserir Nova Família
            </h5>
        </div>
        <div>
            <router-link :to="`/familias`" class="btn btn-sm btn-primary mr-1">Lista de Famílias</router-link>
        </div>
    </div>

    <Form :initial-values="familia"
        @submit="onSubmit"
        :validation-schema="validationSchema"
        v-slot="{ errors, isSubmitting }"
    >
        <div class="form-floating mb-3">
            <Field name="nome" type="text" class="form-control"
                :class="{ 'is-invalid': errors.nome }" />
            <div class="invalid-feedback">{{ errors.nome }}</div>
            <label>Nome</label>
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
        Excluir a família: {{ familia.nome }}
    </button>

    <ModalConfirm :show="showConfirm"
        @clicked-no="showConfirm=false"
        @clicked-yes="excluir"
    >
        <template #default>
            Confirma a exclusão da Família {{ familiaExcluir.nome }} ?
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
