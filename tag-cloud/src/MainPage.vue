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
            :rotation="0"
            :spacing="0.05"
            font-family="Verdana"
            :font-size-ratio="5"
        >
          <template v-slot="{text, weight}">
            <div :title="weight" :style="{ fontSize: `${weight * 10}px` }" style="cursor: pointer;">
              {{ text }}
            </div>
          </template>
        </vue-word-cloud>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import VueWordCloud from 'vuewordcloud';

const words = ref([]);

async function fetchWords() {
  try {
    const response = await fetch(`${process.env.VUE_APP_SSE_URL}/api/getword`);
    const data = await response.json();
    words.value = data.map(item => [item.word, item.weight, Date.now()]);
  } catch (error) {
    console.error('Error fetching words:', error);
  }
}

// let eventSource;

// function connect() {
//   const sseUrl = `${process.env.VUE_APP_SSE_URL}/events`;
//   eventSource = new EventSource(sseUrl);

//   eventSource.onerror = function (event) {
//     console.error('SSE error', event);
//   };
// }

onMounted(() => {
  fetchWords();
  // connect();
  setInterval(fetchWords, 1500);
});

// onUnmounted(() => {
//   if (eventSource) {
//     eventSource.close();
//   }
// });
</script>

<style>
body {
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

.admin-link {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: white;
  text-decoration: none;
  background-color: #000;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
