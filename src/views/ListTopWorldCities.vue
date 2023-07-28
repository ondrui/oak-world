<template>
  <div class="container">
    <div>
      <h1>WORLD WEATHER</h1>
      <router-link :to="pushNewURL()">Перейти на главную</router-link>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "getLocaleURL",
      "getCitySelected",
      "getCountrySelected",
      "getRegionSelected",
    ]),
  },
  methods: {
    /**
     * Функция возвращает объект описывающий маршрут перехода на новый URL.
     * @param name Строка содержит имя маршрута для роутера.
     * @param lang Текущая локаль берется из стора.
     * @param city Город для которого выводится прогноз погоды берется из стора.
     */
    pushNewURL() {
      return {
        name: "main",
        params: {
          lang: this.getLocaleURL,
          city: this.getCitySelected.nameURL,
          country: this.getCountrySelected.nameURL,
          region: this.getRegionSelected.nameURL,
        },
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  & h2 {
    margin-bottom: 20px;
  }
}
</style>
