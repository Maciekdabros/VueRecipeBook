<template>
    <div v-if="recipe" class="detail-page">
      <h1>Nazwa dania:{{ recipe.title }}</h1>
      <div class="image-container">
        <img :src="recipe.imageURL" alt="Zdjęcie przepisu" class="recipe-image2">
      </div>
      <p>Składniki: {{ recipe.ingredients }}</p>
      <p>Opis przyrządzenia: {{ recipe.description }}</p>
      <button @click="editMode = !editMode" class="btn-edit">Edytuj</button>
      <div v-if="editMode && editRecipeData">
    <input type="text" v-model="editRecipeData.title" placeholder="Tytuł" />
    <textarea v-model="editRecipeData.ingredients" placeholder="Składniki"></textarea>
    <textarea v-model="editRecipeData.description" placeholder="Instrukcje"></textarea>
    <select id="recipeCategory" v-model="editRecipeData.category" class="form-control">
        <option value="">Wybierz kategorię</option>
        <option value="Śniadania">Śniadania</option>
        <option value="Zupy">Zupy</option>
        <option value="Dania Główne">Dania Główne</option>
        <option value="Desery">Desery</option>
        <option value="Napoje">Napoje</option>
        <option value="Sałatki">Sałatki</option>
    </select>
    <select id="recipeOccasion" v-model="editRecipeData.occasion" class="form-control">
        <option value="">Wybierz okazję</option>
        <option value="Wielkanoc">Wielkanoc</option>
        <option value="Boże Narodzenie">Boże Narodzenie</option>
        <option value="Walentynki">Walentynki</option>
        <option value="Halloween">Halloween</option>
        <option value="Komunia">Komunia</option>
        <option value="Grill">Grill</option>
    </select>
    <select id="recipeCuisine" v-model="editRecipeData.cuisine" class="form-control">
        <option value="">Wybierz kuchnię</option>
        <option value="Amerykańska">Amerykańska</option>
        <option value="Czeska">Czeska</option>
        <option value="Włoska">Włoska</option>
        <option value="Indyjska">Indyjska</option>
        <option value="Grecka">Grecka</option>
        <option value="Polska">Polska</option>
    </select>
    <select id="recipeDiet" v-model="editRecipeData.diet" class="form-control">
        <option value="">Wybierz dietę</option>
        <option value="Bez glutenu">Bez glutenu</option>
        <option value="Bez laktozy">Bez laktozy</option>
        <option value="Bez cukru">Bez cukru</option>
        <option value="Wegetariańskie">Wegetariańskie</option>
        <option value="Wegańskie">Wegańskie</option>
        <option value="Dla dzieci">Dla dzieci</option>
    </select>
    <input type="file" @change="onFileChange" />
    <button @click="updateRecipe" class="update-button">Zaktualizuj przepis</button>
  </div>
      <button @click="deleteRecipe" class="btn-delete">Usuń</button>
      <button @click="goBack">Wróć</button>
  </div>
</template>


<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/firebase-config';
import { doc, getDoc, deleteDoc, setDoc, collection, query, where, writeBatch, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
  name: 'RecipeDetailComponent',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  emits: ['recipeUpdated', 'recipeDeleted'],
  setup(props, { emit }) {
    const router = useRouter();
    const recipe = ref(null);
    const editMode = ref(false);
    const editRecipeData = ref(null);

    onMounted(async () => {
      const recipeDoc = await getDoc(doc(db, 'recipes', props.id));
      if (recipeDoc.exists()) {
        recipe.value = { id: recipeDoc.id, ...recipeDoc.data() };
        editRecipeData.value = { ...recipe.value };
      } else {
        console.log('No recipe found with id:', props.id);
      }
      console.log('Recipe ID from props:', props.id);
    });

    const updateRecipe = async () => {

      const userStore = useUserStore();

      if (!userStore.getUser) {
        alert('Musisz być zalogowany, aby edytować przepis.');
        return;
      }

      if (!userStore.getUser || !userStore.getToken || recipe.value.authorId !== userStore.getUser.uid) {
        alert('Tylko autor przepisu może go edytować.');
        return;
      }

      if (editRecipeData.value) {
        await setDoc(doc(db, 'recipes', props.id), editRecipeData.value);
        alert('Przepis zaktualizowany pomyślnie!');
        emit('recipeUpdated');
        console.log('Emitting recipeUpdated');

        const updatedRecipeDoc = await getDoc(doc(db, 'recipes', props.id));
        if (updatedRecipeDoc.exists()) {
          recipe.value = updatedRecipeDoc.data();
        }
      }
    };

    const deleteRecipe = async () => {

      const userStore = useUserStore();

      if (!userStore.getUser || !userStore.getToken || recipe.value.authorId !== userStore.getUser.uid) {
        alert('Tylko autor przepisu może go usunąć.');
        return;
      }

      if (confirm('Czy na pewno chcesz usunąć ten przepis?')) {
        await deleteDoc(doc(db, 'recipes', props.id));
        const batch = writeBatch(db);
        const q = query(collection(db, 'ratings'), where('recipeId', '==', props.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        emit('recipeDeleted');
        console.log('Emitting recipeDeleted');
        setTimeout(() => router.push({ name: 'RecipesList' }), 500);
      }
    };

    const goBack = () => {
      router.back();
    };

    const onFileChange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (editRecipeData.value) {
            editRecipeData.value.imageURL = reader.result;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    return {
      recipe,
      deleteRecipe,
      goBack,
      editMode,
      editRecipeData,
      updateRecipe,
      onFileChange
    };
  },
});
</script>

<style scoped>



.detail-page .recipe-title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 10px;
}

.detail-page {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  padding: 20px;
}

.detail-page .image-container .recipe-image2 {
  max-width: 25%;
  height: auto;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 8px;
}

.detail-page button {
  font-size: 1em;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.detail-page .btn-danger {
  background-color: red;
  color: white;
}

.detail-page .btn {
  background-color: #007BFF;
  color: white;
  transition: background-color 0.3s;
}

.detail-page .btn:hover {
  background-color: #0056b3;
}

h3{
  text-align: center;
  margin:0;
  padding-bottom: 0px;
  padding-top: 0px;
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

.detail-page {
    padding: 2rem;
    margin: auto;
    max-width: 800px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-page h1 {
    margin-bottom: 1rem;
    font-size: 2rem;
    color: #333;
}

.image-container {
    margin-bottom: 1rem;
}

.recipe-image2 {
    width: 100%;
    border-radius: 8px;
}

.btn-edit,
.btn-delete {
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.btn-edit {
    background-color: #2ecc71;
    color: #fff;
}

.btn-delete {
    background-color: #e74c3c;
    color: #fff;
}

textarea,
input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 1rem;
}

textarea {
    height: 150px;
    resize: vertical;
}

.update-button {
    background-color: #3498db;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.form-control {
    margin-bottom: 15px;
}


</style>
