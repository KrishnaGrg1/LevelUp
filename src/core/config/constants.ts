/**
 * Application Constants
 *
 * Centralized configuration values used throughout the application.
 * Prefer using these constants over hardcoded values for maintainability.
 *
 * @module core/config/constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  SESSION_COOKIE_NAME: 'auth_session',
  TOKEN_STORAGE_KEY: 'auth_token',
  USER_STORAGE_KEY: 'auth-storage',
  REFRESH_TOKEN_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  INFINITE_STALE_TIME: Infinity,
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  FEATURES: '/features',
  PRICING: '/pricing',
  CONTACT: '/contact',

  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY: '/verify-email',
  FORGOT_PASSWORD: '/forget-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  LANGUAGE: 'language-storage',
  THEME: 'theme',
  AUTH: 'auth-storage',
  PAGINATION: 'user-pagination-storage',
  SIDEBAR_STATE: 'sidebar-collapsed',
} as const;

/**
 * Supported Languages
 */
export const LANGUAGES = {
  ENGLISH: 'eng',
  NEPALI: 'nep',
  FRENCH: 'fr',
  ARABIC: 'arab',
  CHINESE: 'chin',
  SPANISH: 'span',
  JAPANESE: 'jap',
} as const;

export const LANGUAGE_OPTIONS = [
  { value: LANGUAGES.ENGLISH, label: 'English', flag: '🇬🇧' },
  { value: LANGUAGES.NEPALI, label: 'नेपाली', flag: '🇳🇵' },
  { value: LANGUAGES.FRENCH, label: 'Français', flag: '🇫🇷' },
  { value: LANGUAGES.ARABIC, label: 'العربية', flag: '🇸🇦' },
  { value: LANGUAGES.CHINESE, label: '中文', flag: '🇨🇳' },
  { value: LANGUAGES.SPANISH, label: 'Español', flag: '🇪🇸' },
  { value: LANGUAGES.JAPANESE, label: '日本語', flag: '🇯🇵' },
] as const;

/**
 * Toast/Notification Configuration
 */
export const TOAST_CONFIG = {
  DURATION: 5000, // 5 seconds
  POSITION: 'bottom-right',
  MAX_TOASTS: 3,
} as const;

/**
 * Feature Flags
 * Enable/disable features based on environment
 */
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_DEVTOOLS: process.env.NODE_ENV === 'development',
  ENABLE_OAUTH: process.env.NEXT_PUBLIC_ENABLE_OAUTH === 'true',
  ENABLE_COMMUNITIES: true,
  ENABLE_QUESTS: true,
} as const;

/**
 * Environment
 */
export const ENV = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
  IS_CLIENT: typeof window !== 'undefined',
  IS_SERVER: typeof window === 'undefined',
} as const;

/**
 * UI Constants
 */
export const UI = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  ANIMATION_DURATION: 200, // milliseconds
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_DELAY: 1000, // milliseconds
} as const;

/**
 * File Upload Configuration
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;
