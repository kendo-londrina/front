import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore, useAlertStore } from '@/stores';
import { Example, Home } from '@/views';
import accountRoutes from './account.routes';
import atletasRoutes from './atletas.routes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: Home },
        { path: '/example', component: Example },
        { ...accountRoutes },
        { ...atletasRoutes },
        { path: '/:pathMatch(.*)*', redirect: '/' } // catch all redirect to home page
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
