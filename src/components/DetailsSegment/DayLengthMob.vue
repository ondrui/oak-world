<template>
  <div class="day-length-block">
    <div>
      <div v-show="isShowPolar">
        <BaseIcon :nameIcon="namePolarIcon" pick="common" width="20" />
        <div class="polar-text">
          {{ getConstantLocale("polar", value.dayLength?.polar) }}
        </div>
      </div>
      <div v-show="isShowSunrise">
        <BaseIcon nameIcon="sunrise-1" pick="common" width="20" />
        {{ value.dayLength.sunrise }}
      </div>
      <div v-show="isShowSunset">
        <BaseIcon nameIcon="sunset-1" pick="common" width="20" />
        {{ value.dayLength.sunset }}
      </div>
    </div>
    <div v-show="isShowDayLength">
      <span>{{ value.dayLength.daytime.title }}:</span>&nbsp;{{
        value.dayLength.daytime.value_mob
      }}
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
/**
 * Блок восход/закат солнца для карточки под мобильную версию.
 */
export default {
  props: ["value"],
  computed: {
    ...mapGetters(["getConstantLocale"]),
    /**
     * Условие отображения иконки и времени восхода солнца.
     */
    isShowSunrise() {
      return !!this.value.dayLength.sunrise;
    },
    /**
     * Условие отображения строки с продолжительностью дня.
     */
    isShowDayLength() {
      return !!this.value.dayLength.daytime.value;
    },
    /**
     * Условие отображения иконки и времени захода солнца.
     */
    isShowSunset() {
      return !!this.value.dayLength.sunset;
    },
    /**
     * Условие отображения блока полярного дня или ночи.
     */
    isShowPolar() {
      return !!this.value.dayLength.polar;
    },
    /**
     * Условие отображения иконки полярного дня или ночи.
     */
    namePolarIcon() {
      return this.value.dayLength.polar === "day" ? "sun-1" : "moon-1";
    },
  },
};
</script>
<style lang="scss" scoped>
svg {
  display: block;
}
.day-length-block {
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  white-space: nowrap;
  color: #333333;

  & > div:first-child {
    min-width: 102px;
    display: flex;
    column-gap: 6px;

    & > div {
      display: flex;
      align-items: center;
      column-gap: 4px;
    }
  }

  & span {
    display: inline-block;
    font-size: 10px;
    line-height: 12px;
    color: #9c9c9c;

    &::first-letter {
      text-transform: capitalize;
    }
  }
}
.polar-text::first-letter {
  text-transform: capitalize;
}
@media only screen and (max-width: $media-width-lg) {
  .day-length-block span {
    font-size: 14px;
    line-height: 16px;
  }
}
</style>
