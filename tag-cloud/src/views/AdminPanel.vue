<template>
  <div>
    <h1>Admin Panel</h1>
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 500px;"
      :columnDefs="columnDefs"
      :rowData="words"
      @rowClicked="editWord"
    ></ag-grid-vue>
    <button @click="addWord">Add Word</button>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditing ? 'Edit Word' : 'Add Word' }}</h2>
        <label>
          Word:
          <input v-model="currentWord.word" />
        </label>
        <label>
          Weight:
          <input v-model="currentWord.weight" type="number" />
        </label>
        <button @click="saveWord">Save</button>
        <button @click="deleteWord" v-if="isEditing">Delete</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
const router = useRouter();

if (!localStorage.getItem('accessToken')) {
    router.push('/web/admin-login');
}

const words = ref([]);
const columnDefs = [
  { headerName: 'Word', field: 'word' },
  { headerName: 'Size', field: 'size' },
  { headerName: 'Weight', field: 'weight' }
];

const showModal = ref(false);
const isEditing = ref(false);
const currentWord = ref({ word: '', size: 7, weight: 7 });
const originalWord = ref('');

async function fetchWords() {
  try {
    const response = await fetch(`${process.env.VUE_APP_SSE_URL}/api/getword`, {
      headers: {
        'Authorization': localStorage.getItem('accessToken')
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken')
      router.push('/web/admin-login');
      return;
    }

    const data = await response.json();
    words.value = data;
  } catch (error) {
    console.error('Ошибка при получении слов:', error);
  }
}

function addWord() {
  currentWord.value = { word: '', size: 7, weight: 7 };
  isEditing.value = false;
  showModal.value = true;
}

function editWord(event) {
  currentWord.value = { ...event.data };
  originalWord.value = event.data.word;
  isEditing.value = true;
  showModal.value = true;
}

async function saveWord() {
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value ? `${process.env.VUE_APP_SSE_URL}/api/words/${originalWord.value}` : `${process.env.VUE_APP_SSE_URL}/api/words`;
    const body = isEditing.value ? { newWord: currentWord.value.word, size: currentWord.value.word.length, weight: currentWord.value.weight } : currentWord.value;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken')
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken')
      router.push('/web/admin-login');
      return;
    }

    fetchWords();
    closeModal();
  } catch (error) {
    console.error('Ошибка при сохранении слова:', error);
  }
}

async function deleteWord() {
  try {
    const response = await fetch(`${process.env.VUE_APP_SSE_URL}/api/words/${currentWord.value.word}`, {
      method: 'DELETE',
      headers: {
        'Authorization': localStorage.getItem('accessToken')
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken')
      router.push('/web/admin-login');
      return;
    }

    fetchWords();
    closeModal();
  } catch (error) {
    console.error('Ошибка при удалении слова:', error);
  }
}

function closeModal() {
  showModal.value = false;
}

onMounted(() => {
    fetchWords();
});
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

.modal label {
  display: block;
  margin-bottom: 10px;
}

.modal input {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}

.modal button {
  margin-right: 10px;
}
</style>
