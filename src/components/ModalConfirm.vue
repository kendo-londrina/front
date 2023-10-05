<script setup lang="ts">
    export interface Props {
        show?: boolean,
        yesText?: string,
        noText?: string
    }
    withDefaults(defineProps<Props>(), {
        show: false,
        yesText: 'sim',
        noText: 'não'
    })
</script>

<template>
    <div v-if="show" class="modal-mask">
        <div class="modal-container">
            <header>
                <h4>Confirmação</h4>
            </header>
            <div> 
                <slot>
                    Confirma a operação? ou Continuar?
                </slot>
            </div>
            <footer class="modal-footer">
                <button class="btn btn-sm btn-danger"
                    @click="$emit('clicked-yes')"
                >
                    {{ yesText }}
                </button>
                <button class="btn btn-sm btn-primary mr-1"
                    @click="$emit('clicked-no')"
                >
                    {{ noText }}
                </button>
            </footer>
        </div>
    </div>
</template>

<style>
.modal-mask {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.6);
    display: grid;
    place-items: center;
}
.modal-container {
    background: white;
    padding: 1rem;
    width: 80vw;
    max-width: 500px;
    border-radius: 7px;
}
.modal-footer {
    border-top: 1px solid #ddd;
    margin-top: 1rem;
    padding-top: 0.5rem;
    font-size: .8rem;
    display: flex;
    justify-content: space-around;
}
</style>