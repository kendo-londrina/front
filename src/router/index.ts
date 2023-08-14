import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore, useAlertStore } from '@/stores';
import { Home } from '@/views';
import accountRoutes from './account.routes';
import alunosRoutes from './alunos.routes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: Home },
        { ...accountRoutes },
        { ...alunosRoutes },
        { path: '/:pathMatch(.*)*', redirect: '/' } // catch all redirect to home page
    ]
});

router.beforeEach(async (to) => {
    // clear alert on route change
    const alertStore = useAlertStore();
    alertStore.clear();

    // redirect to login page if not logged in and trying to access a restricted page 
    const publicPages = ['/account/login', '/account/register'];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();

    if (authRequired && !authStore.user) {
        authStore.returnUrl = to.fullPath;
        return '/account/login';
    }
});

// import { createRouter, createWebHistory } from 'vue-router'

// import Home from '../views/Home.vue'
// import About from '../views/About.vue'
// import Login from '../views/Login.vue'

// const routes = [
//     {path: '/', name: 'Home', component: Home},
//     {path: '/about', name: 'About', component: About},
//     {path: '/login', name: 'Login', component: Login},
// ]

// const router = createRouter({
//     history: createWebHistory(),
//     routes
// })
// export default router