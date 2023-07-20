<template>
  <div @mousedown="isMove" @mouseup="go" class="card-link">
    <div class="card-top">
      <div class="card-top-marker">
        <BaseIcon nameIcon="map-marker" pick="common" width="8" />
      </div>
      <div class="card-top-text">
        <span>{{ itemDataset.name_loc_choice }}</span>
      </div>
      <div class="card-top-arrow">
        <BaseIcon
          nameIcon="arrow-right"
          pick="common"
          width="9"
          fill="#04569c"
          fill-opacity="1"
        />
      </div>
    </div>
    <div class="card-temp">
      <span>{{ itemDataset.now.temp }}C</span>
    </div>
    <div class="card-icon">
      <BaseIcon :nameIcon="itemDataset.now.condition" pick="light" />
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
  display: grid;
  grid-template-areas:
    "top icon"
    "temp icon";
  row-gap: 3px;
  height: 70px;
  min-width: 210px;
  text-decoration: none;
  background-color: #ffffff;
  cursor: pointer;
  padding: 10px 16px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  width: 100%;
  transition: 200ms box-shadow ease-in-out;
  &:hover {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.31);
    .card-top-text span,
    .card-top-arrow span {
      color: #0bc2ff;
    }
    .card-top-arrow svg {
      fill: #0bc2ff;
    }
    .card-top-marker svg :deep(path) {
      stroke: #0bc2ff;
    }
    .card-top-marker svg :deep(circle) {
      fill: #0bc2ff;
    }
  }
}
.card-top {
  grid-area: top;
  display: flex;
  align-items: center;
  column-gap: 6px;
}
.card-top-marker {
  display: flex;
  & svg,
  & svg :deep(path),
  & svg :deep(circle) {
    transition: 200ms all ease-in-out;
  }
}
.card-top-arrow {
  width: 24px;
  height: 14px;
  margin-left: 4px;
  display: flex;
  justify-content: center;
  background: #f0f7fc;
  border-radius: 8px;
  & svg {
    transition: 200ms all ease-in-out;
  }
}
.card-top-text {
  display: flex;
  & span {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #04569c;
    text-transform: capitalize;
    transition: 200ms all ease-in-out;
  }
}
.card-temp {
  grid-area: temp;
  align-self: center;
  & span {
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
    color: #333333;
  }
}
.card-icon {
  grid-area: icon;
  justify-self: end;
  width: 40px;
  & svg {
    width: 100%;
  }
}
@media only screen and (max-width: $media-width-lg) {
  .card-link {
    min-width: 180px;
    padding: 4px 12px;
    grid-template-areas:
      "top top"
      "temp icon";
  }
  .card-icon {
    justify-self: center;
    width: 34px;
  }
}
</style>
