<template>
  <div @mousedown="isMove" @mouseup="go" class="card-link">
    <div class="card-top">
      <div class="card-top-marker">
        <BaseIcon nameIcon="map-marker" pick="common" width="9" />
      </div>
      <div class="card-top-text">
        <span>{{ itemDataset.name_loc_choice }}</span>
      </div>
      <div class="card-top-arrow">
        <span>{{ getConstantLocale("LinkTitleCardCity") }}</span>
        <BaseIcon
          nameIcon="arrow-right"
          pick="common"
          width="9"
          fill="#04569c"
          fill-opacity="1"
        />
      </div>
    </div>
    <div class="card-middle">
      <div class="card-icon">
        <BaseIcon
          :nameIcon="itemDataset.now.condition"
          pick="light"
          width="50"
        />
      </div>
      <div class="card-middle-temp">{{ itemDataset.now.temp }}</div>
      <div class="card-middle-descr">
        <div class="card-middle-text">{{ itemDataset.now.condition_s }}</div>
        <div class="card-middle-feeling">
          {{ getConstantLocale("currentBlock", "feelsLike") }}
          {{ itemDataset.now.feels_like }}
        </div>
      </div>
    </div>
    <div class="card-bottom">
      <div
        v-for="(item, index) in itemDataset.details"
        :key="`i-${index}`"
        class="card-bottom-item"
      >
        <div class="item-text">
          <span>{{ item.name }}</span>
        </div>
        <div class="item-block">
          <div class="item-block-icon">
            <BaseIcon :nameIcon="item.condition" pick="light" width="34" />
          </div>
          <div class="item-block-temp">
            <span>
              {{ item.temp }}
            </span>
          </div>
        </div>
      </div>
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
    ...mapGetters(["getLocaleURL", "getConstantLocale"]),
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
            city: this.itemDataset.nameURL,
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
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  background-color: #ffffff;
  cursor: pointer;
  padding: 16px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  width: 100%;
  transition: 200ms all ease-in-out;
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
  margin-left: auto;
  display: flex;
  column-gap: 10px;
  padding: 2px 8px;
  background: #f0f7fc;
  border-radius: 8px;
  & svg {
    transition: 200ms all ease-in-out;
  }
  & span {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #04569c;
    transition: 200ms all ease-in-out;
  }
}
.card-top-text {
  display: flex;
  & span {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #04569c;
    text-transform: capitalize;
    transition: 200ms all ease-in-out;
  }
}
.card-middle {
  display: flex;
  align-items: center;
  min-height: 86px;
  & .card-icon {
    display: flex;
  }

  & .card-middle-temp {
    font-weight: 500;
    font-size: 30px;
    line-height: 33px;
    color: #333333;
    padding-left: 6px;
  }

  & .card-middle-descr {
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 4px;
    padding-top: 6px;
    padding-left: 8px;

    & .card-middle-text {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      color: #000000;
    }

    & .card-middle-text::first-letter {
      text-transform: capitalize;
    }

    & .card-middle-feeling {
      white-space: nowrap;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #9f9f9f;
    }

    & .card-middle-feeling::first-letter {
      text-transform: capitalize;
    }
  }
}
.card-bottom {
  display: flex;
  justify-content: space-between;
}
.card-bottom-item {
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  & .item-text {
    display: flex;
    align-self: center;
    & span {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      text-align: center;
      color: rgba(0, 0, 0, 0.4);
      text-transform: capitalize;
    }
  }
  & .item-block {
    display: flex;
    align-items: center;
    column-gap: 6px;
    & .item-block-icon {
      display: flex;
    }
    & .item-block-temp span {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #333333;
    }
  }
}
</style>
