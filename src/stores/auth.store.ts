import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

const loginUrl = `${import.meta.env.VITE_API_URL}/token`;
const refreshTokenUrl = `${import.meta.env.VITE_API_URL}/refresh-token`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user') ?? '{}'),
        returnUrl: ''
    }),
    actions: {
        async login(username: string, password: string) {
            try {
                const body = JSON.stringify(
                    {
                        Email: username,
                        Password: password
                    }
                );
                const user = await fetchWrapper.post(loginUrl, body);    

                // update pinia state
                this.user = user;

                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));

                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
            } catch (error) {
                const alertStore = useAlertStore();
                alertStore.error(error == 401 ? 'problema na autenticação' : error);
                throw new Error();
            }
        },

        async refreshToken(accessToken: string, refreshToken: string) {
            try {
                const body = JSON.stringify(
                    {
                        AccessToken: accessToken,
                        RefreshToken: refreshToken
                    }
                );
                console.log(body);
                const user = await fetchWrapper.post(refreshTokenUrl, body);    

                // update pinia state
                this.user = user;

                // store user details and jwt in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));

                // redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
            } catch (error) {
                const alertStore = useAlertStore();
                alertStore.error(error == 401 ? 'problema na autenticação' : error);
                throw new Error();
            }
        },

        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/account/login');
        }
    }
});
