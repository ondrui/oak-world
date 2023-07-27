<template>
  <div id="app">
    <TheSpinner v-if="loading" />
    <HomePage v-else />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomePage from "./components/HomePage.vue";
export default {
  name: "App",
  /**
   * Параметр компонента, который содержит всю информацию,
   * которая преобразуется в различные метатеги и атрибуты страницы.
   * Добавляет информацию в тег <lang>
   */
  head() {
    return {
      htmlAttrs: {
        lang: this.getLocale === "am" ? "hy" : this.getLocale,
      },
    };
  },
  components: {
    HomePage,
  },
  computed: {
    ...mapGetters(["loading", "getLocale"]),
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  /** styling scrollbar component*/

  &::-webkit-scrollbar {
    width: 4px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 4px solid #cfd6e4;
    background: #cfd6e4;
  }
  & {
    scrollbar-width: thin;
  }
}
/*
focus
 */
*:focus {
  outline: 2px solid $color-filter-font-focus;
}
/* Hide focus styles if they're not needed, for example,
when an element receives focus via the mouse. */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Show focus styles on keyboard focus. */
*:focus-visible {
  outline: 2px solid $color-filter-font-focus;
}
html {
  scroll-behavior: smooth;
}
a {
  text-decoration: none;
}
</style>
