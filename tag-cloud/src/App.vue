<template>
  <div>
    <img src="@/assets/logo.svg"
         style="height: 3vh; margin-left: 30%; margin-top: 6vh; z-index: 99; filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7))"/>
    <div class="center">
      <div class="words">
        <vue-word-cloud
            style="height: 1800px; width: 2500px;"
            :words="words"
            :color="'#ffffff'"
            :rotation="() => (Math.random() * 30 - 15) * Math.PI / 180"
            :spacing="0.2"
            font-family="Verdana"
            enter-animation="fade"
        >
          <template v-slot="{text, weight}">
            <div :title="weight" style="cursor: pointer;">
              {{ text }}
            </div>
          </template>
        </vue-word-cloud>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import VueWordCloud from 'vuewordcloud';

let words = ref(JSON.parse(localStorage.getItem('words')) || []);

// const colorFunction = (word, index) => {
//   return index % 3 == 0 ? '#a99cd1';
// };


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let socket;
let intervalId;

onMounted(() => {
  socket = new WebSocket(`wss://${process.env.VUE_APP_BACKEND_URL}`);
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
      size = getRandomInt(6, 9);
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

<style >
body{
  background-color: #415da6;
  overflow: hidden;
  background: url(@/assets/background.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

.center {
  height: 92vh;
  width: 99vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
