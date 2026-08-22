export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  CONVERSATIONS: {
    BASE: '/conversations',
    GROUP: '/conversations/group',
    MESSAGES: (conversationId: string) => `/conversations/${conversationId}/messages`,
  },
  MESSAGES: {
    SEND: '/messages',
  },
  USERS: {
    SEARCH: (query: string) => `/users/search?q=${encodeURIComponent(query)}`,
  },
  SYSTEM: {
    HEALTH: '/health',
  },
} as const
