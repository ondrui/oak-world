<template>
  <div @mousedown="isMove" @mouseup="go" class="card-link">
    <div class="card-left-side">
      <div class="card-title">
        <div class="card-title-marker">
          <BaseIcon nameIcon="map-marker" pick="common" width="8" />
        </div>
        <div class="card-title-text">
          <span>{{ itemDataset.name_loc_choice }}</span>
        </div>
        <div class="card-title-arrow">
          <BaseIcon
            nameIcon="arrow-right"
            pick="common"
            width="9"
            fill="#04569c"
            fill-opacity="1"
          />
        </div>
      </div>
      <div class="card-value">
        <span>{{ itemDataset.now.temp }}C</span>
      </div>
    </div>
    <div class="card-right-side">
      <BaseIcon width="40" :nameIcon="itemDataset.now.condition" pick="light" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    /**
     * Объект содержит данные для отображения в карточке.
     */
    itemDataset: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      /**
       * Сохраняем в переменную значение координаты Х мышки при нажатии на элемент.
       */
      mouseStartX: 0,
    };
  },
  computed: {
    ...mapGetters(["getLocaleURL"]),
  },
  methods: {
    /**
     * Обработчик вызывается когда нажали кнопку мыши на элементе.
     * Сохраняем в переменную значение координаты Х.
     * @param event Объект события.
     */
    isMove(event) {
      this.mouseStartX = event.x;
    },
    /**
     * Обработчик для осуществления маршрутизации на страницу с почасовым прогнозом
     * для выбранного города.
     * @param event Объект события.
     */
    go(event) {
      /**
       * Обработчик вызывается когда отпустили кнопку мыши на элементе.
       * Сначала проверяем не произошло ли изменение координаты Х мыши после нажатия на
       * элемент. Если координата изменилась, то выходим из функции.
       * Переходим к новому URL.
       * @param name Строка содержит имя маршрута для роутера.
       * @param lang Текущая локаль берется из стора.
       * @param city Город для которого выводится прогноз погоды при клике на карточку.
       * @param hash #top вызываем плавную прокрутку в начало страницы.
       */
      if (this.mouseStartX !== event.x) return;
      this.$router
        .push({
          name: "hourly",
          params: {
            lang: this.getLocaleURL,
            city: this.itemDataset.name_en.toLowerCase(),
          },
          hash: "#top",
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.card-link {
  display: flex;
  text-decoration: none;
  background-color: #ffffff;
  height: 70px;
  cursor: pointer;
  padding: 9px 16px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  width: 100%;
  transition: 200ms box-shadow ease-in-out;
  &:hover {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.31);
    .card-title-text span {
      color: #0bc2ff;
    }
    .card-title-arrow svg {
      fill: #0bc2ff;
    }
    .card-title-marker svg :deep(path) {
      stroke: #0bc2ff;
    }
    .card-title-marker svg :deep(circle) {
      fill: #0bc2ff;
    }
  }
}
.card-left-side {
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 6px;
}
.card-title {
  display: flex;
  column-gap: 6px;
}
.card-title-marker {
  display: flex;
  & svg,
  & svg :deep(path),
  & svg :deep(circle) {
    transition: 200ms all ease-in-out;
  }
}
.card-title-arrow {
  width: 24px;
  height: 16px;
  margin-left: 4px;
  display: flex;
  justify-content: center;
  align-self: center;
  background: #f0f7fc;
  border-radius: 8px;
  & svg {
    transition: 200ms all ease-in-out;
  }
}
.card-title-text span {
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #04569c;
  text-transform: capitalize;
  transition: 200ms all ease-in-out;
}
.card-value span {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  color: #333333;
}
.card-right-side {
  display: flex;
}
</style>
