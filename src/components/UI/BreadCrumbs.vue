<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol class="crumbs">
      <li
        v-for="(item, index) in breadcrumbList"
        :key="item"
        :aria-current="!isLast(index) ? 'page' : null"
      >
        <router-link v-if="isLast(index)" :to="pushNewURL()">{{
          item
        }}</router-link>
        <span v-else>{{ item }}</span>
        <BaseIcon
          nameIcon="chevron-breadcrumb-right"
          width="5"
          pick="common"
          v-if="isLast(index)"
          class="separator"
        />
      </li>
    </ol>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "BreadCrumbs",
  data() {
    return {
      /**
       * Массив содержит имена ссылок навигационной цепочки.
       */
      breadcrumbList: [],
    };
  },
  mounted() {
    /**
     * Задоем имена ссылок.
     */
    this.breadcrumbs("breadcrumbs", this.$route.meta.breadcrumb);
  },
  watch: {
    /**
     * Изменяем ссылки навигационной цепочки при изменении маршрута
     * роутера.
     */
    $route(to) {
      const city = to.params.city;
      this.breadcrumbs("breadcrumbs", this.$route.meta.breadcrumb, city);
    },
  },
  computed: {
    ...mapGetters(["getCitySelected", "getLocaleURL", "getConstantLocale"]),
  },
  methods: {
    /**
     * По условию отображает элемент ссылка.
     */
    isLast(index) {
      return index !== this.breadcrumbList.length - 1;
    },
    /**
     * Функция для создания массива с именами ссылок.
     * @param key Ключ 1-го уровня для объекта со строковыми константами.
     * @param arr Массив с ключами 2-го уровня для объекта со строковыми константами.
     */
    breadcrumbs(key, arr) {
      const crumbsArr = arr.map(({ name }) =>
        this.getConstantLocale(key, name)
      );
      /**
       * Добавляем название города при переходе на маршруты, которые
       * не называются "main" и "cities".
       */
      arr.some(({ name }) => name !== "main" && name !== "cities")
        ? crumbsArr.push(this.getCitySelected.name_loc_choice)
        : crumbsArr;
      this.breadcrumbList = crumbsArr;
    },
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
          city: this.getCitySelected.name_en,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
}

.crumbs {
  display: flex;
  align-items: center;
  max-width: 950px;
  min-width: max-content;
  width: 100%;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  list-style: none;

  & a::first-letter {
    text-transform: capitalize;
  }
  & span::first-letter {
    text-transform: capitalize;
  }
  & > li {
    display: flex;
    flex-wrap: nowrap;
  }

  & a {
    color: #04569c;
  }

  & span {
    color: #9c9c9c;
  }

  & .separator,
  & a {
    margin-right: 8px;
  }
}
</style>
