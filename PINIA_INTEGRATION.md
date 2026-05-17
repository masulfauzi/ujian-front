# Pinia State Management Integration

## Overview
Pinia sudah diintegrasikan ke dalam project untuk centralized state management, khususnya untuk authentication state.

## Status: ✅ IMPLEMENTED

---

## 📁 Project Structure

```
src/
├── stores/
│   ├── index.js                    # Export all stores
│   └── auth.js                     # Authentication store
├── services/
│   ├── api.js                      # Axios instance
│   ├── token.js                    # Token utilities
│   └── authService.js              # Auth API functions
└── modules/
    └── auth/
        └── views/
            ├── Login.vue           # Uses authStore
            └── Register.vue        # Uses authStore
```

---

## 🏪 Auth Store Overview

**File:** `src/stores/auth.js`

### State
```typescript
{
  token: string | null         // JWT token from backend
  user: object | null          // Decoded user data from token
  isLoading: boolean           // API request loading state
  error: string | null         // Error message from last request
}
```

### Getters
```typescript
isAuthenticated: boolean       // true if user has valid token
currentUser: object | null     // Current user object
authToken: string | null       // Current JWT token
```

### Actions

#### `applyToken(token: string)`
Store and decode JWT token from successful login/register.

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
authStore.applyToken(token)

// Now available:
// authStore.token      → JWT token
// authStore.user       → Decoded user data
// authStore.isAuthenticated → true
```

#### `async register(payload: object)`
Register new user.

```javascript
const authStore = useAuthStore()

try {
  const response = await authStore.register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
  // Token automatically stored
  // Redirect after this
} catch (error) {
  // authStore.error contains error message
  console.log(authStore.error)
}
```

#### `async login(credentials: object)`
Login user.

```javascript
const authStore = useAuthStore()

try {
  await authStore.login({
    email: 'john@example.com',
    password: 'password123'
  })
  // Token automatically stored
  // Redirect after this
} catch (error) {
  // authStore.error contains error message
  console.log(authStore.error)
}
```

#### `logout()`
Clear authentication state.

```javascript
const authStore = useAuthStore()
authStore.logout()

// Now:
// authStore.token → null
// authStore.user → null
// authStore.isAuthenticated → false
```

#### `clearError()`
Clear error message.

```javascript
const authStore = useAuthStore()
authStore.clearError()
```

---

## 📝 Usage Examples

### Example 1: Check if User is Authenticated

```vue
<template>
  <div v-if="authStore.isAuthenticated">
    <p>Welcome, {{ authStore.currentUser.name }}!</p>
    <button @click="handleLogout">Logout</button>
  </div>
  <div v-else>
    <router-link to="/login">Login</router-link>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
```

### Example 2: User Profile Component

```vue
<template>
  <div v-if="authStore.isAuthenticated" class="profile">
    <h2>{{ authStore.currentUser.name }}</h2>
    <p>Email: {{ authStore.currentUser.email }}</p>
    <p>Role: {{ authStore.currentUser.role }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
```

### Example 3: Loading State in Component

```vue
<template>
  <div>
    <button 
      @click="handleSomeAction"
      :disabled="authStore.isLoading"
      class="btn-primary"
    >
      <span v-if="authStore.isLoading" class="spinner"></span>
      <span v-else>Click Me</span>
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleSomeAction = async () => {
  // authStore.isLoading akan otomatis set to true
  // saat ada async action yang running
}
</script>
```

### Example 4: Handle Auth Errors

```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await authStore.login({
      email: 'user@example.com',
      password: 'password'
    })
    router.push('/dashboard')
  } catch (error) {
    // authStore.error sudah di-set dengan error message
    console.log(authStore.error)
  }
}
</script>
```

---

## 🔐 Route Guards (Optional)

Gunakan auth store untuk protect routes:

```javascript
// src/router/guards.js
import { useAuthStore } from '@/stores/auth'

export function setupAuthGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    const publicRoutes = ['/login', '/register']
    const isPublic = publicRoutes.includes(to.path)

    if (!isPublic && !authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next('/login')
    } else if (isPublic && authStore.isAuthenticated) {
      // Redirect to dashboard if already authenticated
      next('/dashboard')
    } else {
      next()
    }
  })
}
```

**Setup di main.js:**
```javascript
import { setupAuthGuards } from './router/guards'

// ... setelah router setup
setupAuthGuards(router)
```

---

## 💾 Token Persistence

Token automatically persisted to localStorage via `setToken()` function:

- **Key:** `ujian_token`
- **Value:** JWT token from server
- **Persistence:** Automatic (via authService and token.js)

**On App Load:**
- Auth store reads token dari localStorage
- Decodes token untuk extract user data
- Sets `authStore.isAuthenticated` accordingly

---

## 🔄 Current Integration

### Login Flow
1. User fills login form
2. Click "Login" button
3. `handleLogin()` calls `authStore.login()`
4. Store makes API request
5. On success: token stored + user data decoded
6. Component redirects to dashboard

### Register Flow
1. User fills register form
2. Click "Create Account" button
3. `handleRegister()` calls `authStore.register()`
4. Store makes API request
5. On success: token stored + user data decoded
6. Component shows success message
7. Component redirects to login after 2 seconds

### Logout Flow
1. User clicks logout button (wherever implemented)
2. Call `authStore.logout()`
3. Token cleared from store and localStorage
4. User data cleared
5. Redirect to login page

---

## 📊 State Diagram

```
┌─────────────────────────────────────┐
│         Auth Store State            │
├─────────────────────────────────────┤
│                                     │
│  Before Login:                      │
│  ├─ token: null                     │
│  ├─ user: null                      │
│  ├─ isLoading: false                │
│  ├─ error: null                     │
│  └─ isAuthenticated: false          │
│                                     │
│  During Login:                      │
│  ├─ isLoading: true                 │
│  └─ error: null                     │
│                                     │
│  After Login Success:               │
│  ├─ token: "eyJ..."                 │
│  ├─ user: { id, name, email, ... } │
│  ├─ isLoading: false                │
│  ├─ error: null                     │
│  └─ isAuthenticated: true           │
│                                     │
│  After Login Error:                 │
│  ├─ token: null                     │
│  ├─ user: null                      │
│  ├─ isLoading: false                │
│  ├─ error: "Invalid credentials"    │
│  └─ isAuthenticated: false          │
│                                     │
└─────────────────────────────────────┘
```

---

## 🛠️ Creating Additional Stores

To create new stores (e.g., for dashboard data):

**File:** `src/stores/dashboard.js`

```javascript
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    hasStats: (state) => !!state.stats,
  },

  actions: {
    async fetchStats() {
      this.isLoading = true
      try {
        const response = await api.get('/api/stats')
        this.stats = response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
```

**Export di `src/stores/index.js`:**
```javascript
export { useAuthStore } from './auth'
export { useDashboardStore } from './dashboard'
```

**Use in component:**
```vue
<script setup>
import { useDashboardStore } from '@/stores'

const dashboardStore = useDashboardStore()
await dashboardStore.fetchStats()
</script>
```

---

## 🎯 Benefits of Using Pinia

✅ **Centralized State:** All auth data in one place  
✅ **Reusable:** Use same state across components  
✅ **Type-Safe:** Easy to add TypeScript later  
✅ **DevTools:** Pinia DevTools for debugging  
✅ **Composition API:** Native Vue 3 support  
✅ **Performance:** Only components that use state re-render  

---

## 📚 Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Pinia with Composition API](https://pinia.vuejs.org/core-concepts/state.html)
- [JWT Token Guide](https://jwt.io/)

---

## ✨ Next Steps

1. ✅ Auth store implemented
2. ✅ Login/Register integrated with store
3. [ ] Add route guards for protected pages
4. [ ] Create additional stores for dashboard data
5. [ ] Add Pinia DevTools for debugging
6. [ ] Setup tests for store actions

---

**Last Updated:** 2026-05-17  
**Pinia Version:** 3.0.4  
**Vue Version:** 3.x
