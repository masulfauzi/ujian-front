<template>
  <div class="app">
    <header class="app__header">
      <div class="app__brand">Ujian Front</div>
      <nav class="app__nav">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/dashboard/reports">Reports</router-link>
        <router-link to="/login">Login</router-link>
      </nav>
    </header>
    <main class="app__content">
      <router-view />
    </main>
  </div>
</template>
