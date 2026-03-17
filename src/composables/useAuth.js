import { ref, computed } from 'vue';
import keycloakService from '@/services/keycloak.js';
import userService from '@/services/userService.js';
import router from '@/router/index.js';

// --- SINGLETON STATE ---
const isAuthenticated = ref(false);
const user = ref(null);
const isLoading = ref(true);

const initAuth = async () => {
  let timeoutId;
  isLoading.value = true;
  try {
    let timeoutReached = false;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        timeoutReached = true;
        reject(new Error('Keycloak: таймаут инициализации (10 секунд)'));
      }, 10000);
    });
    const authenticated = await Promise.race([
      keycloakService.init(),
      timeoutPromise
    ]);
    if (!timeoutReached) clearTimeout(timeoutId);
    isAuthenticated.value = authenticated;
    if (authenticated) {
      user.value = keycloakService.getUserInfo();
      window.addEventListener('keycloak-auth-success', async () => {
        console.log('🎉 useAuth: Keycloak auth-success event received');
        await updateAuthState();
      });
      window.addEventListener('keycloak-auth-logout', () => {
        isAuthenticated.value = false;
        user.value = null;
        // Всегда перенаправляем на главную страницу после логаута
        console.log('🔄 useAuth: Redirecting to home after Keycloak logout event');
        console.log('Current path:', router.currentRoute.value.path);
        
        // Принудительное перенаправление на главную
        setTimeout(() => {
          if (router.currentRoute.value.path !== '/') {
            console.log('🔄 useAuth: Force redirecting to home');
            router.replace('/');
          }
        }, 100);
      });
      isLoading.value = false;
      return;
    } else {
      isLoading.value = false;
      return;
    }
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    isLoading.value = false;
    return;
  }
};

const login = async (redirectPath = '/dashboard') => {
  try {
    console.log('🔐 useAuth: Starting login...');
    await keycloakService.login(redirectPath);
    console.log('✅ useAuth: Login completed');
    // После успешного логина отправляем токен на /user-service/login
    const token = keycloakService.getToken();
    if (token) {
      try {
        await userService.getCurrentUser(token);
        console.log('🔗 Token sent to /user-service/login after login');
      } catch (e) {
        console.error('❌ Error sending token to /user-service/login after login:', e);
      }
    }
    // Состояние будет обновлено через событие keycloak-auth-success
  } catch (error) {
    console.error('❌ useAuth: Ошибка входа:', error);
    throw error;
  }
};

const register = async (redirectPath = '/dashboard') => {
  try {
    console.log('📝 useAuth: Starting registration...');
    await keycloakService.register(redirectPath);
    console.log('✅ useAuth: Registration completed');
  } catch (error) {
    console.error('❌ useAuth: Ошибка регистрации:', error);
    throw error;
  }
};

const updateAuthState = async () => {
  try {
    console.log('🔄 useAuth: Updating auth state after login...');
    const authenticated = keycloakService.isAuthenticated();
    console.log('📊 useAuth: Current auth state:', authenticated);
    
    const wasAuthenticated = isAuthenticated.value;
    isAuthenticated.value = authenticated;
    
    if (authenticated) {
      user.value = keycloakService.getUserInfo();
      console.log('👤 useAuth: Updated user info:', user.value);
      console.log('🔄 useAuth: Auth state change detected:', { wasAuthenticated, authenticated });
    } else {
      // Очищаем кэш токена если пользователь не аутентифицирован
      tokenCache = null;
      tokenCacheTime = 0;
    }
  } catch (error) {
    console.error('❌ useAuth: Error updating auth state:', error);
  }
};

const logout = async () => {
  try {
    console.log('🚪 useAuth: Starting logout...');
    await keycloakService.logout();
    isAuthenticated.value = false;
    user.value = null;
    
    // Очищаем кэш токена
    tokenCache = null;
    tokenCacheTime = 0;
    
    console.log('✅ useAuth: Logout completed');
  } catch (error) {
    console.error('❌ useAuth: Ошибка выхода:', error);
    throw error;
  }
};

const updateToken = async (minValidity = 30) => {
  try {
    return await keycloakService.updateToken(minValidity);
  } catch (error) {
    console.error('❌ useAuth: Ошибка обновления токена:', error);
    isAuthenticated.value = false;
    user.value = null;
    throw error;
  }
};

// Кэш для токена
let tokenCache = null;
let tokenCacheTime = 0;
const TOKEN_CACHE_DURATION = 5000; // 5 секунд

const getToken = async () => {
  try {
    const now = Date.now();
    
    if (tokenCache && (now - tokenCacheTime) < TOKEN_CACHE_DURATION) {
      console.log('🔑 useAuth: Using cached token');
      return tokenCache;
    }
    
    await updateToken(30);
    const token = keycloakService.getToken();
    
    // Кэшируем токен
    tokenCache = token;
    tokenCacheTime = now;
    
    // После обновления токена отправляем его на /user-service/login
    if (token) {
      try {
        await userService.getCurrentUser(token);
        console.log('🔗 Token sent to /user-service/login after token refresh');
      } catch (e) {
        console.error('❌ Error sending token to /user-service/login after token refresh:', e);
      }
    }
    console.log('🔑 useAuth: Token refreshed and cached');
    return token;
  } catch (error) {
    console.error('❌ useAuth: Ошибка получения токена:', error);
    // Очищаем кэш при ошибке
    tokenCache = null;
    tokenCacheTime = 0;
    return null;
  }
};

const username = computed(() => {
  return user.value?.preferred_username || user.value?.name || '';
});

const userEmail = computed(() => {
  return user.value?.email || '';
});

const isAdmin = computed(() => keycloakService.hasRole('admin'));
const isOwner = computed(() => keycloakService.hasRole('owner'));
const isMember = computed(() => keycloakService.hasRole('member'));
const isWarehouseManager = computed(() => keycloakService.hasRole('warehouse_manager'));

export function useAuth() {
  return {
    isAuthenticated,
    user,
    isLoading,
    username,
    userEmail,
    initAuth,
    login,
    register,
    logout,
    updateToken,
    getToken,
    updateAuthState,
    isAdmin,
    isOwner,
    isMember,
    isWarehouseManager
  };
} 