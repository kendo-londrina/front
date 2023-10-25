<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { fetchWrapper } from '@/helpers';

const props = defineProps(['modelValue', 'uf'])
const emit = defineEmits(['update:modelValue'])
const municipio = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	}
})

const loading = ref(true);
const arrowCounter = ref(0);

let municipios = reactive([
	{
		id: '',
		nome: '',
	}
]);
let municipiosFiltrados = ref([
	{
		id: '',
		nome: '',
	}
]);

async function getMunicipiosFromIbge(uf: string) {
	if (uf.trim() == '') {
    	return;
  	}
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
	resetOptions();
	setArrowCounter(0);
	loading.value = false;
})

watch(() => props.uf, async (newUf) => {
  	loading.value = true;
	municipios = await getMunicipiosFromIbge(newUf);
	resetOptions();
	setArrowCounter(0);
	loading.value = false;
})

function onInput(event: any) {
	if (event) {
		resetOptions();
		filterMunicipios(event.target.value);
	}
}

function filterMunicipios(filterBy: string) {
	municipiosFiltrados.value = municipios.filter(
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
	municipiosFiltrados.value = []
}

function onMunicipiosFiltradosClick(opt: string) {
	municipio.value = opt;
	resetOptions();
	setArrowCounter(0);
}

function onKeydown(evt: any) {
	if (!municipiosFiltrados.value.length) { return; }
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
	if (arrowCounter.value < municipiosFiltrados.value.length - 1) {
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
	const municipioElement = document.getElementById(`opt-municipio-${arrowCounter.value}`);
	if (municipioElement) {
		municipioElement.scrollIntoView(
			{
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start'
			}
		);
	}
}

function onSelect() {
	municipio.value = municipiosFiltrados.value[arrowCounter.value].nome;
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
			v-model="municipio"
			class="form-control"
			type="text"
			@input="onInput"
			@keydown="onKeydown"
		/>
		<div
			v-show="municipiosFiltrados.length && municipio.length"
			class="list-group lista-municipios border"
		>
			<li
				v-for="(opt, index) in municipiosFiltrados"
				class="list-group-item"
				style="border: none;"
				:class="{ 'active': arrowCounter === index }"
				:key="opt.nome"
				:id="`opt-municipio-${index}`"
				tabindex="0"
				@mouseover="setArrowCounter(index)"
				@click="onMunicipiosFiltradosClick(opt.nome)"
			>
				<span class="font-normal">
					{{ opt.nome }}
				</span>
			</li>
		</div>
	</template>
</template>

<style scoped>
.lista-municipios {
	max-height: 200px;
	overflow-y: scroll;
	margin-left: 16px;
}
</style>
