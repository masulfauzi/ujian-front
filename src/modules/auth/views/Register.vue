<template>
    <section class="page">
        <h1>Register</h1>
        <form class="card">
            <label>
                Nama
                <input type="text" name="name" placeholder="Nama lengkap" />
            </label>
            <label>
                Email
                <input type="email" name="email" placeholder="email@example.com" />
            </label>
            <label>
                Password
                <input type="password" name="password" placeholder="********" />
            </label>
            <button type="button">Daftar</button>
        </form>
        <p class="page__hint">
            Sudah punya akun? <router-link to="/login">Masuk</router-link>
        </p>
    </section>
</template>
