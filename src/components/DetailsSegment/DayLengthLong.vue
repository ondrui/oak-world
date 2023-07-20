<template>
  <div class="day-length-block">
    <div v-show="isShowSunrise" class="time">{{ value.dayLength.sunrise }}</div>
    <div v-show="isShowSunrise" class="icon">
      <BaseIcon nameIcon="sunrise-1" pick="common" width="20" />
    </div>
    <div v-show="isShowLine" class="line"></div>
    <div v-show="isShowDayLength" class="day-length">
      {{
        value.dayLength.daytime.value ??
        getConstantLocale("polar", value.dayLength?.polar)
      }}
    </div>
    <div v-show="isShowLine" class="line"></div>
    <div v-show="isShowSunset" class="icon">
      <BaseIcon nameIcon="sunset-1" pick="common" width="20" />
    </div>
    <div v-show="isShowSunset" class="time">{{ value.dayLength.sunset }}</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
/**
 * Блок восход/закат солнца для широкой карточки.
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
      return !!(
        this.value.dayLength.daytime.value || this.value.dayLength.polar
      );
    },
    /**
     * Условие отображения иконки и времени захода солнца.
     */
    isShowSunset() {
      return !!this.value.dayLength.sunset;
    },
    /**
     * Условие отображения линии.
     */
    isShowLine() {
      return this.value.dayLength.polar !== "night";
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
  align-items: center;
  justify-content: center;
  padding-top: 2px;
  min-height: 22px;
}
.time {
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;

  color: #4d4d4d;
}
.line {
  flex-grow: 1;
  width: 1px;
  border-bottom: 1px dashed #8797a5;
}
.icon {
  display: flex;
  align-items: center;
  padding: 0 4px;
}
.day-length {
  padding: 0 4px;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #4d4d4d;
}
</style>
