<template>
  <div class="table-wrapper">
    <div class="table">
      <router-link
        :to="pushNewURL(item.name_en?.toLowerCase())"
        :class="['table-item', { 'empty-cell': !item }]"
        v-for="(item, index) in addEmptyCell"
        :key="`l-${index}`"
      >
        <span>{{ item.name_loc_choice }}</span
        ><span>{{ item.temp }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    itemList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getLocaleURL"]),
    /**
     * Добавляем пустые ячейки в таблицу для установки
     * заданного дизайном форматирования.
     */
    addEmptyCell() {
      const expArr = this.itemList;
      return [...expArr, ...Array(4).fill("")];
    },
  },
  methods: {
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
.table-wrapper {
  padding: 50px 40px 127px 40px;
  background-color: #f0f7fc;
}
.table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  column-gap: 1px;
  background-color: #d6ebff;
}
.table-item {
  display: flex;
  justify-content: space-between;
  padding: 9px 24px 9px 18px;
  background-color: #f0f7fc;
  &.empty-cell {
    padding: 0;
    pointer-events: none;
  }
  & span {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #04569c;
    white-space: nowrap;
    text-transform: capitalize;
  }
  &:hover > span:first-child {
    text-decoration: underline;
  }
}
@media only screen and (max-width: $media-width-2xl) {
  .table-wrapper {
    padding: 30px 10px 108px 10px;
  }
}
</style>
