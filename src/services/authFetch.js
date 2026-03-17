import { useAuth } from '@/composables/useAuth.js';
import router from '@/router/index.js';

/**
 * Обёртка над fetch с автоматическим обновлением токена и редиректом на главную при невозможности рефреша.
 * @param {string} url
 * @param {object} options
 * @returns {Promise<Response>}
 */
export async function authFetch(url, options = {}) {
  const { getToken, updateToken, logout } = useAuth();
  let token = await getToken();
  if (!options.headers) options.headers = {};
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Пытаемся обновить токен
    try {
      await updateToken();
      token = await getToken();
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
        response = await fetch(url, options);
      } else {
        throw new Error('No token after refresh');
      }
    } catch (e) {
      // Не удалось обновить токен — сбрасываем профиль и редиректим на главную
      await logout();
      router.push('/');
      throw new Error('Session expired. Redirected to home.');
    }
  }

  return response;
} 