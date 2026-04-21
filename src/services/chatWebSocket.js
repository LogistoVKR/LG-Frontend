import { useAuth } from '@/composables/useAuth.js';

class ChatWebSocketService {
  constructor() {
    this.ws = null;
    this.mode = null; // 'anonymous' | 'employee'
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectTimer = null;
    this.connectionParams = null;
    this.isIntentionallyClosed = false;
    this.listeners = new Map();
  }

  _getWsBaseUrl() {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
    return apiBase.replace(/^http/, 'ws');
  }

  connectAnonymous({ organizationId, name, anonymousId }) {
    this.mode = 'anonymous';
    this.connectionParams = { organizationId, name, anonymousId };

    const params = new URLSearchParams({ organizationId });
    if (name) params.set('name', name);
    if (anonymousId) params.set('anonymousId', anonymousId);

    const url = `${this._getWsBaseUrl()}/user-service/ws/chat/anonymous?${params}`;
    this._connect(url);
  }

  connectEmployee({ token, organizationId }) {
    this.mode = 'employee';
    this.connectionParams = { token, organizationId };

    const params = new URLSearchParams({ token, organizationId });
    const url = `${this._getWsBaseUrl()}/user-service/ws/chat/employee?${params}`;
    this._connect(url);
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    this._clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.mode = null;
    this.connectionParams = null;
    this.reconnectAttempts = 0;
    this._emit('_disconnected');
  }

  send(payload) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[ChatWS] Cannot send, WebSocket not open');
      return false;
    }
    this.ws.send(JSON.stringify(payload));
    return true;
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);
  }

  off(eventType, callback) {
    const set = this.listeners.get(eventType);
    if (set) {
      set.delete(callback);
      if (set.size === 0) this.listeners.delete(eventType);
    }
  }

  _emit(eventType, data) {
    const set = this.listeners.get(eventType);
    if (set) {
      set.forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[ChatWS] Error in listener for ${eventType}:`, err);
        }
      });
    }
  }

  _getAuth() {
    return useAuth();
  }

  _connect(url) {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isIntentionallyClosed = false;
    this._emit('_connecting');

    try {
      this.ws = new WebSocket(url);
    } catch (err) {
      console.error('[ChatWS] Failed to create WebSocket:', err);
      this._scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      console.log('[ChatWS] Connected');
      this.reconnectAttempts = 0;
      this._emit('_connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type) {
          this._emit(msg.type, msg);
        }
      } catch (err) {
        console.error('[ChatWS] Failed to parse message:', err);
      }
    };

    this.ws.onclose = (event) => {
      console.log('[ChatWS] Closed:', event.code, event.reason);
      this.ws = null;
      if (!this.isIntentionallyClosed) {
        this._emit('_reconnecting');
        this._scheduleReconnect();
      }
    };

    this.ws.onerror = (event) => {
      console.error('[ChatWS] Error:', event);
    };
  }

  _clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  _scheduleReconnect() {
    this._clearReconnectTimer();

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[ChatWS] Max reconnect attempts reached');
      this._emit('_reconnect_failed');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      + Math.random() * 1000;
    this.reconnectAttempts++;

    console.log(`[ChatWS] Reconnecting in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this._handleReconnect();
    }, delay);
  }

  async _handleReconnect() {
    if (this.isIntentionallyClosed || !this.connectionParams) return;

    if (this.mode === 'employee') {
      try {
        const { getToken } = this._getAuth();
        const freshToken = await getToken();
        if (freshToken) {
          this.connectionParams.token = freshToken;
        } else {
          console.warn('[ChatWS] Could not refresh token for reconnect');
          this._emit('_reconnect_failed');
          return;
        }
      } catch (err) {
        console.error('[ChatWS] Token refresh failed during reconnect:', err);
        this._emit('_reconnect_failed');
        return;
      }
      this.connectEmployee(this.connectionParams);
    } else if (this.mode === 'anonymous') {
      this.connectAnonymous(this.connectionParams);
    }
  }
}

export default new ChatWebSocketService();
