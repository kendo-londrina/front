<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchWrapper } from '@/helpers';

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const pais = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	}
})

const loading = ref(true);
const arrowCounter = ref(0);

let paises = reactive([
	{
		nome: '',
	}
]);
let paisesFiltrados = ref([
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
	resetOptions();
	setArrowCounter(0);
	loading.value = false;
})

function onInput(event: any) {
	if (event) {
		resetOptions();
		filterPaises(event.target.value);
	}
}

function filterPaises(filterBy: string) {
	paisesFiltrados.value = paises.filter(
		p => p.nome.toLowerCase()
			.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
			.search(
				filterBy.toLowerCase()
					.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
			) >= 0
	);
	setArrowCounter(0);
}

function setArrowCounter(number: number) {
	arrowCounter.value = number;
}

function resetOptions() {
	paisesFiltrados.value = []
}

function onPaisesFiltradosClick(opt: string) {
	pais.value = opt;
	resetOptions();
	setArrowCounter(0);
}

function onKeydown(evt: any) {
	if (!paisesFiltrados.value.length) { return; }
	switch (evt.code) {
		case 'ArrowDown':
			evt.preventDefault();
			onArrowDown();
			break;
		case 'ArrowUp':
			evt.preventDefault();
			onArrowUp();
			break;
		case 'Enter':
			evt.preventDefault();
			onSelect();
			break;
		case 'Escape':
			onEsc();
			break;
	}
}

function onEsc() {
	setArrowCounter(0);
	resetOptions();
}

function onArrowDown() {
	if (arrowCounter.value < paisesFiltrados.value.length - 1) {
		arrowCounter.value++;
	}
	fixScrolling();
}

function onArrowUp() {
	if (arrowCounter.value > 0) {
		arrowCounter.value--;
	}
	fixScrolling();
}

function fixScrolling() {
	var paisElement = document.getElementById(`opt-pais-${arrowCounter.value}`);
	if (paisElement) {
		paisElement.scrollIntoView(
			{
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start'
			}
		);
	}
}

function onSelect() {
	pais.value = paisesFiltrados.value[arrowCounter.value].nome;
	resetOptions();
	setArrowCounter(0);
}
</script>

<template>
	<template v-if="loading">
		loading...
	</template>
	<template v-else>
		<input
			v-model="pais"
			class="form-control"
			type="text"
			@input="onInput"
			@keydown="onKeydown"
		/>
		<div
			v-show="paisesFiltrados.length && pais.length >= 1"
			class="list-group lista-paises border"
		>
			<li
				v-for="(opt, index) in paisesFiltrados"
				class="list-group-item"
				style="border: none;"
				:class="{ 'active': arrowCounter === index }"
				:key="opt.nome"
				:id="`opt-pais-${index}`"
				tabindex="0"
				@mouseover="setArrowCounter(index)"
				@click="onPaisesFiltradosClick(opt.nome)"
			>
				<span class="font-normal">
					{{ opt.nome }}
				</span>
			</li>
		</div>
	</template>
</template>

<style scoped>
.lista-paises {
	max-height: 200px;
	overflow-y: scroll;
	margin-left: 16px;
}
</style>
