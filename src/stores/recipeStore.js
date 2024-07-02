import { defineStore } from 'pinia';

export const useRecipeStore = defineStore({
  id: 'recipeStore',
  state: () => ({
    recipes: [],
    selectedCategories: [],
    selectedOccasions: [],
    selectedCuisines: [],
    selectedDiets: [],
    searchQuery: ''
  }),
  actions: {
    filterAndSearchRecipes() {
      const query = this.searchQuery.toLowerCase();
      console.log('Filtering and searching with query:', query);
      const result = this.recipes.filter(recipe =>
        (this.selectedCategories.length === 0 || this.selectedCategories.includes(recipe.category)) &&
        (this.selectedOccasions.length === 0 || this.selectedOccasions.includes(recipe.occasion)) &&
        (this.selectedCuisines.length === 0 || this.selectedCuisines.includes(recipe.cuisine)) && 
        (this.selectedDiets.length === 0 || this.selectedDiets.includes(recipe.diet)) &&
        (recipe.title.toLowerCase().includes(query) || recipe.ingredients.toLowerCase().includes(query))
      );
      console.log('Filtered and searched recipes:', result);
      return result;
    },
    updateRecipes(newRecipes) {
      this.recipes = newRecipes;
    },
    updateSelectedCategories(newCategories) {
        this.selectedCategories = newCategories;
    },
    updateSelectedOccasions(newOccasions) {
        this.selectedOccasions = newOccasions;
    },
    updateSelectedCuisines(newCuisines) {
        this.selectedCuisines = newCuisines;
    },
    updateSelectedDiets(newDiets) {
        this.selectedDiets = newDiets;
    },
    updateSearchQuery(query) {
        this.searchQuery = query;
    },
    }
});
