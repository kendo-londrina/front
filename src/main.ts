import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './style.css'

import App from './App.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Login from './views/Login.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', name: 'Home', component: Home},
        {path: '/about', name: 'About', component: About},
        {path: '/login', name: 'Login', component: Login},
    ],
})

createApp(App)
    .use(router)
    .mount('#app')
