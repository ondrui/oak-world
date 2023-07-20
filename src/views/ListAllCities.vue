<template>
  <div class="cities">
    <div class="cities-sticky">
      <div class="cities-select">
        <span>{{ getConstantLocale("listAllCities")[0] }}: </span>
        <select name="" id="" v-model="selected">
          <option value="all">
            {{ getConstantLocale("listAllCities")[1] }}
          </option>
          <option
            :value="item"
            v-for="(item, index) in getListArea"
            :key="`opt-${index}`"
          >
            {{ item }}
          </option>
        </select>
      </div>
      <div class="cities-abc">
        <button
          @click="scrollToLetter"
          :data-name="item"
          class="cities-abc-item"
          v-for="(item, index) in getABC"
          :key="`i-${index}`"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <div class="cities-table">
      <div
        class="cities-table-block"
        v-for="(item, index) in getABC"
        :key="`b-${index}`"
      >
        <h2 :data-letter="item">{{ item }}</h2>
        <div class="cities-table-list">
          <router-link
            :to="pushNewURL(value?.name_en)"
            :class="[
              'cities-table-item',
              { 'empty-cell': !value },
              { 'hidden-gap': formatedListCities(item).hiddenGap },
            ]"
            v-for="(value, index) in formatedListCities(item).list"
            :key="`city-${index}`"
          >
            <div>
              {{ value.name_loc_choice }}
            </div>
            <div>
              {{ value.area_f }}
              {{ value.area_l5_f }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { cityIn } from "lvovich";

export default {
  name: "ListAllCities",
  /**
   * Параметр компонента, который содержит всю информацию,
   * которая преобразуется в различные метатеги и атрибуты страницы.
   * Добавляет информацию в тег <title>
   * Добавляет на страницу метатег <meta> с атрибутом name и keywords.
   * Добавляет на страницу метатег <meta> с атрибутом name и description.
   */
  head() {
    const country = cityIn(this.getCountryNameLoc);
    return {
      title: this.getConstantLocale("cities", "title").replace(
        "$_country",
        country
      ),
      meta: [
        {
          name: "description",
          content: this.getConstantLocale("cities", "description").replace(
            "$_country",
            country
          ),
        },
        {
          name: "keywords",
          content: this.getConstantLocale("cities", "keywords").replace(
            "$_country",
            country
          ),
        },
      ],
    };
  },
  data() {
    return {
      /**
       * Свойство selected - значением является название области из селекта.
       * all - показать все города.
       */
      selected: "all",
    };
  },
  watch: {
    /**
     * При изменении локали сбрасываем фильтрацию по области.
     */
    getLocale() {
      this.selected = "all";
    },
  },
  /**
   * При обновлении компоненты вызываем прокрутку страницы до заданной координаты.
   */
  updated() {
    this.scrollSel();
  },
  computed: {
    ...mapGetters([
      "getListArea",
      "getLocaleURL",
      "getConstantLocale",
      "getLocale",
      "getCountryNameLoc",
    ]),
    getGroupListAllCities() {
      /**
       * В геттер передаем значение свойства selected.
       * Для фильтрации городов по области.
       */
      return this.$store.getters.getGroupListAllCities(this.selected);
    },
    /**
     * Возвращает массив букв сгруппированных городов по первой букве.
     */
    getABC() {
      return Object.keys(this.getGroupListAllCities);
    },
  },
  methods: {
    /**
     * Вызывает плавную прокрутку страницы до заданной координаты.
     */
    scrollSel() {
      window.scroll({
        top: 364,
        behavior: "smooth",
      });
    },
    /**
     * Вызывает плавную прокрутку страницы до выбранной буквы
     * при клике на букву.
     */
    scrollToLetter(event) {
      const el = document.querySelector(
        `[data-letter=${event.target.dataset.name}]`
      );
      el.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    },
    /**
     * Добавляем пустые ячейки в таблицу для установки
     * заданного дизайном форматирования.
     */
    formatedListCities(item) {
      const expArr = this.getGroupListAllCities[item];
      return {
        list: [...expArr, ...Array(2).fill("")],
        hiddenGap: expArr.length < 2,
      };
    },
    /**
     * Функция возвращает объект описывающий маршрут перехода на новый URL.
     * Переход происходит при условии передачи в функцию название города.
     * @param name Строка содержит имя маршрута для роутера.
     * @param lang Текущая локаль берется из стора.
     * @param city Город для которого выводится прогноз погоды берется из стора.
     * @param hash #top вызываем плавную прокрутку в начало страницы.
     */
    pushNewURL(city) {
      return city
        ? {
            name: "hourly",
            params: {
              lang: this.getLocaleURL,
              city,
            },
            hash: "#top",
          }
        : "";
    },
  },
};
</script>

<style lang="scss" scoped>
/* remove the original arrow */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -o-appearance: none;
  appearance: none;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #04569c;
  min-width: 264px;
  padding: 8px 0 8px 14px;
  border: 1px solid #b2d3e8;
  border-radius: 4px;
  background: url(@/assets/images/common/triangle-select.svg?external) no-repeat
    right #f0f7fc;
  background-position-x: calc(100% - 12px);
}
.cities-sticky {
  position: sticky;
  top: 0;
  background-color: #fff;
  padding: 20px 30px;
}
.cities-select {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;
  & span {
    margin-right: 16px;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #9c9c9c;
    text-transform: capitalize;
  }
}
.cities-abc {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  column-gap: 10px;
  row-gap: 12px;
  margin-bottom: 50px;
  & button {
    background: #f0f7fc;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    color: #04569c;
    &:hover {
      background: #e1ecf9;
    }
  }
}
.cities-table {
  padding: 0 30px;
}
.cities-table-block {
  margin-bottom: 20px;
  & h2 {
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
    color: #000000;
    margin-bottom: 18px;
  }
}
.cities-table-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  column-gap: 1px;
  background-color: #d6ebff;
  margin-left: -20px;
  & a {
    text-decoration: none;
  }
  // justify-content: space-between;
}
.cities-table-item {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 0 20px 16px 16px;
  background-color: #fff;
  &.empty-cell {
    padding: 0;
    pointer-events: none;
    display: block;
    &.hidden-gap {
      width: calc(100% + 1px);
    }
  }
  & div:first-child {
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    color: #04569c;
    &::first-letter {
      text-transform: capitalize;
    }
  }
  & div:nth-child(2) {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #9c9c9c;
    white-space: nowrap;
    &::first-letter {
      text-transform: capitalize;
    }
  }
}
@media only screen and (max-width: $media-width-lg),
  only screen and (orientation: landscape) {
  .cities-abc {
    margin-bottom: 10px;
  }
  .cities-select {
    margin-bottom: 20px;
  }
}
@media only screen and (max-width: $media-width-sm) {
  .cities-sticky {
    padding: 20px 10px;
  }
  .cities-abc {
    & button {
      font-size: 16px;
      line-height: 19px;
    }
  }
  .cities-table {
    padding: 0 10px;
  }
  .cities-table-item {
    & div:first-child {
      font-size: 16px;
      line-height: 18px;
    }
    & div:nth-child(2) {
      font-size: 13px;
      line-height: 15px;
    }
  }
}
</style>
