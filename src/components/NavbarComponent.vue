<template>
    <div class="main-container">
      <div class="container">
      <div class="navbar-top">
        <slot name="logo">
          <a href="/" class="logo nav-link">
            <img src="/logo-no-background.png" alt="Logo Smaczno">
          </a>
        </slot>
        <div class="search-container">
            <i class="fa fa-search"></i>
            <input type="text" placeholder="Wpisz nazwę składnika lub przepisu" class="search-box" v-model="searchQuery">
        </div>
        <slot/>
        <a href="#" @click="navigateToAddRecipe" class="add-recipe-btn nav-link">Dodaj przepis +</a>

        <div v-if="userStore.getUser" class="user-auth-container1">
          <span>{{ userStore.getUser.displayName || userStore.getUser.email }}</span>
          <button @click="logout" class="nav-link">Wyloguj się</button>
        </div>
        <div v-else class="user-auth-container">
          <router-link to="/register" class="nav-link">Załóż konto</router-link>
          <router-link to="/login" class="nav-link">Zaloguj się</router-link>
        </div>
        <slot name="settings-link">
          <a href="#" @click="navigateToSettings" class="nav-link">Ustawienia</a>
        </slot>
         <!-- <button @click="$emit('navigate', 'UserFavoritesComponent')">Ulubione</button>-->
        <!--<button @click="$emit('navigate', 'UserDashboardComponent')">Dashboard</button>-->
      </div>
            <div class="navbar-bottom">
                        <div class="menu-container">
                            <div class="dropdown">
                                <a href="#" class="nav-link dropdown-toggle">Przepisy</a>
                                <div class="dropdown-content">
                                    <div class="column">
                                        <h6>Posiłek</h6>
                                        <ul>
                                            <li>
                                                <input type="checkbox" id="breakfast" value="Śniadania" v-model="selectedCategories">
                                                <label for="breakfast">Śniadania</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="soups" value="Zupy" v-model="selectedCategories">
                                                <label for="soups">Zupy</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="mainDishes" value="Dania Główne" v-model="selectedCategories">
                                                <label for="mainDishes">Dania Główne</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="desserts" value="Desery" v-model="selectedCategories">
                                                <label for="desserts">Desery</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="drinks" value="Napoje" v-model="selectedCategories">
                                                <label for="drinks">Napoje</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="salads" value="Sałatki" v-model="selectedCategories">
                                                <label for="salads">Sałatki</label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="column">
                                        <h6>Okazje</h6>
                                        <ul>
                                            <li>
                                                <input type="checkbox" id="easter" value="Wielkanoc" v-model="selectedOccasions">
                                                <label for="easter">Wielkanoc</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="christmas" value="Boże Narodzenie" v-model="selectedOccasions">
                                                <label for="christmas">Boże Narodzenie</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="valentines" value="Walentynki" v-model="selectedOccasions">
                                                <label for="valentines">Walentynki</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="halloween" value="Halloween" v-model="selectedOccasions">
                                                <label for="halloween">Halloween</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="communion" value="Komunia" v-model="selectedOccasions">
                                                <label for="communion">Komunia</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="grill" value="Grill" v-model="selectedOccasions">
                                                <label for="grill">Grill</label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="column">
                                        <h6>Kuchnie świata</h6>
                                        <ul>
                                            <li>
                                                <input type="checkbox" id="american" value="Amerykańska" v-model="selectedCuisines">
                                                <label for="american">Amerykańska</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="czech" value="Czeska" v-model="selectedCuisines">
                                                <label for="czech">Czeska</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="italian" value="Włoska" v-model="selectedCuisines">
                                                <label for="italian">Włoska</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="indian" value="Indyjska" v-model="selectedCuisines">
                                                <label for="indian">Indyjska</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="greek" value="Grecka" v-model="selectedCuisines">
                                                <label for="greek">Grecka</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="polish" value="Polska" v-model="selectedCuisines">
                                                <label for="polish">Polska</label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="column">
                                        <h6>Dieta</h6>
                                        <ul>
                                            <li>
                                                <input type="checkbox" id="glutenFree" value="Bez glutenu" v-model="selectedDiets">
                                                <label for="glutenFree">Bez glutenu</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="lactoseFree" value="Bez laktozy" v-model="selectedDiets">
                                                <label for="lactoseFree">Bez laktozy</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="sugarFree" value="Bez cukru" v-model="selectedDiets">
                                                <label for="sugarFree">Bez cukru</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="vegetarian" value="Wegetariańskie" v-model="selectedDiets">
                                                <label for="vegetarian">Wegetariańskie</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="vegan" value="Wegańskie" v-model="selectedDiets">
                                                <label for="vegan">Wegańskie</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="forKids" value="Dla dzieci" v-model="selectedDiets">
                                                <label for="forKids">Dla dzieci</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown">
                                <a href="#" class="nav-link dropdown-toggle">Składniki</a>
                            </div>
                            <div class="dropdown">
                                <a href="#" class="nav-link dropdown-toggle">Nowości</a>
                            </div>
                            <div class="dropdown">
                                <a href="#" class="nav-link dropdown-toggle">Promocje</a>
                            </div>
                        </div>
                    </div>
            </div>
            <hr class="divider">
        </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRecipeStore } from '@/stores/recipeStore';
import { useUserStore } from '@/stores/userStore';
import { auth } from '@/firebase-config';
import { onAuthStateChanged } from "firebase/auth";

export default defineComponent({
  name: 'NavbarComponent',
  setup() {
    const router = useRouter();
    const selectedCategories = ref([]);
    const selectedOccasions = ref([]);
    const selectedCuisines = ref([]);
    const selectedDiets = ref([]);
    const searchQuery = ref('');
    const recipeStore = useRecipeStore();
    const userStore = useUserStore();

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userStore.setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        } else {
          userStore.setUser(null);
        }
      });
    });

    const logout = async () => {
      await auth.signOut();
      userStore.setUser(null);
      userStore.setToken(null);
      router.push('/login');
    };

    const navigateToAddRecipe = () => {
      const user = userStore.getUser;
      if (!user) {
        alert('Musisz być zalogowany, aby dodać przepis.');
        return;
      }
      router.push({ name: 'AddRecipe' });
    };
  
    const navigateToSettings = () => {
      router.push({ name: 'Settings' });
    };

    watch(selectedCategories, (newCategories) => {
      recipeStore.updateSelectedCategories(newCategories);
    });
    watch(selectedOccasions, (newOccasions) => {
      recipeStore.updateSelectedOccasions(newOccasions);
    });
    watch(selectedCuisines, (newCuisines) => {
      recipeStore.updateSelectedCuisines(newCuisines);
    });
    watch(selectedDiets, (newDiets) => {
      recipeStore.updateSelectedDiets(newDiets);
    });
    watch(searchQuery, (newQuery) => {
      recipeStore.updateSearchQuery(newQuery);
    });

    return {
      selectedCategories,
      selectedOccasions,
      selectedCuisines,
      selectedDiets,
      navigateToAddRecipe,
      navigateToSettings,
      searchQuery,
      logout,
      userStore,
    };
  }
});
</script>

<style scoped>

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

