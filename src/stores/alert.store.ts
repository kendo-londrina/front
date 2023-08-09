import { defineStore } from 'pinia';

interface AlertType {
    message: string
    type: string
}

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
        alert: null as AlertType | null,
    }),
    actions: {
        success(message: any) {
            this.alert = { message, type: 'alert-success' };
        },
        error(message: any) {
            this.alert = { message, type: 'alert-danger' };
        },
        clear() {
            this.alert = null;
        }
    }
});
