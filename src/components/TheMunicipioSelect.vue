<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers';

const props = defineProps(['modelValue', 'uf', 'isFormControl'])
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

let municipios = reactive([
  {
    id: '',
    nome: '',
  }
]);

async function getMunicipiosFromIbge(uf: string) {
  const url = (import.meta.env.VITE_IBGE_MUNICIPIOS as string).replace('{{uf}}', uf);
  try {
    const response = await fetchWrapper.get(url, '');
    return response;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  municipios = await getMunicipiosFromIbge(props.uf);
  loading.value = false;
})

watch(() => props.uf, async (newUf) => {
  loading.value = true;
  municipios = await getMunicipiosFromIbge(newUf);
  loading.value = false;
})

</script>

<template>
  <template v-if="loading">
    loading...
  </template>
  <template v-else>
    <select :class="{'form-control': props.isFormControl}" v-model="value">
      <option v-for="municipio in municipios" :key="municipio.id" :value="municipio.nome">{{ municipio.nome }}</option>
    </select>
  </template>
</template>

<style scoped>
</style>
