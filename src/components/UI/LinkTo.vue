<template>
  <div class="link-city">
    <router-link :to="pushNewURL()">{{ getTitleLink }}</router-link>
    <div class="arrow-icon">
      <BaseIcon width="9" nameIcon="arrow-right" pick="common" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { cityIn } from "lvovich";

export default {
  name: "LinkTo",
  computed: {
    ...mapGetters([
      "getCountrySelected",
      "getListAllCities",
      "getConstantLocale",
      "getCitySelected",
      "getCountrySelected",
      "getRegionSelected",
      "getLocaleURL",
    ]),
    isBreadcrumbsShow() {
      return this.$route.meta.breadcrumb[0].name !== "404";
    },
    /**
     * Возвращает строку с текстовым содержимым ссылки.
     */
    getTitleLink() {
      const country = cityIn(this.getCountrySelected.nameLoc);
      return this.getConstantLocale("allCityBtnCaption")
        .replace("$_length", this.getListAllCities.length)
        .replace("$_country", country);
    },
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
        name: "countries",
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
.link-city {
  position: relative;
  margin: 0 auto;
  bottom: 32px;
  left: 0;
  right: 0;
  width: max-content;

  & .arrow-icon {
    pointer-events: none;
    display: flex;
    transition: transform 0.3s ease-in-out;
    width: 9px;
    height: 9px;
    position: absolute;
    margin: auto 0;
    right: 14px;
    bottom: 0;
    top: 0;
  }
  &:hover .arrow-icon {
    transform: scale(1.2);
  }

  & a {
    text-decoration: none;
    display: inline-block;
    padding: 12px 30px 12px 14px;
    background: #e1ecf9;
    border-radius: 20px;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #04569c;
    &:hover {
      text-decoration: underline;
      background: #d0e3f8;
    }
  }
}
</style>
