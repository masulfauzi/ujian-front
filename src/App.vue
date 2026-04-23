<template>
  <div class="app-shell">
    <header class="topbar">
      <h1>Ujian Front</h1>
      <nav>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/bank-soal">Bank Soal</RouterLink>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>
