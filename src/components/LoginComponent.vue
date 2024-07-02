<template>
    <div class="form-container">
      <form @submit.prevent="login">
        <div class="center">
          <h2>Zaloguj się</h2>
        </div>
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Hasło" required />
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { auth } from '@/firebase-config';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();
      const userStore = useUserStore();
  
      const login = async () => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
          const user = userCredential.user;
          userStore.setUser(user);

          const token = await user.getIdToken();
          userStore.setToken(token);
          
          router.push('/');
        } catch (error) {
          console.error(error.message);
          alert("Login failed: " + error.message);
        }
      };
  
      return {
        email,
        password,
        login
      };
    }
  };
  </script>

<style scoped>
.form-container {
  width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #008CBA;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #005f5f;
}

h2 {
text-align: center;
padding-bottom:20px ;
}


</style>