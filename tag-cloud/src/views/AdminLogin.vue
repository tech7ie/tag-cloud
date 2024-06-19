<template>
  <div>
    <h1>Enter Secret Key</h1>
    <label for="secretKey">Secret Key:</label>
    <input v-model="secretKey" id="secretKey" type="text" />
    <button @click="verifySecretKey">Submit</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const secretKey = ref('');
    const errorMessage = ref('');

    function verifySecretKey() {
      localStorage.setItem('accessToken', secretKey.value);
      router.push('/web/admin');
    }

    return {
      secretKey,
      errorMessage,
      verifySecretKey,
    };
  },
};
</script>
