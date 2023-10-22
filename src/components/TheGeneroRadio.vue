<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue == '' ? 'N' : props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
})
</script>

<template>
  <div class="space-around">
      <label>
          <input type="radio" v-model="value" value="N">
          Não informado
      </label>
      <label>
          <input type="radio" v-model="value" value="F">
          Feminino
      </label>
      <label>
          <input type="radio" v-model="value" value="M">
          Masculino
      </label>
      <label>
          <input type="radio" v-model="value" value="O">
          Outro
      </label>
  </div>
</template>

<style scoped>
.space-around {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.column {
    flex-direction: column;
}
</style>
