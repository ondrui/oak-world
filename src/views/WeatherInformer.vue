<template>
  <div class="main-container">
    <CurrentBlock />
    <div class="tabs-container">
      <div class="buttons-tabs">
        <button
          :class="[
            'button-tab',
            { active: currentTab === key },
            { hover: isHover(key) },
          ]"
          @click="showContent(key)"
          v-for="(value, key) in tabsList"
          :key="key"
        >
          <span>{{ showTitle(value, key) }}</span>
        </button>
      </div>
      <div class="tab">
        <router-view></router-view>
      </div>
    </div>
    <DetailsSegment />
    <AllSVGIcons v-if="false" />
  </div>
</template>

<script>
import { eventBus } from "../main.js";
import { mapGetters } from "vuex";
import DetailsSegment from "../components/DetailsSegment/DetailsSegment.vue";
import CurrentBlock from "../components/CurrentBlock.vue";
import AllSVGIcons from "../components/AllSVGIcons.vue";

export default {
  name: "WeatherInformer",
  components: {
    AllSVGIcons,
    DetailsSegment,
    CurrentBlock,
  },
  data() {
    return {
      /**
       * @param currentTab Имя открытой вкладки (компоненты).
       */
      currentTab: "hourly",
      /**
       * @param hover Подсветка вкладки при изменении параметра.
       */
      hover: false,
    };
  },
  created() {
    // При создании компоненты подсвечиваем вкладку из маршрута роутера.
    this.currentTab = this.$route.name === "main" ? "hourly" : this.$route.name;
    // При создании компоненты подписываемся на событие highlight
    // и устанавливаем обработчик на событие.
    eventBus.$on("highlight", (bol) => {
      this.hover = bol;
    });
  },
  destroyed() {
    // Отписываемся от слушателей события при уничтожении компоненты.
    eventBus.$off();
  },
  watch: {
    /**
     * При изменении марщрута роутера подсвечиваем выбранную вкладку.
     */
    "$route.name"(name) {
      this.currentTab = name === "main" ? "hourly" : name;
    },
  },
  computed: {
    ...mapGetters([
      "tenDaysTabTable",
      "getCitySelected",
      "getLocaleURL",
      "getConstantLocale",
      "getCountrySelected",
      "getRegionSelected",
    ]),
    /**
     * Подписи для вкладок.
     */
    tabsList() {
      return this.getConstantLocale("tabsDescr");
    },
  },
  methods: {
    /**
     * Обработчик для установки имени открытой вкладки. Передается
     * через параметр . Обработчик вызывает переход на новый URL.
     * В качестве аргумента передаем объект, описывающий маршрут.
     * @param key Строка содержит имя маршрута для роутера.
     * @param lang Текущая локаль берется из стора.
     * @param city Город для которого выводится прогноз погоды берется из стора.
     * @param country Страна берется из стора.
     * @param region Регион берется из стора.
     */
    showContent(key) {
      this.$router
        .push({
          name: key,
          params: {
            lang: this.getLocaleURL,
            city: this.getCitySelected.nameURL,
            country: this.getCountrySelected,
            region: this.getRegionSelected,
          },
        })
        .catch(() => {});
    },
    /**
     * Возвращает название вкладки с учетом количества дней прогноза.
     * @param value Значение свойства, котороое содержит название вкладки.
     * @param key Имя свойства, котороое содержит название вкладки.
     */
    showTitle(value, key) {
      return key === "day"
        ? value.replace("$_length", this.tenDaysTabTable.length)
        : value;
    },
    /**
     * Проверяем условия подсветки вкладки hourly - должно быть имя вкладки hourly и
     * параметр hover true.
     */
    isHover(val) {
      return val === "hourly" && this.hover;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #ffffff;
}
.home-icon {
  width: 18px;
  height: 15px;
}
.tab {
  min-height: 538px;
  background-color: #f0f7fc;
  border: 1px solid #b2d3e8;
  border-top: none;
}
.buttons-tabs {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-end;
  column-gap: 2px;
  position: relative;
  box-shadow: inset 0 -1px 0 0 #b2d3e8;

  .button-tab {
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    border: none;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #b2d3e8;
    background-color: #ffffff;
    border-radius: 4px 4px 0 0;
    min-height: 34px;

    & span {
      display: inline-block;
      font-weight: 400;
      font-size: 14px;
      line-height: 15px;
      color: #04569c;
      padding: 10px 5px;

      &::first-letter {
        text-transform: capitalize;
      }
    }

    &:hover {
      background-color: #f0f7fc;

      & span {
        color: #04569c;
        text-decoration: underline;
      }
    }

    &.active {
      background-color: #f0f7fc;
      box-shadow: none;
      border-top: none;
      border-top: 3px solid #04569c;
      border-bottom: none;

      & span {
        color: #000000;
        text-decoration: none;
        padding: 11px 5px;
      }
    }
  }
}
.button-tab.hover {
  background-color: #f0f7fc;
  transition: all 0.3s ease-in-out;
  & span {
    color: #04569c;
    text-decoration: underline;
  }
}
.hidden {
  display: none;
}
</style>
