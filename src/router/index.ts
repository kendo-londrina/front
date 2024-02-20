import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore, useAlertStore } from '@/stores';
import accountRoutes from '@/router/account.routes';
import atletasRoutes from '@/router/atletas.routes';
import familiasRoutes from '@/router/familias.routes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: () => import('@/views/Home.vue') },
        { path: '/example', component: () => import('@/views/Example.vue') },
        { ...accountRoutes },
        { ...atletasRoutes },
        { ...familiasRoutes },
        { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') } 
    ]
});

router.beforeEach(async (to) => {
    // clear alert on route change
    const alertStore = useAlertStore();
    alertStore.clear();

    // redirect to login page if not logged in and trying to access a restricted page 
    const publicPages = ['/account/login', '/account/register', '/example'];
    const authRequired = !publicPages.includes(to.path);

    if (authRequired) {
        if (!localStorage.getItem('user')) {
            const authStore = useAuthStore();
            authStore.returnUrl = to.fullPath;
            return '/account/login';
        }
        const user = JSON.parse(localStorage.getItem('user')!);
        console.log(user.accessToken);
        const payloadData = parseJwt(user.accessToken);
        if (payloadData.exp < Date.now()/1000) {
            const authStore = useAuthStore();
            try {
                await authStore.refreshToken(user.accessToken, user.refreshToken)
                router.push({ path: to.path });
            } catch (error) {
                console.log(error);
            }            
        }
    }

});

function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
