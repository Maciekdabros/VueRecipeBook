<template>
    <div class="form-container">
      <form @submit.prevent="register">
        <h2>Załóż konto</h2>
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Hasło" required />
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { auth } from '@/firebase-config';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();
      const userStore = useUserStore();
      const register = async () => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
          const user = userCredential.user;
          userStore.setUser(userCredential.user);
          
          const token = await user.getIdToken();
          userStore.setToken(token);

          router.push({ name: 'RecipesList' });
        } catch (error) {
          console.error(error);
          alert("Registration failed: " + error.message);
        }
      };
      return {
        email,
        password,
        register
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
  