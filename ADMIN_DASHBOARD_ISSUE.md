# Issue: Implementasi Admin Dashboard

## Overview
Implementasi halaman dashboard khusus untuk admin dengan memisahkan tampilan user dashboard dan admin dashboard. Admin dashboard akan mengimplementasikan struktur dari `template/code.html` sambil mempertahankan sidebar dan header yang sudah ada.

## Acceptance Criteria
- [ ] Dashboard terpisah untuk user dan admin berdasarkan role
- [ ] Admin dashboard menampilkan stats management (Total Questions, Active Exams, Total Students, Average Grade)
- [ ] Admin dashboard menampilkan Recent Exam Submissions table
- [ ] Sidebar dan TopAppBar tetap digunakan untuk kedua dashboard
- [ ] Route protection untuk admin dashboard (hanya admin yang bisa akses)
- [ ] Navigation menu berubah sesuai role (user vs admin)
- [ ] UI responsif dan konsisten dengan design system

---

## 📋 Current State

### User Dashboard (Existing)
- **Location:** `src/modules/dashboard/views/DashboardHome.vue`
- **Features:**
  - Current Progress (Average Grade, Exams Passed)
  - Upcoming Exams
  - Exam Results
  - Study Progress
- **Role:** Student/User
- **Sidebar Menu:** Dashboard, Exam Schedule, Exam Results
- **Header:** Search, Notifications, User Profile

### Admin Dashboard (To Be Created)
- **Location:** `src/modules/dashboard/views/DashboardAdmin.vue` (NEW)
- **Template Reference:** `template/code.html`
- **Role:** Admin
- **Features (from template):**
  - Total Questions: 1,284 (+12 today)
  - Active Exams: 8 (3 ending soon)
  - Total Students: 452 (98% active)
  - Average Grade: 84.2 (+2.4% vs last term)
  - Recent Exam Submissions table
- **Sidebar Menu:** Dashboard, Bank Soal, Peserta Ujian, Jadwal Ujian, Nilai

---

## 🎯 Implementation Roadmap

### Phase 1: Setup & Route Configuration

#### Task 1.1: Add Admin Routes
**File:** `src/modules/dashboard/routes/index.js`

**Actions:**
1. Create new route for admin dashboard
2. Path: `/admin/dashboard`
3. Component: `DashboardAdmin.vue`
4. Meta: `{ requiresAuth: true, requiresAdmin: true }`

**Code Template:**
```javascript
{
  path: '/admin/dashboard',
  name: 'admin.dashboard',
  component: DashboardAdmin,
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

#### Task 1.2: Update Route Guards
**File:** `src/router/guards.js`

**Actions:**
1. Add admin route protection logic
2. Check if user is admin (from `authStore.currentUser.role === 'admin'`)
3. Redirect to `/dashboard` if not admin
4. Allow access to `/admin/*` routes only for admin

**Logic:**
```javascript
// In route guard beforeEach
if (to.path.startsWith('/admin')) {
  if (!authStore.isAuthenticated || authStore.currentUser.role !== 'admin') {
    next('/dashboard')  // Redirect to user dashboard
    return
  }
}
```

---

### Phase 2: Create Admin Dashboard Page

#### Task 2.1: Create Admin Dashboard Component
**File:** `src/modules/dashboard/views/DashboardAdmin.vue` (NEW)

**Structure:**
```vue
<template>
  <div class="bg-surface min-h-screen">
    <!-- Use existing Sidebar -->
    <SideBar />
    
    <!-- Use existing TopAppBar -->
    <TopAppBar />
    
    <!-- Admin Content -->
    <main class="ml-64 min-h-screen">
      <!-- Welcome Section -->
      <!-- Summary Stats Bento Grid (4 cards) -->
      <!-- Recent Exam Submissions Table -->
    </main>
  </div>
</template>

<script setup>
// Import stores, composables
</script>
```

**Components Needed:**
1. Import SideBar component
2. Import TopAppBar component
3. Use existing styling (Tailwind + design system)

---

### Phase 3: Implement Admin Dashboard Content

#### Task 3.1: Welcome Section
**Location:** Admin Dashboard template

**Content:**
```
Title: "Welcome back, {admin_name}!"
Subtitle: "Here's what's happening with your exams today."
Today's Date display
```

**Implementation:**
- Use `authStore.currentUser.name` for admin name
- Display current date dynamically
- Keep styling consistent with user dashboard

---

#### Task 3.2: Summary Stats Bento Grid
**Reference:** `template/code.html` lines 216-269

**Stats Cards (4 cards in 1 row):**

1. **Total Questions**
   - Icon: database
   - Value: 1,284
   - Trend: +12 today
   - Icon Color: primary-container (sky)

2. **Active Exams**
   - Icon: play_circle
   - Value: 8
   - Trend: 3 ending soon
   - Icon Color: on-secondary-container

3. **Total Students**
   - Icon: group
   - Value: 452
   - Trend: 98% active
   - Icon Color: primary-container (sky)

4. **Average Grade**
   - Icon: grade
   - Value: 84.2
   - Trend: +2.4% vs last term
   - Icon Color: on-secondary-container

**Card Design:**
- White background with border
- Icon at top (text-3xl size)
- Label (text-label-sm, slate-500)
- Big value (text-h3 size)
- Trend indicator (small badge with icon)
- Hover effect: background circle scaling
- Shadow: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`

**Data Binding:**
- Fetch stats from Pinia store or API
- Implement computed properties for each stat
- Update data structure in store if needed

---

#### Task 3.3: Recent Exam Submissions Table
**Reference:** `template/code.html` lines 273-305

**Table Structure:**
```
Columns:
1. Student (with avatar initials)
2. Exam Name
3. Time (submitted at)
4. Status (badge: completed, pending, failed)
```

**Sample Data:**
```javascript
[
  {
    student: "Ahmad Daryanto",
    initials: "AD",
    exam: "Biology Midterm",
    time: "2 min ago",
    status: "completed"
  },
  // More rows...
]
```

**Design Elements:**
- Header with title and "View All" button
- Striped rows with hover effect (bg-slate-50/50)
- Avatar circle with initials
- Status badge with different colors
- Scrollable if many rows

---

### Phase 4: Update Sidebar Navigation

#### Task 4.1: Dynamic Sidebar Menu
**File:** `src/components/SideBar.vue`

**Changes:**
1. Import `useAuthStore`
2. Check `authStore.currentUser.role`
3. Show different menu items based on role

**User Menu (current):**
- Dashboard
- Exam Schedule
- Exam Results

**Admin Menu (new):**
- Dashboard
- Bank Soal (Question Bank)
- Peserta Ujian (Exam Participants)
- Jadwal Ujian (Exam Schedule)
- Nilai (Grades)

**Code Structure:**
```vue
<nav class="space-y-1">
  <router-link to="/dashboard" v-if="!isAdmin">
    Dashboard
  </router-link>
  
  <router-link to="/admin/dashboard" v-if="isAdmin">
    Dashboard
  </router-link>
  
  <!-- Admin menu items only show if isAdmin -->
  <template v-if="isAdmin">
    <router-link to="/admin/bank-soal">Bank Soal</router-link>
    <router-link to="/admin/peserta">Peserta Ujian</router-link>
    <!-- etc -->
  </template>
  
  <!-- User menu items -->
  <template v-else>
    <router-link to="/dashboard">Dashboard</router-link>
    <!-- etc -->
  </template>
</nav>
```

#### Task 4.2: Update Header
**File:** `src/components/TopAppBar.vue`

**Changes:**
1. Update title based on role
2. Show different user info if admin
3. Keep same styling and functionality

**Title Logic:**
```javascript
const pageTitle = computed(() => {
  return isAdmin ? 'Exam Management' : 'Student Dashboard'
})
```

---

### Phase 5: Create Admin Store (Optional but Recommended)

#### Task 5.1: Admin Store for Stats
**File:** `src/stores/admin.js` (NEW - OPTIONAL)

**Purpose:**
- Centralize admin dashboard data
- Fetch stats from API
- Manage admin-specific state

**Structure:**
```javascript
export const useAdminStore = defineStore('admin', {
  state: () => ({
    stats: {
      totalQuestions: 0,
      activeExams: 0,
      totalStudents: 0,
      averageGrade: 0
    },
    recentSubmissions: [],
    isLoading: false
  }),

  actions: {
    async fetchStats() {
      // Call API to get stats
    },
    
    async fetchRecentSubmissions() {
      // Call API to get submissions
    }
  }
})
```

---

### Phase 6: Testing & Verification

#### Task 6.1: Test Route Protection
**Steps:**
1. Login as regular user
2. Try to access `/admin/dashboard`
3. Should redirect to `/dashboard`
4. Login as admin
5. Should be able to access `/admin/dashboard`

#### Task 6.2: Test Dashboard Display
**User Dashboard:**
- [ ] Shows user content (Current Progress, Upcoming Exams)
- [ ] Shows user sidebar menu
- [ ] User can access only their routes

**Admin Dashboard:**
- [ ] Shows admin content (Stats cards, Recent Submissions)
- [ ] Shows admin sidebar menu
- [ ] Admin can access `/admin/*` routes
- [ ] All stats display correctly
- [ ] Table data loads and displays

#### Task 6.3: Test Responsive Design
- [ ] Mobile view (< 640px)
- [ ] Tablet view (640px - 1024px)
- [ ] Desktop view (> 1024px)
- [ ] Grid layout adapts correctly
- [ ] Sidebar still fixed on left
- [ ] Content area proper margins

#### Task 6.4: Browser Console Check
- [ ] No errors or warnings
- [ ] Computed properties work
- [ ] Data binding updates correctly

---

## 📁 File Structure

```
src/
├── modules/
│   └── dashboard/
│       ├── routes/
│       │   └── index.js (MODIFIED - add admin route)
│       └── views/
│           ├── DashboardHome.vue (user dashboard - existing)
│           └── DashboardAdmin.vue (NEW - admin dashboard)
│
├── stores/
│   ├── auth.js (EXISTING)
│   └── admin.js (OPTIONAL - for admin stats)
│
├── components/
│   ├── SideBar.vue (MODIFIED - dynamic menu)
│   └── TopAppBar.vue (MODIFIED - dynamic title)
│
└── router/
    └── guards.js (MODIFIED - add admin route protection)
```

---

## 🎨 Design References

### Colors & Icons
- **Primary Colors:** sky-600, primary-container
- **Icons:** Material Symbols Outlined
- **Shadows:** `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`
- **Borders:** `border border-slate-100`
- **Rounded:** `rounded-xl` for cards

### Component Styling
- **Cards:** White bg, rounded-xl, shadow, border, p-6
- **Stat Value:** text-h3 (24px, bold)
- **Stat Label:** text-label-sm (12px, uppercase)
- **Trend:** Small badge with icon + text
- **Table:** Striped rows, hover effect

---

## 📊 Data Structure

### Admin Stats Object
```javascript
{
  totalQuestions: Number,
  activeExams: Number,
  totalStudents: Number,
  averageGrade: Number,
  questionsTrend: "+12 today",
  examsTrend: "3 ending soon",
  studentsTrend: "98% active",
  gradeTrend: "+2.4% vs last term"
}
```

### Recent Submissions Object
```javascript
{
  id: String,
  studentName: String,
  studentInitials: String,
  examName: String,
  submittedAt: DateTime,
  status: 'completed' | 'pending' | 'failed'
}
```

---

## ⚙️ Configuration

### Environment Setup
- No new env variables needed
- Use existing API base URL
- Use existing design tokens

### Dependencies
- No new packages needed
- Use existing: Vue 3, Pinia, Vue Router, Tailwind

---

## 🚀 Implementation Notes

### For Junior Programmer / AI Model

1. **Start Simple:** Implement basic structure first (routes, guards, components)
2. **Copy Template:** Reference `template/code.html` for exact HTML structure
3. **Convert HTML → Vue:** Convert template HTML to Vue component with proper data binding
4. **Add Interactivity:** Bind component state to UI
5. **Test Step by Step:** Test each feature as you implement
6. **Debug Console:** Check browser console for errors
7. **Ask for Clarification:** If something is unclear, ask for specifics

### Common Pitfalls to Avoid
- ❌ Don't hardcode admin role check - use proper auth store
- ❌ Don't duplicate sidebar/header - reuse existing components
- ❌ Don't forget route guards for admin routes
- ❌ Don't forget responsive design
- ❌ Don't change existing user dashboard
- ❌ Don't forget to test both user and admin flows

---

## 📚 Related Documentation

- `PINIA_INTEGRATION.md` - How to use Pinia for state management
- `ROUTE_GUARDS_GUIDE.md` - How route guards work
- `src/stores/auth.js` - Auth store structure
- `template/code.html` - Admin dashboard template (reference)

---

## ✅ Definition of Done

- [x] All routes created and protected
- [x] Admin dashboard component created
- [x] Welcome section implemented
- [x] Summary stats cards implemented
- [x] Recent submissions table implemented
- [x] Sidebar navigation updated
- [x] Header updated
- [x] Route guards configured
- [x] Responsive design verified
- [x] No console errors
- [x] Tested with both user and admin accounts
- [x] Code reviewed

---

**Created:** 2026-05-18  
**Priority:** High  
**Estimated Effort:** 6-8 hours (for junior programmer or AI)  
**Branch:** `feature/dahboard-admin`
