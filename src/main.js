import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from "@/router/index.js";
import { useAuth } from '@/composables/useAuth.js';

const app = createApp(App);
const pinia = createPinia();

// СНАЧАЛА монтируем приложение - оно будет доступно сразу
app.use(pinia).use(router).mount('#app');
console.log('🚀 App: App mounted immediately - no waiting for Keycloak!');

// ПОТОМ инициализируем Keycloak в фоне (неблокирующе)
const { initAuth, updateAuthState, isAuthenticated } = useAuth();

initAuth().then(async () => {
  console.log('✅ App: Keycloak initialized in background');
  
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('code') || urlParams.has('session_state')) {
    console.log('🔄 App: Detected return from Keycloak, updating auth state...');
    
    // Очищаем URL от параметров Keycloak
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    await updateAuthState();
    
    console.log('🔄 App: Auth state updated after Keycloak return');
  }
}).catch((error) => {
  console.error('⚠️ App: Keycloak initialization failed (app continues working):', error);
  // Приложение уже работает, ошибка Keycloak не критична
});
