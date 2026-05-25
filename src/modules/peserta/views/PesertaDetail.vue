<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-3xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          <span v-if="!isLoading">{{ selectedPeserta?.nama }}</span>
          <span v-else>Memuat detail...</span>
        </h1>
        <p class="text-slate-500 mt-1">Informasi detail peserta ujian</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat detail peserta...</p>
        </div>
      </div>

      <!-- Detail Section -->
      <div v-else-if="selectedPeserta" class="space-y-6">
        <!-- Nama Peserta Card -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 class="text-sm font-semibold text-slate-600 uppercase mb-2">Nama Peserta</h3>
          <p class="text-2xl font-bold text-slate-900">{{ selectedPeserta.nama }}</p>
        </div>

        <!-- Informasi Peserta Card -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 class="text-sm font-semibold text-slate-600 uppercase mb-4">Informasi Peserta</h3>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-slate-500 uppercase">Kelas</p>
              <p class="text-slate-900 font-medium">{{ selectedPeserta.nama_kelas }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 uppercase">Username</p>
              <p class="text-slate-900 font-medium">{{ selectedPeserta.username }}</p>
            </div>
          </div>
        </div>

        <!-- Metadata Card -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
          <h3 class="text-sm font-semibold text-slate-600 uppercase mb-4">Informasi Sistem</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500 uppercase">Dibuat pada</p>
              <p class="text-slate-900 font-medium">{{ formatDate(selectedPeserta.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 uppercase">Diperbarui pada</p>
              <p class="text-slate-900 font-medium">{{ formatDate(selectedPeserta.updated_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="handleEdit"
            class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">edit</span>
            Edit Peserta
          </button>
          <button
            @click="handleDelete"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">delete</span>
            Hapus Peserta
          </button>
          <button
            @click="handleBack"
            class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
            Kembali
          </button>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-slate-300">search_off</span>
        <p class="text-slate-600 mt-4">Peserta tidak ditemukan</p>
        <button
          @click="handleBack"
          class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
          Kembali ke daftar
        </button>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePesertaStore } from '@/stores/peserta'
import { useDialog } from '@/composables/useDialog'

const route = useRoute()
const router = useRouter()
const pesertaStore = usePesertaStore()
const { $confirm } = useDialog()
const pesertaId = route.params.id

const isLoading = computed(() => pesertaStore.isLoading)
const error = ref(null)
const selectedPeserta = computed(() => pesertaStore.selectedPeserta)

onMounted(async () => {
  try {
    await pesertaStore.fetchPesertaById(pesertaId)
  } catch (err) {
    error.value = 'Gagal memuat detail peserta'
  }
})

const handleEdit = () => {
  router.push({ name: 'peserta.edit', params: { id: pesertaId } })
}

const handleDelete = async () => {
  if (await $confirm('Yakin ingin menghapus peserta ini? Tindakan ini tidak dapat dibatalkan.', { title: 'Konfirmasi Hapus' })) {
    try {
      await pesertaStore.deletePeserta(pesertaId)
      router.push({ name: 'peserta.list' })
    } catch (err) {
      error.value = pesertaStore.error || 'Gagal menghapus peserta'
    }
  }
}

const handleBack = () => {
  router.push({ name: 'peserta.list' })
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return dateString
  }
}
</script>
