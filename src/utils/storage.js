// Gestion du localStorage pour le mode invité

export const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Clés de stockage
export const STORAGE_KEYS = {
  USER_SURVEY: 'posturai_userSurvey',
  SESSION_HISTORY: 'posturai_sessionHistory',
  BADGES: 'posturai_badges',
  USER_PROFILE: 'posturai_userProfile'
}

