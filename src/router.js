import SettingsComponent from './components/SettingsComponent.vue';
import RecipeFormComponent from './components/RecipeFormComponent.vue';
import RecipesListComponent from './components/RecipeListComponent.vue';
import RecipeDetailComponent from '@/components/RecipeDetailComponent.vue'
import LoginComponent from '@/components/LoginComponent.vue'
import RegisterComponent from '@/components/RegisterComponent.vue'
import { createRouter, createWebHistory} from 'vue-router';

const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsComponent,
  },
  {
    path: '/add-recipe',
    name: 'AddRecipe',
    component: RecipeFormComponent,
  },
  {
    path: '/',
    name: 'RecipesList',
    component: RecipesListComponent,
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetailComponent,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent,
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;
