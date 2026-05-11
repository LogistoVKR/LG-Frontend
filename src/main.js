import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from "@/router/index.js";
import { useAuth } from '@/composables/useAuth.js';

const app = createApp(App);
const pinia = createPinia();


app.use(pinia).use(router).mount('#app');
console.log('🚀 App: App mounted immediately - no waiting for Keycloak!');


const { initAuth, updateAuthState, isAuthenticated } = useAuth();

initAuth().then(async () => {
  console.log('✅ App: Keycloak initialized in background');

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('code') || urlParams.has('session_state')) {
    console.log('🔄 App: Detected return from Keycloak, updating auth state...');


    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    await updateAuthState();

    console.log('🔄 App: Auth state updated after Keycloak return');
  }
}).catch((error) => {
  console.error('⚠️ App: Keycloak initialization failed (app continues working):', error);

});
