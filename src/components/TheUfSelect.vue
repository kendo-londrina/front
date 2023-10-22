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

let ufs = reactive([
  {
    sigla: '',
    nome: '',
  }
]);

async function getUfsFromIbge() {
  try {
    const response = await fetchWrapper.get(import.meta.env.VITE_IBGE_ESTADOS, '');
    return response;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  ufs = await getUfsFromIbge();
  loading.value = false;
})

</script>

<template>
  <template v-if="loading">
    loading...
  </template>
  <template v-else>
    <select :class="{'form-control': props.isFormControl}" v-model="value">
      <option v-for="uf in ufs" :key="uf.sigla" :value="uf.sigla">{{ uf.nome }}</option>
    </select>
  </template>
</template>

<style scoped>
</style>
