<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchWrapper } from '@/helpers';

const props = defineProps(['modelValue', 'isFormControl'])
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
})

const loading = ref(true);

let paises = reactive([
  {
    nome: '',
  }
]);

async function getPaisesFromIbge() {
  try {
    const response = await fetchWrapper.get(import.meta.env.VITE_IBGE_PAISES, '');
    return response;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  paises = await getPaisesFromIbge();
  loading.value = false;
})

</script>

<template>
  <template v-if="loading">
    loading...
  </template>
  <template v-else>
    <select :class="{'form-control': props.isFormControl}" v-model="value">
      <option v-for="pais in paises" :key="pais.nome" :value="pais.nome">{{ pais.nome }}</option>
    </select>
  </template>
</template>

<style scoped>
</style>
