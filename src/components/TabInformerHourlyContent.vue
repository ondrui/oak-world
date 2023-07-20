<template>
  <div class="swiper-content">
    <div class="hourly-charts-temp">
      <ChartHourlyTempList :datasets="datasetsForHourlyCharts" />
    </div>
    <div
      class="date-container"
      v-for="(date, indexParent) in hourlyTabTable"
      :key="`d-${indexParent}`"
    >
      <div class="day-length-chart">
        <DayLengthChart :datasets="date" />
      </div>
      <div class="date-header">
        <div class="date-text">
          <span
            ><b>{{ date.date[0] }}</b></span
          >
          <span>&nbsp; {{ date.date[1] }}</span>
        </div>
      </div>
      <div class="hourly-data-container">
        <div
          class="item"
          v-for="(value, index) in date.values"
          :key="`h-${index}`"
        >
          <div class="time">{{ value.hour }}</div>
          <div class="day-length"></div>
          <div class="hourly-icon">
            <BaseIcon
              width="34"
              :nameIcon="value.condition"
              :pick="value.light"
            />
          </div>
          <div class="hourly-temp-item"></div>
          <div class="hourly-wind-descr">
            <div>
              <div>
                <BaseIcon
                  width="8"
                  nameIcon="wind-direction-blue"
                  pick="common"
                  :style="windDirection(value, getConstantLocale)"
                />
              </div>
              <span>{{ value.wind_dir[1] }}</span>
            </div>
            <div>{{ value.wind_speed }}</div>
          </div>
          <div class="hourly-pressure">
            {{ value.pressure }}
          </div>
          <div class="hourly-day-humidity">
            {{ value.humidity }}{{ value.humidity.unit }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartHourlyTempList from "@/components/SVGCharts/hourly/ChartHourlyTempList.vue";
import DayLengthChart from "@/components/SVGCharts/hourly/DayLengthChart.vue";
import { windDirection } from "@/constants/functions";
import { mapGetters } from "vuex";

export default {
  components: {
    ChartHourlyTempList,
    DayLengthChart,
  },
  computed: {
    ...mapGetters([
      "datasetsForHourlyCharts",
      "hourlyTabTable",
      "getConstantLocale",
    ]),
  },
  methods: {
    /**
     * Возвращает команду поворота иконки ветра в соответствие с направлением ветра.
     */
    windDirection,
  },
};
</script>

<style lang="scss" scoped>
.swiper-content {
  display: flex;
  position: relative;
}
.date-container {
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #d8e9f3;
}
.date-text {
  position: sticky;
  left: 0;
  top: 0;
  display: inline;
  padding: 0 13px;
}
.date-header {
  white-space: nowrap;
  padding: 9px 0;
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  color: #333333;

  &::first-letter {
    text-transform: capitalize;
  }
}
.date-container:last-child .date-header {
  border-right: none;
}
.hourly-data-container {
  display: flex;

  & .item {
    border-top: 1px solid #d8e9f3;
    border-bottom: 1px solid #d8e9f3;
    border-right: 1px solid #d8e9f3;

    &:last-child {
      border-right: none;
    }
    width: 56px;
    & > div {
      border-bottom: 1px solid #d8e9f3;
      position: relative;

      &:last-child,
      &:nth-child(2),
      &:nth-child(3) {
        border-bottom: none;
      }
    }
  }
}
.date-container:last-child,
.date-container:last-child .item:last-child {
  border-right: none;
}
.date-container .item:first-child {
  border-left: none;
}
.time {
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  color: #333333;
}
.day-length {
  height: 30px;
}
.hourly-temp-item {
  height: 190px;
}
.hourly-icon {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  height: 70px;
  align-items: center;
}
.hourly-charts-temp {
  position: absolute;
  top: 175px;
  width: 100%;
  height: 170px;
  z-index: 10;
}
.day-length-chart {
  position: absolute;
  top: 68px;
  width: 100%;
  height: 30px;
  z-index: 10;
}
.hourly-wind-descr {
  height: 53px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
.hourly-pressure,
.hourly-day-humidity {
  height: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #333333;
}
</style>
