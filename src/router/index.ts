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
    const authStore = useAuthStore();

    //if (authRequired && !authStore.user) {
    if (authRequired && !localStorage.getItem('user')) {
        authStore.returnUrl = to.fullPath;
        return '/account/login';
    }
});
