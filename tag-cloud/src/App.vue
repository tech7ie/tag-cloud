<template>
  <div class="center">
    <div class="words">
      <vue-word-cloud
        style="height: 1800px; width: 2500px;"
        :words="words"
        :color="colorFunction"
        font-family="Roboto"
      >
        <template v-slot="{text, weight}">
          <div :title="weight" style="cursor: pointer;">
            {{ text }}
          </div>
        </template>
      </vue-word-cloud>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import VueWordCloud from 'vuewordcloud';

let words = ref(JSON.parse(localStorage.getItem('words')) || []);

const colorFunction = (word, index) => {
  return index % 3 == 0 ? '#FF8300' : '#196cdf';
};


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let socket;
let intervalId;

onMounted(() => {
  socket = new WebSocket(`ws://${process.env.VUE_APP_BACKEND_URL}`);
  socket.addEventListener('message', function (event) {
  const word = event.data;
  const timestamp = Date.now();
  let size;

  // Проверяем, существует ли слово уже в массиве words
  const existingWord = words.value.find(([existingWord]) => existingWord === word);

  if (existingWord) {
    existingWord[1] += 0.15;
    size = existingWord[1];
  } else {
    size = getRandomInt(8, 9);
    words.value.push([word, size, timestamp]);
  }

  localStorage.setItem('words', JSON.stringify(words.value));
});

  // intervalId = setInterval(() => {
  //   const fiveMinutesAgo = Date.now() - 1 * 60 * 1000;
  //   words.value.sort((a, b) => a[2] - b[2]);
  //   if (words.value.length > 0 && words.value[0][2] < fiveMinutesAgo) {
  //     words.value.shift();
  //   }
  //   localStorage.setItem('words', JSON.stringify(words.value));
  // }, 5000);
});

onUnmounted(() => {
  socket.close();
  clearInterval(intervalId);
});
</script>

<style scoped>
.center {
  height: 99vh;
  width: 99vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
