<template>
    <main class="main-content">
          <h3>Dodaj nowy przepis</h3>
          <form @submit.prevent="saveRecipeToFirestore">
              <div class="mb-3">
                  <label for="recipeName" class="form-label">Nazwa przepisu</label>
                  <input type="text" class="form-control" id="recipeName" v-model="newRecipe.title" required>
              </div>
              <div class="mb-3">
                  <label for="recipeCategory" class="form-label">Kategoria posiłku</label>
                  <select id="recipeCategory" v-model="newRecipe.category" class="form-control">
                      <option value="">Wybierz kategorię</option>
                      <option value="Śniadania">Śniadania</option>
                      <option value="Zupy">Zupy</option>
                      <option value="Dania Główne">Dania Główne</option>
                      <option value="Desery">Desery</option>
                      <option value="Napoje">Napoje</option>
                      <option value="Sałatki">Sałatki</option>
                  </select>
              </div>
              <div class="mb-3">
                  <label for="recipeOccasion" class="form-label">Okazja</label>
                  <select id="recipeOccasion" v-model="newRecipe.occasion" class="form-control">
                      <option value="">Wybierz okazję</option>
                      <option value="Wielkanoc">Wielkanoc</option>
                      <option value="Boże Narodzenie">Boże Narodzenie</option>
                      <option value="Walentynki">Walentynki</option>
                      <option value="Halloween">Halloween</option>
                      <option value="Komunia">Komunia</option>
                      <option value="Grill">Grill</option>
                  </select>
              </div>
              <div class="mb-3">
                  <label for="recipeCuisine" class="form-label">Kuchnie świata</label>
                  <select id="recipeCuisine" v-model="newRecipe.cuisine" class="form-control">
                      <option value="">Wybierz kuchnię</option>
                      <option value="Amerykańska">Amerykańska</option>
                      <option value="Czeska">Czeska</option>
                      <option value="Włoska">Włoska</option>
                      <option value="Indyjska">Indyjska</option>
                      <option value="Grecka">Grecka</option>
                      <option value="Polska">Polska</option>
                  </select>
              </div>
              <div class="mb-3">
                  <label for="recipeDiet" class="form-label">Dieta</label>
                  <select id="recipeDiet" v-model="newRecipe.diet" class="form-control">
                      <option value="">Wybierz dietę</option>
                      <option value="Bez glutenu">Bez glutenu</option>
                      <option value="Bez laktozy">Bez laktozy</option>
                      <option value="Bez cukru">Bez cukru</option>
                      <option value="Wegetariańskie">Wegetariańskie</option>
                      <option value="Wegańskie">Wegańskie</option>
                      <option value="Dla dzieci">Dla dzieci</option>
                  </select>
              </div>
              <div class="mb-3">
                  <label for="recipeIngredients" class="form-label">Składniki</label>
                  <textarea class="form-control" id="recipeIngredients" v-model="newRecipe.ingredients" required></textarea>
              </div>
              <div class="mb-3">
                  <label for="recipeInstructions" class="form-label">Instrukcja</label>
                  <textarea class="form-control" id="recipeInstructions" v-model="newRecipe.description" required></textarea>
              </div>
              <div class="mb-3">
                  <label for="recipeImage" class="form-label">Zdjęcie przepisu</label>
                  <input type="file" class="form-control" id="recipeImage" @change="handleImageUpload">
              </div>
              <button type="submit">Dodaj przepis</button>
              <button @click="cancelAddRecipe" class="btn btn-secondary">Anuluj</button>
          </form>
    </main>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { db, storage } from '@/firebase-config';
import { collection, addDoc} from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
  name: 'RecipeFormComponent',
  setup() {
    
    const newRecipe = ref({
      title: '',
      category: '',
      occasion: '',
      cuisine: '',
      diet: '',
      ingredients: '',
      description: '',
      imageURL: '',
      index: 0,
    });
    const router = useRouter();
    const image = ref(null);

    const handleImageUpload = (event) => {
      const target = event.target;
      const files = target.files;
      if (files && files[0]) {
        image.value = files[0];
      }
    };

    const saveRecipeToFirestore = async () => {
  const userStore = useUserStore();

  // if (!userStore.getUser || !userStore.getToken) {
  //   alert('Musisz być zalogowany, aby dodać przepis.');
  //   return;
  // }

  newRecipe.value.authorId = userStore.getUser.uid;
  console.log("Saving recipe with authorId:", newRecipe.value.authorId);

  console.log("saveRecipeToFirestore function called");
  try {
    const recipeCollectionRef = collection(db, 'recipes');
    if (image.value) {
      const storageReference = storageRef(storage, `recipes/images/${image.value.name}`);
      const uploadTask = uploadBytesResumable(storageReference, image.value);

      uploadTask.on('state_changed', null, 
        (error) => {
          console.error('Error uploading image: ', error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          newRecipe.value.imageURL = downloadURL;
          await addDoc(recipeCollectionRef, newRecipe.value);
          router.push('/');
        }
      );
    } else {
      await addDoc(recipeCollectionRef, newRecipe.value);
      router.push('/');
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

    const cancelAddRecipe = () => {
      router.push('/');
    };

    return {
      newRecipe,
      saveRecipeToFirestore,
      handleImageUpload,
      cancelAddRecipe
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
    max-width: 1200px;
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