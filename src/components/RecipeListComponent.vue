<template>
    <main class="main-content">
      <div id="recipe-list-container">
        <div class="recipes-container">
          <div v-for="recipe in filteredAndSearchedRecipes" :key="recipe.id">
            <img :src="recipe.imageURL" alt="Zdjęcie przepisu" class="recipe-image img-fluid" @click="showRecipeDetailPage(recipe.id)">
            <p class="recipe-category">{{ recipe.category }}</p>
            <h3 class="recipe-title" @click="showRecipeDetailPage(recipe.id)">{{ recipe.title }}</h3>
            <p class="recipe-rating">Średnia ocena: {{ averageRatings[recipe.id] || 'Brak ocen' }}</p>
            <div class="rating-container" v-if="user">
              <label for="rating" class="rating-label">Dodaj ocenę (1-5):</label>
              <input type="number" id="rating" v-model.number="ratingToAdd" min="1" max="5" class="rating-input">
              <button @click="addRating(recipe)" class="rating-button">Oceń</button>
            </div>
            <div v-else>
              <p>Musisz się zalogować, aby ocenić ten przepis.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <router-view @recipeUpdated="onRecipeUpdated" @recipeDeleted="onRecipeDeleted" />
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { db } from '@/firebase-config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useRecipeStore } from '@/stores/recipeStore';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
  name: 'RecipeListComponent',
  setup() {
    const router = useRouter();
    const recipeStore = useRecipeStore();
    const userStore = useUserStore();
    const ratingToAdd = ref(null);
    const averageRatings = ref({});

    const filteredAndSearchedRecipes = computed(() => {
      return recipeStore.filterAndSearchRecipes();
    });

    const user = computed(() => userStore.getUser);

    const fetchRecipes = async () => {
      const recipeCollection = collection(db, 'recipes');
      const recipeSnapshot = await getDocs(recipeCollection);

      const recipeList = recipeSnapshot.docs.map((doc) => {
        const recipe = doc.data();
        recipe.id = doc.id;
        return recipe;
      });

      console.log('Fetching recipes...');
      recipeStore.updateRecipes(recipeList);
    };

    onMounted(async () => {
  try {
    await fetchRecipes();
    for (const recipe of filteredAndSearchedRecipes.value) {
      await getAverageRating(recipe);
    }
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
});

    watch(filteredAndSearchedRecipes, async () => {
      for (const recipe of filteredAndSearchedRecipes.value) {
        await getAverageRating(recipe);
      }
    });

    const showRecipeDetailPage = (recipeId) => {
  if (recipeId) {
    router.push({ name: 'RecipeDetail', params: { id: recipeId } });
  } else {
    console.error('Error: recipeId is undefined');
  }
};

const addRating = async (recipe) => {
  const userStore = useUserStore();

  if (!userStore.getUser || !userStore.getToken) {
    alert('Musisz być zalogowany, aby ocenić ten przepis.');
    return;
  }

  if (!ratingToAdd.value || ratingToAdd.value < 1 || ratingToAdd.value > 5) {
    alert('Proszę podać ocenę w zakresie od 1 do 5.');
    return;
  }

  const ratingsCollection = collection(db, 'ratings');
  const q = query(ratingsCollection, where('userId', '==', userStore.getUser.uid), where('recipeId', '==', recipe.id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    alert('Już oceniłeś ten przepis!');
    return;
  }

  await addDoc(ratingsCollection, {
    userId: userStore.getUser.uid,
    recipeId: recipe.id,
    rating: ratingToAdd.value,
  });

  ratingToAdd.value = null;
  await getAverageRating(recipe);
};

    const getAverageRating = async (recipe) => {
      const ratingsCollection = collection(db, 'ratings');
      const q = query(ratingsCollection, where('recipeId', '==', recipe.id));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        averageRatings.value[recipe.id] = 'Brak ocen';
        return;
      }

      let totalRating = 0;
      querySnapshot.forEach((doc) => {
        totalRating += doc.data().rating;
      });

      averageRatings.value[recipe.id] = (totalRating / querySnapshot.size).toFixed(1);
    };

  const onRecipeUpdated = async () => {
    await fetchRecipes();
  };

  const onRecipeDeleted = async () => {
    await fetchRecipes();
  };

    return {
      filteredAndSearchedRecipes,
      user,
      ratingToAdd,
      addRating,
      averageRatings,
      showRecipeDetailPage,
      onRecipeUpdated,
      onRecipeDeleted
    };
  },
});
</script>

<style scoped>
  body {
    background-color: white;
    font-family: 'Nunito', sans-serif;
  }
  

.highlyRated {
    background-color: #d4edda;
    border: 2px solid green;
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

.main-content {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.divider {
  margin-top: 20px;
  border: none;
  height: 1px;
  background-color: gray;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 1);
  width: 100%;
}

.recipes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.recipes-container > div {
  width: 30%;
  margin: 1%;
  padding: 10px;
}

.recipe-image {
  width: 100%;
  height: auto;
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
  min-height: 300px; 
  border-radius: 8px;
  max-width: 100%;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.recipe-image:hover {
  transform: scale(1.05);
}

.theme-white {
  background-color: white;
  color: black;
}

.theme-black {
  background-color: black;
  color: white;
}

.theme-blue {
  background-color: lightblue;
  color: white;
}

.settings-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 80%;
  max-width: 600px;
}

.settings-container h1 {
  text-align: center;
  margin-bottom: 20px;
}

.settings-container label,
.settings-container select {
  display: block;
  margin: 0 auto;
  margin-bottom: 10px;
  width: 70%;
}

.settings-container select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
}

.settings-container select:focus {
  border-color: #66afe9;
}

.settings-container br {
  clear: both;
}

.recipe-category {
    text-align: center;
    font-weight: bold;
    color: green;
    margin-top: 10px;
}

.recipe-title {
    text-align: center;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
}

.recipe-title:hover {
  color: gray;
}

.recipe-rating {
    text-align: center;
    font-weight: bold;
    margin-top: 10px;
    font-size: 1.1em;
    color: #333;
    margin-bottom: 10px;
}

.recipes-container div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipes-container div .rating-container {
  display: flex;
  flex-direction:row;
  align-items: center;
}

.rating-label {
  text-align: center;
  font-weight: bold;
  color: black;
}

.rating-label,
.rating-input,
.rating-button {
  margin: 5px 5px;
}


.rating-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(to right, #2ead2e, #144414);
  color: white;
  cursor: pointer;
  transition: background 0.9s ease-in-out;
}

.rating-button:hover {
  background: linear-gradient(to right, #008000, #5d865d);
}


#recipe-detail-container {
  text-align: center;
  padding: 20px;
}

#recipe-detail-container .recipe-title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 10px;
}

#recipe-detail-container {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
}

#recipe-detail-container .image-container .recipe-image2 {
  max-width: 20%;
  height: auto;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 8px;
}

#recipe-detail-container button {
  font-size: 1em;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#recipe-detail-container .btn-danger {
  background-color: red;
  color: white;
}

#recipe-detail-container .btn {
  background-color: #007BFF;
  color: white;
  transition: background-color 0.3s;
}

#recipe-detail-container .btn:hover {
  background-color: #0056b3;
}

h3{
  text-align: center;
  margin:0;
  padding-bottom: 0px;
  padding-top: 0px;
}

footer.text-center * {
  color: white !important;
}

.icon-large {
  font-size: 24px;
}

.space-above {
  padding-top: 25px;
}

#form5Example2::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.logo img {
  height: 80px;
  width: auto;
  position: relative;
}

.text-center{
  font-family: 'Roboto', sans-serif;
}

h2.text-white.mb-4 {
  font-family: 'Comic Sans MS', sans-serif;
  font-weight: bold;
  font-size: 40px;
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

.btn-edit, .btn-delete, button {
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-right: 10px;
  outline: none; 
  text-decoration: none;
  display: inline-block;
}

.btn-edit:hover, .btn-delete:hover, button:hover {
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.btn-edit:active, .btn-delete:active, button:active {
  transform: translateY(1px);
}

.btn-edit {
  background-color: #28c3db;
}

.btn-edit:hover {
  background-color: #1aa6bd;
}

.btn-delete {
  background-color: #c12e18;
}

.btn-delete:hover {
  background-color: #a52214;
}

button {
  background-color: #666666;
}

button:hover {
  background-color: #555555;
}

.ranking-container {
  text-align: center;
}

.ranking-title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
}

.top-rated-recipes {
  list-style-type: none;
  padding: 0;
}

.recipe-item {
  font-size: 18px;
  margin-bottom: 10px;
}

.ranking-position {
  font-weight: bold;
}

input[type="checkbox"] {
  margin-right: 10px;  /* Dostosuj tę wartość zgodnie z własnymi potrzebami */
}

.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
  </style>
