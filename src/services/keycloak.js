import Keycloak from 'keycloak-js';

class KeycloakService {
  constructor() {
    this.keycloak = null;
    this.isInitialized = false;
    this.appOrigin = import.meta.env.VITE_APP_ORIGIN;
  }

  async init() {
    try {
      console.log('KeycloakService: Starting initialization...');
      this.keycloak = new Keycloak({
        url: import.meta.env.VITE_KEYCLOAK_URL,
        realm: 'logisto',
        clientId: 'lg-web'
      });

      console.log('KeycloakService: Keycloak instance created');
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: this.appOrigin + '/silent-check-sso.html',
        pkceMethod: 'S256'
      });

      this.keycloak.onTokenExpired = () => {
        console.log('KeycloakService: Token expired, refreshing...');
        this.keycloak.updateToken(70);
      };

      this.keycloak.onAuthSuccess = () => {
        console.log('KeycloakService: Auth success event triggered');
        // Генерируем событие для обновления состояния приложения
        window.dispatchEvent(new CustomEvent('keycloak-auth-success'));
      };

      this.keycloak.onAuthLogout = () => {
        console.log('KeycloakService: Auth logout event triggered');
        // Генерируем событие для обновления состояния приложения
        window.dispatchEvent(new CustomEvent('keycloak-auth-logout'));
      };

      console.log('KeycloakService: Init completed, authenticated:', authenticated);
      this.isInitialized = true;
      return authenticated;
    } catch (error) {
      console.error('KeycloakService: Ошибка инициализации Keycloak:', error);
      return false;
    }
  }

  async login(redirectPath = '/dashboard') {
    if (!this.keycloak) {
      throw new Error('Keycloak не инициализирован');
    }
    console.log('KeycloakService: Starting login...');
    const path = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
    await this.keycloak.login({ redirectUri: this.appOrigin + path });
    console.log('KeycloakService: Login completed');
  }

  async register(redirectPath = '/dashboard') {
    if (!this.keycloak) {
      throw new Error('Keycloak не инициализирован');
    }
    console.log('KeycloakService: Starting registration...');
    const path = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
    await this.keycloak.register({ redirectUri: this.appOrigin + path });
    console.log('KeycloakService: Registration completed');
  }

  async logout() {
    if (!this.keycloak) {
      throw new Error('Keycloak не инициализирован');
    }
    console.log('KeycloakService: Starting logout...');
    await this.keycloak.logout({ redirectUri: this.appOrigin + '/' });
    console.log('KeycloakService: Logout completed');
  }

  async updateToken(minValidity = 30) {
    if (!this.keycloak) {
      throw new Error('Keycloak не инициализирован');
    }
    return await this.keycloak.updateToken(minValidity);
  }

  getToken() {
    if (!this.keycloak) {
      return null;
    }
    return this.keycloak.token;
  }

  getRefreshToken() {
    if (!this.keycloak) {
      return null;
    }
    return this.keycloak.refreshToken;
  }

  isAuthenticated() {
    if (!this.keycloak) {
      return false;
    }
    const result = !!this.keycloak.authenticated;
    console.log('KeycloakService: isAuthenticated check:', result);
    return result;
  }

  getUserInfo() {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return null;
    }
    return this.keycloak.tokenParsed;
  }

  getUsername() {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.preferred_username : null;
  }

  hasRole(role) {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return false;
    }
    return this.keycloak.hasRealmRole(role) || this.keycloak.hasResourceRole(role);
  }

  getRoles() {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return [];
    }
    return this.keycloak.realmAccess?.roles || [];
  }
}

export default new KeycloakService(); 