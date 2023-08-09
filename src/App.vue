<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { Nav, Alert } from '@/components';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
  <div class="app-container" :class="authStore.user && 'bg-light'">
      <Nav>
      </Nav>
      <Alert/>
      <div class="container pt-4 pb-4">
          <router-view />
      </div>
  </div>
</template>

<style>
@import '@/assets/base.css';
</style>

<!--

  <template>
  <router-link to="/">Home</router-link>
  |
  <router-link to="/about">About</router-link>
  |
  <router-link to="/login">Login</router-link>

  <router-view></router-view>
  <div>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Portal do Kendo-Londrina" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

-->
