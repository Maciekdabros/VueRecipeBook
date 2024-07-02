<template>
  <div id="app">
    <navbar-component @navigate="changeComponent">
      <!--<template v-slot:default>
        <p>Witamy w Smaczno!</p>
      </template>-->

      <template v-slot:logo>
        <a href="/" class="logo nav-link" v-if="isAddRecipePage">
          <img src="/logo2.png" alt="Nowe Logo">
        </a>
      </template>

      <template v-slot:settings-link>
        <a href="/admin" v-if="user && user.isAdmin">Panel administracyjny</a>
        <a href="/settings" @click="navigateToSettings" class="nav-link">Ustawienia</a>
      </template>
    </navbar-component>

    <component :is="currentComponent"></component>
    
    <router-view v-if="currentComponent === 'DefaultPage'" />
    
    <footer-component />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import UserDashboardComponent from './components/UserDashboardComponent.vue';
import UserFavoritesComponent from './components/UserFavoritesComponent.vue';
import { useRoute } from 'vue-router';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebase-config';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
  name: "App",
  components: {
    NavbarComponent,
    FooterComponent,
    UserDashboardComponent,
    UserFavoritesComponent,
  },
  setup() {
    const currentComponent = ref('DefaultPage');
    const changeComponent = (componentName) => {
      currentComponent.value = componentName;
    };
    const route = useRoute();
    const themes = ref([
      { name: 'Jasny', class: 'light-theme' },
      { name: 'Ciemny', class: 'dark-theme' }
    ]);
    const fontSizes = ref(['Mała', 'Średnia', 'Duża']);
    const selectedTheme = ref(localStorage.getItem('theme') || 'light-theme');
    const selectedFontSize = ref(localStorage.getItem('fontSize') || 'Średnia');

    const isAddRecipePage = computed(() => route.path === '/add-recipe');

    const applyTheme = () => {
      localStorage.setItem('theme', selectedTheme.value);
      document.body.className = selectedTheme.value;
    };

    const applyFontSize = () => {
      localStorage.setItem('fontSize', selectedFontSize.value);
      document.documentElement.setAttribute('data-font-size', selectedFontSize.value);
    };

    const userStore = useUserStore();

    onMounted(() => {
      applyTheme();
      applyFontSize();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          userStore.setUser(user);
          const token = await user.getIdToken();
          userStore.setToken(token);
        } else {
          userStore.setUser(null);
          userStore.setToken(null);
        }
      });
    });

    return {
      themes,
      fontSizes,
      selectedTheme,
      selectedFontSize,
      applyTheme,
      applyFontSize,
      isAddRecipePage,
      currentComponent,
      changeComponent
    };
  }
});
</script>

<style>

.main-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
  
.nav-link {
  text-decoration: none;
  color:rgb(17, 97, 50);
}
  
  .navbar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    line-height: 30px;
  }
  
  .search-box {
    width: 400px;
    padding: 10px;
  }
  
  .add-recipe-btn {
    border: 1px solid rgb(18, 39, 33);
    padding: 10px 15px;
    background-color: #4b7f4d;
    border-radius: 4px;
    margin-right: 10px;
    color:whitesmoke;
  }
  
  
  .navbar-bottom {
    margin-top: 30px;
    display: flex;
    justify-content: flex-start;
  }
  
  .dropdown {
    position: relative;
    margin-right: 20px;
    padding-top:20px;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    white-space: nowrap; 
    width: 100vw;
    left:0;
    right: 0;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  
  .column {
    display: inline-block; 
    border-right: 1px solid #e0e0e0;
    padding: 10px 15px;
    vertical-align: top;
  }
  
  .column:last-child {
    border-right: none;
  }
  
  .column h6 {
    font-weight: bold;
    margin-bottom: 10px;
    margin-top:10px;
  }
  
  .column ul {
    list-style-type: none;
    padding: 0;
  }
  
  .column li a {
    text-decoration: none;
    color: #333;
    padding: 5px 0;
    display: block;
  }
  
  .column li a:hover {
    color: #4CAF50;
  }
  
  .menu-container {
      display: flex;
  }

.divider {
  margin-top: 20px;
  border: none;
  height: 1px;
  background-color: gray;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 1);
  width: 100%;
}

.logo img {
  height: 80px;
  width: auto;
  position: relative;
}

.search-container {
  position: relative;
}

.fa-search {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

input[type="checkbox"] {
  margin-right: 5px;
}

.user-auth-container {
    display: flex;
    align-items: center;
    gap: 25px;
}

.user-auth-container1 {
    display: flex;
    align-items: center;
    gap: 20px;
}
</style>
