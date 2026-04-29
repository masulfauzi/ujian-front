<template>
    <section class="page">
        <h1>Login</h1>
        <form class="card">
            <label>
                Email
                <input type="email" name="email" placeholder="email@example.com" />
            </label>
            <label>
                Password
                <input type="password" name="password" placeholder="********" />
            </label>
            <button type="button">Masuk</button>
        </form>
        <p class="page__hint">
            Belum punya akun? <router-link to="/register">Daftar</router-link>
        </p>
    </section>
</template>
