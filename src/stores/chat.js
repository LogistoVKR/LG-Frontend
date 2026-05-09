import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import chatWebSocket from '@/services/chatWebSocket.js';
import { useAuth } from '@/composables/useAuth.js';
import { useOrganizationsStore } from '@/stores/organizations.js';

function safeDecodeURI(str) {
  if (!str) return str;
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch {
    return str;
  }
}

export const useChatStore = defineStore('chat', () => {

  const connectionStatus = ref('disconnected');
  const mode = ref(null);


  const anonymousId = ref(localStorage.getItem('logisto_chat_anonymousId') || null);
  const anonymousChatSessionId = ref(null);
  const anonymousMessages = ref([]);
  const anonymousChatOpen = ref(false);
  const anonymousOrgId = ref(null);
  const anonymousOrgName = ref(null);
  const anonymousUserName = ref(localStorage.getItem('logisto_chat_userName') || null);
  const anonymousChatClosed = ref(false);


  const chats = ref([]);
  const activeChatId = ref(null);
  const activeChatMessages = ref([]);
  const activeChatClosed = ref(false);
  const unreadCounts = ref({});
  const isChatPageVisible = ref(false);
  const chatError = ref(null);

  const totalUnread = computed(() => {
    return Object.values(unreadCounts.value).reduce((sum, n) => sum + n, 0);
  });


  let listenersRegistered = false;

  function _registerListeners() {
    if (listenersRegistered) return;
    listenersRegistered = true;

    chatWebSocket.on('_connecting', () => {
      connectionStatus.value = 'connecting';
    });
    chatWebSocket.on('_connected', () => {
      const wasReconnecting = connectionStatus.value === 'reconnecting' || connectionStatus.value === 'failed';
      connectionStatus.value = 'connected';


      if (wasReconnecting) {
        if (mode.value === 'employee') {

          chatWebSocket.send({ type: 'LIST_CHATS' });

          if (activeChatId.value) {
            chatWebSocket.send({ type: 'LOAD_HISTORY', chatSessionId: activeChatId.value });
          }
        } else if (mode.value === 'anonymous' && anonymousChatSessionId.value) {
          chatWebSocket.send({ type: 'LOAD_HISTORY', chatSessionId: anonymousChatSessionId.value });
        }
      }
    });
    chatWebSocket.on('_disconnected', () => {
      connectionStatus.value = 'disconnected';
    });
    chatWebSocket.on('_reconnecting', () => {
      connectionStatus.value = 'reconnecting';
    });
    chatWebSocket.on('_reconnect_failed', () => {
      connectionStatus.value = 'failed';
    });

    chatWebSocket.on('CHAT_CREATED', _onChatCreated);
    chatWebSocket.on('NEW_MESSAGE', _onNewMessage);
    chatWebSocket.on('CHAT_CLOSED', _onChatClosed);
    chatWebSocket.on('CHAT_LIST', _onChatList);
    chatWebSocket.on('CHAT_HISTORY', _onChatHistory);
    chatWebSocket.on('ERROR', _onError);
  }


  function openAnonymousChat(organizationId, orgName) {
    anonymousOrgId.value = organizationId;
    anonymousOrgName.value = orgName || 'Организация';
    anonymousChatOpen.value = true;
    anonymousChatClosed.value = false;
    anonymousMessages.value = [];
    anonymousChatSessionId.value = null;
    chatError.value = null;
  }

  function connectAnonymousChat(userName) {
    if (!anonymousOrgId.value) return;


    if (!anonymousId.value) {
      anonymousId.value = crypto.randomUUID();
      localStorage.setItem('logisto_chat_anonymousId', anonymousId.value);
    }


    anonymousUserName.value = userName || null;
    if (userName) {
      localStorage.setItem('logisto_chat_userName', userName);
    }

    mode.value = 'anonymous';
    _registerListeners();

    chatWebSocket.connectAnonymous({
      organizationId: anonymousOrgId.value,
      name: userName || undefined,
      anonymousId: anonymousId.value,
    });
  }

  function sendAnonymousMessage(content) {
    if (!content.trim()) return;
    const sent = chatWebSocket.send({ type: 'SEND_MESSAGE', content });
    if (sent) {

      anonymousMessages.value.push({
        content,
        senderName: anonymousUserName.value || 'Вы',
        isOwn: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  function closeAnonymousChat() {
    chatWebSocket.send({ type: 'CLOSE_CHAT' });
  }

  function disconnectAnonymous() {
    chatWebSocket.disconnect();
    anonymousChatOpen.value = false;
    anonymousMessages.value = [];
    anonymousChatSessionId.value = null;
    anonymousOrgId.value = null;
    anonymousOrgName.value = null;
    anonymousChatClosed.value = false;
    mode.value = null;
    chatError.value = null;
  }


  async function initEmployeeConnection() {
    const { getToken } = useAuth();
    const organizationsStore = useOrganizationsStore();
    const orgId = organizationsStore.selectedOrganizationId;

    if (!orgId) return;

    const token = await getToken();
    if (!token) return;

    mode.value = 'employee';
    _registerListeners();

    chatWebSocket.connectEmployee({ token, organizationId: orgId });
  }

  function selectChat(chatId) {
    activeChatId.value = chatId;
    activeChatMessages.value = [];
    activeChatClosed.value = false;
    chatError.value = null;


    if (unreadCounts.value[chatId]) {
      unreadCounts.value[chatId] = 0;
    }


    chatWebSocket.send({ type: 'LOAD_HISTORY', chatSessionId: chatId });
  }

  function sendEmployeeMessage(content) {
    if (!content.trim() || !activeChatId.value) return;

    chatWebSocket.send({
      type: 'SEND_MESSAGE',
      chatSessionId: activeChatId.value,
      content,
    });
  }

  function closeChatSession(chatId) {
    chatWebSocket.send({ type: 'CLOSE_CHAT', chatSessionId: chatId });
  }

  function disconnectEmployee() {
    chatWebSocket.disconnect();
    chats.value = [];
    activeChatId.value = null;
    activeChatMessages.value = [];
    activeChatClosed.value = false;
    unreadCounts.value = {};
    mode.value = null;
    chatError.value = null;
  }

  function setChatPageVisible(visible) {
    isChatPageVisible.value = visible;
  }

  function manualReconnect() {
    if (mode.value === 'employee') {
      initEmployeeConnection();
    } else if (mode.value === 'anonymous') {
      connectAnonymousChat(anonymousUserName.value);
    }
  }


  function _onChatCreated(msg) {
    if (mode.value === 'anonymous') {
      anonymousChatSessionId.value = msg.chatSessionId;
    } else if (mode.value === 'employee') {

      const exists = chats.value.find(c => c.id === msg.chatSessionId);
      if (!exists) {
        const data = msg.data || {};
        chats.value.unshift({
          id: msg.chatSessionId,
          anonymousId: data.anonymousId || null,
          anonymousName: safeDecodeURI(data.anonymousName) || null,
          status: data.status || 'ACTIVE',
          created: data.created || new Date().toISOString(),
          lastMessage: data.lastMessage || null,
          lastMessageTime: data.lastMessageTime || null,
        });
      }
    }
  }

  function _onNewMessage(msg) {
    if (mode.value === 'anonymous') {

      anonymousMessages.value.push({
        content: msg.content,
        senderName: safeDecodeURI(msg.senderName),
        isOwn: false,
        timestamp: new Date().toISOString(),
      });
    } else if (mode.value === 'employee') {
      const chatId = msg.chatSessionId;


      const chat = chats.value.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = msg.content;
        chat.lastMessageTime = new Date().toISOString();
      }

      if (chatId === activeChatId.value && isChatPageVisible.value) {

        activeChatMessages.value.push({
          content: msg.content,
          senderName: safeDecodeURI(msg.senderName),
          senderType: null,
          isOwn: false,
          timestamp: new Date().toISOString(),
        });
      } else {

        unreadCounts.value[chatId] = (unreadCounts.value[chatId] || 0) + 1;
      }
    }
  }

  function _onChatClosed(msg) {
    if (mode.value === 'anonymous') {
      anonymousChatClosed.value = true;
    } else if (mode.value === 'employee') {

      chats.value = chats.value.filter(c => c.id !== msg.chatSessionId);
      delete unreadCounts.value[msg.chatSessionId];

      if (activeChatId.value === msg.chatSessionId) {
        activeChatClosed.value = true;
        activeChatId.value = null;
        activeChatMessages.value = [];
      }
    }
  }

  function _onChatList(msg) {
    chats.value = (msg.data || []).map(chat => ({
      id: chat.id,
      anonymousId: chat.anonymousId,
      anonymousName: safeDecodeURI(chat.anonymousName),
      status: chat.status,
      created: chat.created,
      lastMessage: chat.lastMessage,
      lastMessageTime: chat.lastMessageTime,
    }));
  }

  function _onChatHistory(msg) {
    if (mode.value === 'anonymous') {
      anonymousMessages.value = (msg.data || []).map(m => ({
        id: m.id,
        content: m.content,
        senderName: safeDecodeURI(m.senderName) || null,
        senderType: m.senderType,
        isOwn: m.senderType === 'ANONYMOUS',
        timestamp: m.created,
      }));
    } else if (mode.value === 'employee') {
      activeChatMessages.value = (msg.data || []).map(m => ({
        id: m.id,
        content: m.content,
        senderName: safeDecodeURI(m.senderName) || null,
        senderType: m.senderType,
        isOwn: m.senderType === 'EMPLOYEE',
        timestamp: m.created,
      }));
    }
  }

  function _onError(msg) {
    console.error('[ChatStore] Server error:', msg.content);
    chatError.value = msg.content;
  }


  const organizationsStore = useOrganizationsStore();
  let previousOrgId = organizationsStore.selectedOrganizationId;

  watch(
    () => organizationsStore.selectedOrganizationId,
    (newOrgId) => {
      if (mode.value === 'employee' && newOrgId && newOrgId !== previousOrgId) {
        previousOrgId = newOrgId;
        disconnectEmployee();
        initEmployeeConnection();
      }
      previousOrgId = newOrgId;
    }
  );

  return {

    connectionStatus,
    mode,


    anonymousId,
    anonymousChatSessionId,
    anonymousMessages,
    anonymousChatOpen,
    anonymousOrgId,
    anonymousOrgName,
    anonymousUserName,
    anonymousChatClosed,


    chats,
    activeChatId,
    activeChatMessages,
    activeChatClosed,
    unreadCounts,
    totalUnread,
    isChatPageVisible,
    chatError,


    openAnonymousChat,
    connectAnonymousChat,
    sendAnonymousMessage,
    closeAnonymousChat,
    disconnectAnonymous,


    initEmployeeConnection,
    selectChat,
    sendEmployeeMessage,
    closeChatSession,
    disconnectEmployee,
    setChatPageVisible,


    manualReconnect,
  };
});
