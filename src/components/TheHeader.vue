<template>
  <header class="header">
    <div class="container">
      <router-link :to="pushNewURL(getLocaleURL, 'main')">
        <BaseIcon nameIcon="logo-meteonovosti" pick="common" />
      </router-link>
      <div :class="['header-dropdown', { 'hide-menu': isHide }]">
        <ul class="header-dropdown-content" @click.stop="toggleMenu">
          <li v-for="lang in SupportedLocalesForSwitcher" :key="lang.key">
            <router-link :to="pushNewURL(lang.key)">
              {{ lang.title }}
              <BaseIcon nameIcon="chevron-dropdown" pick="common" width="10"
            /></router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      /**
       * Свойство отвечает за скрытие/отображение  раскрывающегося списка с языками.
       * Первоначально список скрыт.
       */
      isHide: true,
    };
  },
  created() {
    window.addEventListener("click", this.closeMenu);
  },

  beforeDestroy() {
    window.removeEventListener("click", this.closeMenu);
  },
  computed: {
    ...mapGetters([
      "tenDaysTabTable",
      "getLocale",
      "getCitySelected",
      "getLocaleURL",
      "getDefaultLocale",
      "SupportedLocalesForSwitcher",
    ]),
  },
  methods: {
    /**
     * Функция возвращает объект описывающий маршрут перехода на новый URL.
     * Переход происходит при условии передачи в функцию название города.
     * @param name Строка содержит имя маршрута для роутера.
     * @param lang Записывает новую локаль при клике по элементу списка.
     * @param city Город для которого выводится прогноз погоды берется из стора.
     */
    pushNewURL(value, name) {
      const to = this.$router.resolve({
        name: name === "main" ? name : this.$route.name,
        params: {
          lang: value === this.getDefaultLocale ? undefined : value,
          city: this.getCitySelected.name_en,
        },
      });
      return to.location;
    },
    toggleMenu() {
      this.isHide = !this.isHide;
    },
    closeMenu() {
      this.isHide = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  border-bottom: 1px solid rgba(160, 184, 212, 0.4);
  width: 100%;
  margin: 0 auto;
  margin-bottom: 19px;
  min-height: 56px;
  padding-top: 14px;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: $width-page-xl;
  margin: 0 auto;
  padding: 0 18px 0 10px;
  width: 100%;
}
.header-dropdown {
  position: relative;
  border-radius: 2px;
  height: 28px;
  width: 58px;
  & svg {
    display: none;
  }
  &.hide-menu {
    overflow: hidden;
    & svg {
      display: flex;
      align-items: center;
    }
  }
  & .header-dropdown-content {
    position: absolute;
    top: -8px;
    left: -8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 0px;
    list-style: none;
    z-index: 1;
    margin: 0;
    background: #ffffff;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    & a {
      width: 100%;
      display: inline-flex;
      column-gap: 4px;
      // align-items: center;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #04569c;
      padding: 6px 16px;
      text-align: center;
      text-transform: uppercase;
      transition: 200ms all ease-in-out;
    }
    & a:hover {
      background-color: #f0f7fc;
    }
  }
}
@media only screen and (max-width: $media-width-xl) {
  .container {
    max-width: $width-page-lg;
  }
}
</style>
