<template>
  <div class="swiper-content">
    <div
      @mousedown="isMove"
      @mouseup="click(index, $event)"
      @mouseover="hover(index, true)"
      @mouseleave="hover(index, false)"
      :class="['item', { 'days-weekend': day.weekend === true }]"
      v-for="(day, index) in tenDaysTabTable"
      :key="`d-${index}`"
    >
      <div class="days-weekday">
        <div>{{ day.weekday }}</div>
        <div>{{ day.date }}</div>
      </div>
      <div class="days-icon">
        <BaseIcon width="100%" :nameIcon="day.condition" pick="light" />
      </div>
      <div class="days-temp-item"></div>
      <div class="days-wind-descr">
        <div>
          <div>
            <BaseIcon
              width="8"
              nameIcon="wind-direction-blue"
              pick="common"
              :style="windDirection(day.wind, getConstantLocale)"
            />
          </div>
          <span>{{ day.wind.wind_dir[1] }}</span>
        </div>
        <div>{{ day.wind.value }} {{ day.wind.unit }}</div>
      </div>
      <div class="days-pressure">
        {{ day.pressure.value }}
      </div>
      <div class="ten-day-humidity">
        {{ day.humidity.value }}{{ day.humidity.unit }}
      </div>
      <div class="days-chevron-down">
        <BaseIcon width="7" nameIcon="chevron-more-down" pick="common" />
      </div>
    </div>
    <div class="days-charts-temp">
      <ChartsDayList />
    </div>
  </div>
</template>

<script>
import ChartsDayList from "@/components/SVGCharts/day/ChartsDayList.vue";
import { windDirection } from "@/constants/functions";
import { eventBus } from "../main.js";
import { mapGetters } from "vuex";

export default {
  components: {
    ChartsDayList,
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
    ...mapGetters([
      "tenDaysTabTable",
      "getLocaleURL",
      "tenDaysDetailsCard",
      "getConstantLocale",
      "getCitySelected",
      "getCountrySelected",
      "getRegionSelected",
    ]),
  },
  methods: {
    /**
     * Возвращает команду поворота иконки ветра в соответствие с направлением ветра.
     */
    windDirection,
    /**
     * Обработчик вызывается когда нажали кнопку мыши на элементе.
     * Сохраняем в переменную значение координаты Х.
     * @param event Объект события.
     */
    isMove(event) {
      this.mouseStartX = event.x;
    },
    /**
     * Обработчик для перехода по клику  к карточке и
     * графику с подробным прогнозом.
     * @param index Порядковый намер (код) выбранного дня для перехода к карточке и
     * графику с подробным прогнозом.
     * @param event Объект события.
     */
    click(index, event) {
      /**
       * Обработчик вызывается когда отпустили кнопку мыши на элементе.
       * Сначала проверяем не произошло ли изменение координаты Х мыши после нажатия на
       * элемент. Если координата изменилась, то выходим из функции.
       * Если выбран текущий день, то путем изменения URL переходим на вкладку
       * с часовым прогнозом. В остальных случаях
       * переходим  к карточке и графику с подробным прогнозом выбранного дня,
       * путем изменения значения флага isOpen в сторе store.state.datasetsTenDays.
       */
      if (this.mouseStartX !== event.x) return;
      if (index === 0) {
        this.$router
          /**
           * Переходим к новому URL.
           * @param name Строка содержит имя маршрута для роутера.
           * @param lang Текущая локаль берется из стора.
           * @param city Город для которого выводится прогноз погоды берется из стора.
           */
          .push({
            name: "hourly",
            params: {
              lang: this.getLocaleURL,
              city: this.getCitySelected.nameURL,
              country: this.getCountrySelected.nameURL,
              region: this.getRegionSelected.nameURL,
            },
          })
          .catch(() => {});
        /**
         * Убираем подсветку с вкладки "Почасовой прогноз" после перехода.
         */
        eventBus.$emit("highlight", false);
      } else {
        this.$store.dispatch("setCardIndex", { index });
        this.focus();
      }
    },
    /**
     * Подсвечиваем вкладку "Почасовой прогноз" при наведении курсора мыши
     * на первый элемент (тукущий день).
     */
    hover(index, bol) {
      if (index === 0) {
        eventBus.$emit("highlight", bol);
      }
    },
    /**
     * Устанавливаем фокус на выбранный элемент и скролим до него.
     */
    focus() {
      const index = this.tenDaysDetailsCard.findIndex((i) => i.isOpen === true);
      if (index !== -1) {
        this.$router.push({ hash: `#id-${index}` }).catch(() => {});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-container {
  display: flex;
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}
.swiper-content {
  flex: 1 0;
  position: relative;
  display: flex;
  background-color: #ffffff;
  .days-weekend {
    background-color: #f7fafd;

    & .days-weekday > div:first-child {
      color: #ff1616;
    }
  }
  & .item {
    position: relative;
    flex: 1 0;
    min-width: 50px;
    transition: box-shadow 0.5s ease-in-out;
    border-bottom: 1px solid #d8e9f3;
    border-right: 1px solid #d8e9f3;
    &:first-child .days-chevron-down svg {
      transform: rotate(180deg);
    }

    &:nth-last-child(2) {
      border-right: none;
    }

    &:nth-child(n + 12) {
      cursor: auto;
    }

    &:nth-child(n + 12) .days-chevron-down svg {
      display: none;
    }

    &::before {
      position: absolute;
      content: "";
      transition: box-shadow 0.3s ease-in-out;
      height: 100%;
      width: 100%;
      z-index: 10;
    }

    & > div {
      border-bottom: 1px solid #d8e9f3;
      position: relative;

      &:last-child,
      &:nth-child(2) {
        border-bottom: none;
      }
    }
  }
}
@media (hover: hover) and (pointer: fine) {
  .item:nth-child(-n + 11):hover::before {
    box-shadow: inset 0 0 0 3px #d2e7ff;
    border-radius: 1px;
  }

  .item:nth-child(-n + 11):hover {
    cursor: pointer;
    & .days-chevron-down svg {
      transform: scale(2);
    }
    &:first-child .days-chevron-down svg {
      transform: rotate(180deg) scale(2);
    }
  }
}
.days-temp-item {
  height: 190px;
}
.days-weekday {
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
}
.days-weekday > div {
  text-align: center;
}
.days-weekday > div:first-child {
  text-transform: uppercase;
  font-size: 16px;
  line-height: 21px;
}
.days-icon {
  margin: 0 auto;
  margin-top: 5px;
  height: 82px;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.days-charts-temp {
  height: 170px;
  position: absolute;
  top: 154px;
  width: 100%;
  cursor: pointer;
}
.days-wind-descr {
  height: 53px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #333333;

  & span {
    text-transform: uppercase;
    padding-left: 1px;
  }

  & > div:first-child {
    display: flex;
    column-gap: 3px;
  }
}
.days-pressure,
.ten-day-humidity {
  height: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #333333;
}
.days-chevron-down {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 22px;

  & svg {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
