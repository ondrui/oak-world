<template>
  <div>
    <div class="forecast-details-container">
      <RowCaptionInformer class="temp">
        {{ getConstantLocale("climateIndicators", "temp") }} /
        {{ getConstantLocale("currentBlock", "feelsLike") }}
      </RowCaptionInformer>
      <RowCaptionInformer class="wind">
        {{ getConstantLocale("climateIndicators", "windDirSpeed") }}
      </RowCaptionInformer>
      <RowCaptionInformer class="pressure">
        {{ getConstantLocale("climateIndicators", "pressure") }},
        {{ getConstantLocale("units", "pressure")[0] }}
      </RowCaptionInformer>
      <RowCaptionInformer class="humidity">
        {{ getConstantLocale("climateIndicators", "humidity") }}
      </RowCaptionInformer>
      <div class="details-charts-temp">
        <ChartDetailsTemp :datasetChart="datasetChart" />
      </div>
      <div
        class="details-item"
        v-for="(value, index) in datasetChart"
        :key="`th-${index}`"
      >
        <div class="time">{{ value.hour }}</div>
        <div class="details-icon">
          <BaseIcon
            width="40"
            :nameIcon="value.condition"
            :pick="value.light"
          />
        </div>
        <div class="details-temp-item"></div>
        <div class="details-wind-descr">
          <div>
            <div>
              <BaseIcon
                width="8"
                nameIcon="wind-direction-blue"
                pick="common"
                :style="windDirection(value.wind, getConstantLocale)"
              />
            </div>
            <span>{{ value.wind.wind_dir[1] }}</span>
          </div>
          <div>{{ value.wind.value }} {{ value.wind.unit }}</div>
        </div>
        <div class="details-pressure">
          {{ value.pressure.value }}
        </div>
        <div class="details-day-humidity">
          {{ value.humidity.value }}{{ value.humidity.unit }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartDetailsTemp from "@/components/SVGCharts/day-details/ChartDetailsTemp.vue";
import RowCaptionInformer from "@/components/RowCaptionInformer.vue";
import { windDirection } from "@/constants/functions";
import { mapGetters } from "vuex";

export default {
  components: {
    ChartDetailsTemp,
    RowCaptionInformer,
  },
  /**
   * Масив с данными для отображения графика.
   */
  props: { datasetChart: Array },
  computed: {
    ...mapGetters(["getConstantLocale"]),
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
.forecast-details-container {
  position: relative;
  display: grid;
  background-color: #ffffff;
  max-width: 100%;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  padding-top: 2px;
  border: 1px solid #d8e9f3;
  border-top: none;
  border-bottom: none;
}
.details-item {
  border-top: 1px solid #d8e9f3;
  border-bottom: 1px solid #d8e9f3;
  border-right: 1px solid #d8e9f3;

  &:last-child {
    border-right: none;
  }

  & > div {
    // flex: 1;
    border-bottom: 1px solid #d8e9f3;
    position: relative;

    &:last-child,
    &:nth-child(2) {
      border-bottom: none;
    }
  }
}
.time {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  color: #333333;
  height: 33px;
}
.details-temp-item {
  height: 176px;
}
.details-precip-item {
  height: 60px;
}
.details-icon {
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}
.temp {
  top: 100px;
}
.wind {
  top: 282px;
}
.pressure {
  top: 335px;
}
.humidity {
  top: 371px;
}
.details-charts-temp {
  position: absolute;
  top: 116px;
  width: 100%;
  height: 156px;
  z-index: 10;
}
.details-charts-precip {
  position: absolute;
  top: 324px;
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 60px;
  z-index: 10;
  opacity: 0.6;
}
.details-wind-descr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 53px;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #333333;

  & span {
    padding-left: 1px;
    text-transform: uppercase;
  }

  & > div:first-child {
    display: flex;
    column-gap: 3px;
  }
}
.details-pressure,
.details-day-humidity {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 36px;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #333333;
}

@media only screen and (max-width: $media-width-lg) {
  .forecast-details-container {
    padding-top: 0;
    border-top: none;
  }
  .details-item {
    border-top: none;
  }
  .details-icon {
    height: 72px;
  }
}
</style>
