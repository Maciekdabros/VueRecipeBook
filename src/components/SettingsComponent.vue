<template>
    <main class="main-content">
    <div class="settings-container">
      <h1>Personalizacja</h1>
      <label for="theme-selector">Wybierz motyw:</label>
      <select id="theme-selector" v-model="selectedTheme" @change="applyTheme">
          <option v-for="theme in themes" :value="theme.class" :key="theme.class">{{ theme.name }}</option>
      </select>
      <br>
      <label for="font-size-selector">Wybierz rozmiar czcionki:</label>
      <select id="font-size-selector" v-model="selectedFontSize" @change="applyFontSize">
          <option v-for="fontSize in fontSizes" :value="fontSize" :key="fontSize">{{ fontSize }}</option>
      </select>
    </div>
    </main>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'SettingsComponent',
  setup() {
    const themes = ref([
      { name: 'Jasny', class: 'light-theme' },
      { name: 'Ciemny', class: 'dark-theme' }
    ]);
    const fontSizes = ref(['Mała', 'Średnia', 'Duża']);
    const selectedTheme = ref(localStorage.getItem('theme') || 'light-theme');
    const selectedFontSize = ref(localStorage.getItem('fontSize') || 'Średnia');

    const applyTheme = () => {
      localStorage.setItem('theme', selectedTheme.value);
      document.body.className = selectedTheme.value;
    };

    const applyFontSize = () => {
      localStorage.setItem('fontSize', selectedFontSize.value);
      document.documentElement.setAttribute('data-font-size', selectedFontSize.value);
    };

    onMounted(() => {
      applyTheme();
      applyFontSize();
    });

    return {
      themes,
      fontSizes,
      selectedTheme,
      selectedFontSize,
      applyTheme,
      applyFontSize
    };
  }
});
</script>

<style>
.light-theme {
  --background-color: white;
  --text-color: black;
}

.dark-theme {
  --background-color: black;
  --text-color: white;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}

html[data-font-size="Mała"] {
  font-size: 16px;
}

html[data-font-size="Średnia"] {
  font-size: 18px;
}

html[data-font-size="Duża"] {
  font-size: 20px;
}

.main-content {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 82px;

    display: flex;
    flex-direction: column;
    
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

</style>