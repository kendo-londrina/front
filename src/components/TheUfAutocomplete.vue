<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchWrapper } from '@/helpers';

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const sigla = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	}
})
const ufNome = ref('');

const loading = ref(true);
const arrowCounter = ref(0);

let ufs = reactive([
	{
		sigla: '',
		nome: '',
	}
]);
let ufsFiltrados = ref([
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

const getUfNome = (sigla: string) => {
	const _uf = ufs.filter(p => p.sigla.toLowerCase()
		.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
		.search(
			sigla.toLowerCase()
				.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
		) >= 0
	);
	return _uf[0].nome;
} 

onMounted(async () => {
	ufs = await getUfsFromIbge();
	resetOptions();
	setArrowCounter(0);
	loading.value = false;

	ufNome.value = props.modelValue
		? getUfNome(props.modelValue)
		: '';
})

function onInput(event: any) {
	if (event) {
		resetOptions();
		filterUfs(event.target.value);
	}
}

function filterUfs(filterBy: string) {
	ufsFiltrados.value = ufs.filter(
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
	ufsFiltrados.value = []
}

function onUfsFiltradosClick(opt: string) {
	sigla.value = opt;
	ufNome.value = getUfNome(opt);
	resetOptions();
	setArrowCounter(0);
}

function onKeydown(evt: any) {
	if (!ufsFiltrados.value.length) { return; }
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
	if (arrowCounter.value < ufsFiltrados.value.length - 1) {
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
	var ufElement = document.getElementById(`opt-ufs-${arrowCounter.value}`);
	if (ufElement) {
		ufElement.scrollIntoView(
			{
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start'
			}
		);
	}
}

function onSelect() {
	sigla.value = ufsFiltrados.value[arrowCounter.value].sigla;
	ufNome.value = ufsFiltrados.value[arrowCounter.value].nome;
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
			v-model="ufNome"
			class="form-control"
			type="text"
			@input="onInput"
			@keydown="onKeydown"
		/>
		<div
			v-show="ufsFiltrados.length && ufNome.length"
			class="list-group lista-ufs border"
		>
			<li
				v-for="(opt, index) in ufsFiltrados"
				class="list-group-item"
				style="border: none;"
				:class="{ 'active': arrowCounter === index }"
				:key="opt.nome"
				:id="`opt-ufs-${index}`"
				tabindex="0"
				@mouseover="setArrowCounter(index)"
				@click="onUfsFiltradosClick(opt.sigla)"
			>
				<span class="font-normal">
					{{ opt.nome }}
				</span>
			</li>
		</div>
	</template>
</template>

<style scoped>
.lista-ufs {
	max-height: 200px;
	overflow-y: scroll;
	margin-left: 16px;
}
</style>
