import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {
  SET_DATA_FORECAST,
  setDataForecast,
  SET_DATA_API,
  setDataAPI,
  CHANGE_OPENING_CARD,
  changeOpeningCard,
  SET_LIST_CITIES,
  setListCities,
  SET_MAP_DATA,
  setMapDataset,
  SET_HISTORY_DATA,
  setHistoryDataset,
  SET_POP_CITIES_DATA,
  setPopCitiesData,
  SET_LIST_TOP_CITIES,
  setListTopCities,
  SET_LIST_REGIONS,
  setListRegions,
  SET_CONSTANTS,
  setConstants,
  SET_CITY,
  setCity,
  SET_LOCALE,
  setLocale,
  SET_SUPPORTED_LOCALES,
  setSupportedLocales,
  SET_LIST_COUNTRIES,
  setListCountries,
  LOADING,
  loading,
  INIT_COMMIT,
  initCommit,
} from "./mutations";
/**
 * Вспомогательные функции.
 */
import {
  setTimeFormat,
  daytime,
  addPlus,
  choiceAreaByLocale,
  choiceNameByLocale,
} from "@/constants/functions";
/**
 * Day.js is a minimalist JavaScript library that parses, validates, manipulates, and
 * displays dates and times for modern browsers with a largely Moment.js-compatible API.
 */
import dayjs from "dayjs";
import "dayjs/locale/hy-am";
/**
 * Устанавливаем армянский язык для библиотеки dayjs.
 */
dayjs.locale("hy-am");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * Свойство определяет текущую языковую локаль.
     * Значение по умолчанию undefined.
     */
    currentLocale: undefined,
    /**
     * Массив с поддерживаемыми языками.
     */
    supportedLocales: [],
    /**
     * Устанавливаем язык по умолчанию.
     */
    defaultLocale: "ru",
    /**
     * Объект с переводами.
     */
    translatedConstants: {},
    /**
     * Устанавливаем город по умолчанию.
     */
    defaultCity: {
      lon: 37.6174943,
      lat: 55.7504461,
      country_ru: "Россия",
      country_en: "Russia",
      country_loc: "Россия",
      region_ru: "Москва",
      region_en: "Moscow",
      region_loc: "Москва",
      name_ru: "Москва__Центральный административный округ",
      name_en: "Moscow__Central Administrative Okrug",
      name_loc: "Москва__Центральный административный округ",
    },
    /**
     * Город для которого выводится прогноз погоды.
     */
    currentCity: null,
    /**
     * Блок информации о населённом пункте.
     */
    infoCity: null,
    /**
     * Лоадер.
     */
    loading: false,
    /**
     * Флаг состояния  первоначальной загрузки данных с сервера.
     */
    isDataLoad: false,
    /**
     * Объект с фактическими погодными данными, которые приходят с сервера.
     */
    datasetsFact: {},
    /**
     * Объект с данными для отображения почасового прогноза.
     */
    datasetsHourly: {},
    /**
     * Объект с данными для отображения прогноза на 10-14 дней.
     */
    datasetsTenDays: {},
    /**
     * Объект с данными для отображения подробного прогноза на 10 дней с
     * разбивкой по 3 часа.
     */
    datasetsThreeHour: {},
    /**
     * Данные со стороннего API.
     */
    dataFromAPI: {},
    /**
     * Настройки для отображения температурных графиков, а также
     * корректировки и выравнивания прогнозных и фактических
     * данных.
     * @property periodAdjusted - количество интервалов в которые будут
     * внесены корректировки.
     * @property func - функция согласно которой будут корректироваться
     * данные.
     * @property Variable - Погодная переменная для отображения на графике.
     */
    chartSettings: [
      {
        title: "linear_0",
        variable: "temp",
        periodAdjusted: 0,
        func: (periodAdjusted, diffTime, index) =>
          (periodAdjusted - diffTime - index - 1) / (periodAdjusted - 1),
      },
      {
        title: "linear_6",
        variable: "temp",
        periodAdjusted: 6,
        func: (periodAdjusted, diffTime, index) =>
          (periodAdjusted - diffTime - index - 1) / (periodAdjusted - 1),
      },
      // {
      //   title: "linear_tmax",
      //   variable: "temp_max",
      //   periodAdjusted: 0,
      //   func: (periodAdjusted, diffTime, index) =>
      //     (periodAdjusted - diffTime - index - 1) / (periodAdjusted - 1),
      // },
      // {
      //   title: "linear_tmin",
      //   variable: "temp_min",
      //   periodAdjusted: 0,
      //   func: (periodAdjusted, diffTime, index) =>
      //     (periodAdjusted - diffTime - index - 1) / (periodAdjusted - 1),
      // },
      // {
      //   title: "linear_8",
      // variable: "temp",
      //   periodAdjusted: 8,
      //   func: (periodAdjusted, diffTime, index) =>
      //     (periodAdjusted - diffTime - index - 1) / (periodAdjusted - 1),
      // },
      // {
      //   title: "exp_12",
      //   variable: "temp",
      //   periodAdjusted: 12,
      //   func: (periodAdjusted, diffTime, index) => 1 / Math.exp(index),
      // },
    ],
    /**
     * Данные для карточек на карте.
     */
    datasetsMap: [],
    /**
     * Массив объектов с данными для карточек
     * в секции "ИСТОРИЯ ПРОСМОТРОВ".
     */
    datasetsHistory: [],
    /**
     * Массив объектов с данными для карточек
     * в секции "ПОПУЛЯРНЫЕ ГОРОДА МИРА".
     */
    datasetsPopCities: [],
    /**
     * Объект со странами и городами.
     */
    listCountries: null,
    /**
     * Массив объектов список популярных городов всех стран.
     */
    listTopCities: [],
    /**
     * Cписок регионов страны + популярные городы регионов.
     */
    listRegions: null,
    /**
     * Список городов для выбранной страны и опционально выбранного региона.
     */
    listCities: null,
  },
  getters: {
    /**
     * Возвращает языковую метку.
     * @param state Текущее состояние store.
     * @example
     * "ru"
     */
    getLocale(state) {
      return state.currentLocale;
    },
    /**
     * Возвращает языковую метку по умолчанию.
     * @param state Текущее состояние store.
     * @example
     * "ru"
     */
    getDefaultLocale(state) {
      return state.defaultLocale;
    },
    /**
     * Возвращает языковую метку для отображения ее в URL.
     * Дефолтный язык в URL не отображаем.
     * @param state Текущее состояние store.
     * @example
     * "en"
     */
    getLocaleURL(state) {
      return state.currentLocale === state.defaultLocale
        ? undefined
        : state.currentLocale;
    },
    /**
     * Возвращает массив с поддерживаемыми языками в требуемом для
     * отображения в переключателе языков порядке.
     * Выбранный язык всегда первый элемент массива.
     * Используется на странице в переключателе языков.
     * @param state Текущее состояние store.
     * @param getLocale Текущий язык.
     * @param locale .
     */
    SupportedLocalesForSwitcher(state, { getLocale }) {
      const filtred = state.supportedLocales.filter(
        ({ key }) => key !== getLocale
      );
      const found = state.supportedLocales.find(({ key }) => key === getLocale);
      filtred.unshift(found);
      return filtred;
    },
    /**
     * Возвращает зодонную параметрами языковую константу.
     * Объект с переводами может содержать вложенные объекты и
     * массивы.
     * @param translatedConstants Объект с переводами.
     * @param key Ключи верхнего уровня из объекта с переводами.
     * @param nestedKey Ключи вложенного уровня из объекта с переводами.
     */
    getConstantLocale:
      ({ translatedConstants }) =>
      (key, nestedKey) => {
        return key !== undefined && nestedKey !== undefined
          ? translatedConstants[key][nestedKey]
          : key !== undefined
          ? translatedConstants[key]
          : (console.log(
              "Не найден ключ и/или имя параметра в языковых константах!"
            ),
            undefined);
      },
    /**
     * Возвращает состояние лоадера загрузки.
     * @param state Текущее состояние store.
     */
    loading(state) {
      return state.loading;
    },
    /**
     * Возвращает название страны.
     * @param currentCity Текущее значение store.currentCity.
     * @example
     * {
     *    nameURL:"Russia",
     *    nameLoc:"Россия"
     * }
     */
    getCountrySelected({ currentCity, supportedLocales }, { getLocale }) {
      return {
        nameURL: choiceNameByLocale(
          "country",
          "en",
          supportedLocales,
          currentCity
        ),
        nameLoc: choiceNameByLocale(
          "country",
          getLocale,
          supportedLocales,
          currentCity
        ),
      };
    },
    /**
     * Возвращает название региона страны.
     * @param currentCity Текущее значение store.currentCity.
     * @example
     * {
     *    nameURL:"Moscow",
     *    nameLoc:"Москва"
     * }
     */
    getRegionSelected({ currentCity, supportedLocales }, { getLocale }) {
      return {
        nameURL: choiceNameByLocale(
          "region",
          "en",
          supportedLocales,
          currentCity
        ),
        nameLoc: choiceNameByLocale(
          "region",
          getLocale,
          supportedLocales,
          currentCity
        ),
      };
    },
    /**
     * Возвращает город для которого будет выводиться прогноз.
     * Используется в компонентах<div className=""></div>
     * @param currentCity Текущее значение store.currentCity.
     * @example
     * {
     *    nameURL:"Moscow__Central Administrative Okrug",
     *    nameLoc:"Москва"
     * }
     */
    getCitySelected({ currentCity, supportedLocales }, { getLocale }) {
      return {
        nameURL: choiceNameByLocale(
          "name",
          "en",
          supportedLocales,
          currentCity
        ),
        nameLoc: choiceNameByLocale(
          "name",
          getLocale,
          supportedLocales,
          currentCity
        ).split("_")[0],
      };
    },
    /**
     * Возвращает список всех городов Армении.
     * @param listAllCities Список всех городов Армении.
     */
    getListAllCities({ listAllCities }) {
      return listAllCities;
    },
    /**
     * Возвращает данные для отображения в шапке виджета.
     * Левая часть.
     * @param state Текущее состояние store.
     * @param getLocale Языковая метка.
     * @param datasetsForHourlyCharts Объект данных для отображения графиков подробного
     * почасового прогноза с разбивкой на часовые интервалы.
     * @param getConstantLocale Геттер возвращает строковую константу.
     */
    currentBlock(
      state,
      { getLocale, datasetsForHourlyCharts, getConstantLocale }
    ) {
      if (Object.keys(state.datasetsHourly).length === 0) return {};
      /**
       * Данные используемые для отоброжения. Берем прогнозные данные
       * за текущий час из часового прогноза.
       */
      const data = state.datasetsHourly[0][1];
      const time = setTimeFormat(new Date(), "H:i", getLocale);
      // Температуру берем из скарректированных данных.
      const tempData = datasetsForHourlyCharts.data[1].value[0];
      return {
        timeText: `${getConstantLocale(
          "currentBlock",
          "now"
        )} ${time} ${getConstantLocale("currentBlock", "forecast")}`,
        condition: data.condition,
        condition_s:
          // Проверяем из какого поля брать данные для отображения
          // в зависимости от языка.
          getLocale !== "ru"
            ? getConstantLocale("weather_sign", data.condition)
            : data.condition_s,
        temp: `${addPlus(tempData.temp.value)}${
          getConstantLocale("units", "temp")[0]
        }`,
        realFeel: `${getConstantLocale("currentBlock", "feelsLike")} ${addPlus(
          tempData.feels_like.value
        )}`,
      };
    },
    /**
     * Возвращает данные для отображения в шапке виджета.
     * Правая часть.
     * @param state Текущее состояние store.
     * @param getConstantLocale Геттер возвращает троковую константу.
     */
    datasetCurrentBlockItem(state, { getConstantLocale }) {
      if (Object.keys(state.datasetsHourly).length === 0) return {};
      const data = state.datasetsHourly[0][1];
      return [
        {
          icon: "wind-direction-grey",
          title: `${getConstantLocale("climateIndicators", "wind")}:`,
          value: `${data.wind_speed} ${getConstantLocale("units", "speed")[0]}`,
          wind_dir: [
            data.wind_dir,
            getConstantLocale("windDir", data.wind_dir)[1],
          ],
        },
        {
          icon: "wind-gust",
          title: `${getConstantLocale("climateIndicators", "windGust_1")}:`,
          value: `${data.wind_gust} ${getConstantLocale("units", "speed")[0]}`,
          wind_dir: [data.wind_dir],
        },
        {
          icon: "pressure",
          title: `${getConstantLocale("climateIndicators", "pressure")}:`,
          value: `${data.pressure} ${
            getConstantLocale("units", "pressure")[0]
          }`,
        },
        {
          icon: "humidity",
          title: `${getConstantLocale("climateIndicators", "humidity")}:`,
          value: `${data.humidity}${getConstantLocale("units", "percent")[0]}`,
        },
      ];
    },
    /**
     * Возвращает значения температур и другие данные для таблицы и графика на вкладке
     * "Прогноз погоды на 7-14 дней".
     * @param datasetsTenDays Объект с данными для отображения прогноза на 10-14 дней.
     * @param getLocale Языковая метка.
     * @param getConstantLocale Геттер возвращает троковую константу.
     */
    tenDaysTabTable: (
      { datasetsTenDays },
      { getLocale, getConstantLocale }
    ) => {
      const valuesArr = Object.values(datasetsTenDays);
      if (valuesArr.length === 0) return {};
      /**
       * Если количество дней больше 12, то отбрасываем данные за последний
       * день. Если меньше 12, то то отбрасываем данные за 2 последних дня.
       */
      const sliceEndIndex = valuesArr.length > 12 ? -1 : -2;
      const arr = valuesArr.slice(0, sliceEndIndex).map((e) => {
        const weekday =
          getLocale === "am"
            ? dayjs(e.start_date).format("ddd")
            : setTimeFormat(e.start_date, "D", getLocale).toLowerCase();
        return {
          weekday: weekday,
          weekend:
            weekday === `${getConstantLocale("weekendDays")[0]}` ||
            weekday === `${getConstantLocale("weekendDays")[1]}`,
          date: setTimeFormat(e.start_date, "d.m", getLocale),
          condition: e.day.condition,
          prec_sum: {
            value: e.day.prec_sum,
            unit: getConstantLocale("units", "precSum")[0],
          },
          wind: {
            value: e.day.wind_speed,
            unit: getConstantLocale("units", "speed")[0],
            wind_dir: [
              e.day.wind_dir,
              getConstantLocale("windDir", e.day.wind_dir)[1],
            ],
          },
          pressure: {
            value: e.day.pressure,
            unit: getConstantLocale("units", "pressure")[0],
          },
          humidity: {
            value: e.day.humidity,
            unit: getConstantLocale("units", "percent")[0],
          },
        };
      });
      return arr;
    },
    /**
     * Возвращает значения температур и другие данные  для графика на вкладке
     * "Прогноз погоды на 7-14 дней".
     * @param datasetsTenDays Объект с данными для отображения прогноза на 10-14 дней.
     * @param getConstantLocale Геттер возвращает троковую константу.
     * @example
     * [{
     *  unit: "°",
     *  value: [-9,-7,-6,-3,-4,-2,1,1,2,2],
     *  descr: "day",
     *  min: -10,
     *  max: 2
     * },
     * {
     *  unit: "°",
     *  value: [-10,-8,-7,-5,-7,-3,0,-8,1,0],
     *  descr: "night",
     *  min: -10,
     *  max: 2
     * }]
     */
    tenDaysTabTempCharts: ({ datasetsTenDays }, { getConstantLocale }) => {
      const arr = Object.values(datasetsTenDays);
      if (arr.length === 0) return {};
      /**
       * Если количество суток больше 12, то отбрасываем данные за последние
       * сутки. Если меньше 12, то то отбрасываем данные за 2 последних.
       */
      const sliceEndIndexDay = arr.length > 12 ? -1 : -2;
      const dayTemp = arr.slice(0, sliceEndIndexDay).map((e) =>
        /**
         * Проверяем есть ли поле day в объекте с данными за сутки,
         * а также значение температуры.
         */
        e.day && e.day.temp_max !== undefined && e.day.temp_max !== null
          ? e.day.temp_max
          : null
      );
      /**
       * Если количество суток больше 12, то отбрасываем данные за последние
       * сутки.
       */
      const sliceEndIndexNight = arr.length > 12 ? arr.length : -1;
      /**
       * Для ночи отбрасываем донные за текущие сутки.
       */
      const nightTemp = arr.slice(1, sliceEndIndexNight).map((e) =>
        /**
         * Проверяем есть ли поле night в объекте с данными за сутки,
         * а также значение температуры.
         */
        e.night && e.night.temp_min !== undefined && e.night.temp_min !== null
          ? e.night.temp_min
          : null
      );
      /**
       * Вычисляем минимальную и максимальную температуру для определения
       * границ графика.
       */
      const min = Math.min(...nightTemp, ...dayTemp);
      const max = Math.max(...dayTemp, ...nightTemp);
      const unit = getConstantLocale("units", "temp")[0];
      return [
        { unit, value: dayTemp, descr: "day", min, max },
        { unit, value: nightTemp, descr: "night", min, max },
      ];
    },
    /**
     * Возвращает данные для отображения таблицы подробного
     * почасового прогноза с разбивкой на часовые интервалы.
     * @param datasetsHourly Текущее состояние store.state.datasetsHourly.
     * @param getLocale Языковая метка.
     * @param getConstantLocale Геттер возвращает троковую константу.
     */
    hourlyTabTable({ datasetsHourly }, { getLocale, getConstantLocale }) {
      if (Object.keys(datasetsHourly).length === 0) return {};
      /**
       * Возвращает значение времени для последующей сортировки.
       * @param el Дата в строковом формате.
       */
      const sortData = (el) => {
        return parseInt(el.date.split("T")[1].slice(0, 2));
      };
      const obj = {};
      for (const key in datasetsHourly) {
        const arr = Object.values(datasetsHourly[key])
          .filter((i) => typeof i === "object")
          .sort((a, b) => sortData(a) - sortData(b));
        const weekday =
          getLocale === "am"
            ? dayjs(arr[0].date).format("dddd")
            : setTimeFormat(arr[0].date, "l", getLocale);
        const day =
          getLocale === "am"
            ? dayjs(arr[0].date).format("D MMMM")
            : setTimeFormat(arr[0].date, "d F", getLocale);
        const showArr = arr.map(
          ({
            condition,
            light,
            date,
            humidity,
            prec_sum,
            pressure,
            temp,
            wind_dir,
            wind_speed,
            feels_like,
          }) => {
            return {
              hour: date.split("T")[1].slice(0, 5),
              condition,
              date,
              light,
              humidity: `${humidity}${
                getConstantLocale("units", "percent")[0]
              }`,
              prec_sum: `${prec_sum} ${
                getConstantLocale("units", "precSum")[0]
              }`,
              pressure,
              temp: `${temp}${getConstantLocale("units", "temp")[0]}`,
              feels_like: `${feels_like}${
                getConstantLocale("units", "temp")[0]
              }`,
              wind_dir: [
                wind_dir,
                `${getConstantLocale("windDir", wind_dir)[1]}`,
              ],
              wind_speed: `${wind_speed} ${
                getConstantLocale("units", "speed")[0]
              }`,
            };
          }
        );
        const time =
          datasetsHourly[key]["sunrise"] && datasetsHourly[key]["sunset"]
            ? daytime(
                datasetsHourly[key]["sunrise"],
                datasetsHourly[key]["sunset"],
                getConstantLocale
              )
            : undefined;
        obj[key] = {
          values: showArr,
          date: [weekday, day],
          polar: datasetsHourly[key]["polar"] ?? undefined,
          sunrise: datasetsHourly[key]["sunrise"],
          sunset: datasetsHourly[key]["sunset"],
          dayLength: {
            value: time,
            sunrise: datasetsHourly[key]["sunrise"]
              ? setTimeFormat(datasetsHourly[key]["sunrise"], "H:i", getLocale)
              : undefined,
            sunset: datasetsHourly[key]["sunset"]
              ? setTimeFormat(datasetsHourly[key]["sunset"], "H:i", getLocale)
              : undefined,
          },
        };
      }
      return obj;
    },
    /**
     * Возвращает данные для отображения карточки подробного прогноза на 10 дней.
     * Подробный прогноз ограничен 10 днями.
     * Из данных с сервера убираем текущие сутки и последние.
     * @param datasetsTenDays Текущее состояние store.state.datasetsTenDays.
     * @param getLocale Языковая метка.
     * @param getConstantLocale Геттер возвращает троковую константу.
     */
    tenDaysDetailsCard: (
      { datasetsTenDays },
      { getLocale, getConstantLocale }
    ) => {
      const valuesArr = Object.values(datasetsTenDays);
      if (valuesArr.length === 0) return {};
      const sliceEndIndex = valuesArr.length > 12 ? 12 : valuesArr.length;
      const arr = valuesArr
        // Убираем данные за текущие сутки.
        .slice(1, sliceEndIndex)
        .map((e, index, array) => {
          const formatWeekday = ["D", "l"];
          const weekday =
            getLocale === "am"
              ? ["ddd", "dddd"].map((el) => dayjs(e.start_date).format(el))
              : formatWeekday.map((el) =>
                  setTimeFormat(e.start_date, el, getLocale).toLowerCase()
                );
          const formatDate = ["d.m", "d F"];
          const date =
            getLocale === "am"
              ? ["D.MM", "D MMMM"].map((el) => dayjs(e.start_date).format(el))
              : formatDate.map((el) =>
                  setTimeFormat(e.start_date, el, getLocale)
                );
          const time =
            e.sunrise && e.sunset
              ? daytime(e.sunrise, e.sunset, getConstantLocale)
              : undefined;
          return {
            weekday,
            date,
            isOpen: e.isOpen,
            weekend:
              weekday[0] === getConstantLocale("weekendDays")[0] ||
              weekday[0] === getConstantLocale("weekendDays")[1],
            condition: e.day.condition,
            condition_s:
              // Проверяем из какого поля брать данные для отображения
              // в зависимости от языка.
              getLocale !== "ru"
                ? getConstantLocale("weather_sign", e.day.condition)
                : e.day.condition_s,
            precProb: {
              title: getConstantLocale("climateIndicators", "precProb"),
              value: `${e.day.prec_prob}${
                getConstantLocale("units", "percent")[0]
              }`,
            },
            wind: {
              title: getConstantLocale("climateIndicators", "wind"),
              value: `${getConstantLocale(
                "windDir",
                e.day.wind_dir
              )[1].toUpperCase()} ${e.day.wind_speed} ${
                getConstantLocale("units", "speed")[0]
              }`,
            },
            pressure: {
              title: getConstantLocale("climateIndicators", "pressure"),
              value: `${e.day.pressure}`,
            },
            wind_gust: {
              title: getConstantLocale("climateIndicators", "windGust_1").split(
                " "
              )[0],
              value: `${e.day.wind_gust} ${
                getConstantLocale("units", "speed")[0]
              }`,
            },
            comf_idx: {
              title: getConstantLocale("climateIndicators", "comfort"),
              value: `${e.day.comf_idx}0 ${
                getConstantLocale("units", "percent")[0]
              }`,
            },
            humidity: {
              title: getConstantLocale("climateIndicators", "humidity"),
              value: `${e.day.humidity} ${
                getConstantLocale("units", "percent")[0]
              }`,
            },
            temp: {
              min: `${addPlus(array[index + 1]?.night.temp_min)}${
                getConstantLocale("units", "temp")[0]
              }`,
              max: `${addPlus(e.day.temp_max)}${
                getConstantLocale("units", "temp")[0]
              }`,
            },
            uvi: {
              title: getConstantLocale("climateIndicators", "uvi"),
              value: e.day.uvi,
            },
            dayLength: {
              daytime: {
                title: getConstantLocale("climateIndicators", "daytime"),
                value_mob: time,
                value: time,
              },
              sunrise: e.sunrise
                ? setTimeFormat(e.sunrise, "H:i", getLocale)
                : undefined,
              sunset: e.sunset
                ? setTimeFormat(e.sunset, "H:i", getLocale)
                : undefined,
              polar: e.polar ?? undefined,
            },
          };
        })
        // Убираем данные за последние сутки.
        .slice(0, -1);
      return arr;
    },
    /**
     * Возвращает данные для отображения графика и таблицы подробного
     * прогноза на 10 дней с разбивкой на 3-х часовые интервалы.
     * Из данных с сервера убираем текущие сутки и последние.
     * @param datasetsThreeHour Текущее состояние store.state.datasetsThreeHour.
     * @param getLocale Языковая метка.
     */
    tenDaysDetailsChart: ({ datasetsThreeHour }, { getConstantLocale }) => {
      if (Object.keys(datasetsThreeHour).length === 0) return {};
      /**
       * Возвращает значение времени для последующей сортировки.
       * @param el Дата в строковом формате.
       */
      const sortData = (el) => {
        return parseInt(el.date.split("T")[1].slice(0, 2));
      };

      const filteredData = Object.keys(datasetsThreeHour)
        // Убираем текущие сутки и последние.
        .slice(1, -1)
        .reduce((obj, key) => {
          obj[key] = datasetsThreeHour[key];
          return obj;
        }, {});
      const obj = {};
      for (const key in filteredData) {
        const arr = Object.values(filteredData[key])
          .filter((i) => typeof i === "object")
          .sort((a, b) => sortData(a) - sortData(b));
        const showArr = arr.map(
          ({
            condition,
            light,
            date,
            humidity,
            prec_sum,
            pressure,
            temp,
            feels_like,
            wind_dir,
            wind_speed,
          }) => {
            return {
              date,
              hour: date.split("T")[1].slice(0, 5),
              condition,
              light,
              humidity: {
                unit: getConstantLocale("units", "percent")[0],
                value: humidity,
              },
              prec_sum: {
                value: prec_sum,
                unit: getConstantLocale("units", "precSum")[0],
              },
              temp: {
                value: temp,
                unit: getConstantLocale("units", "temp")[0],
              },
              feels_like: {
                value: feels_like,
                unit: getConstantLocale("units", "temp")[0],
              },
              pressure: {
                value: pressure,
                unit: getConstantLocale("units", "pressure")[0],
              },
              wind: {
                value: wind_speed,
                unit: getConstantLocale("units", "speed")[0],
                wind_dir: [wind_dir, getConstantLocale("windDir", wind_dir)[1]],
              },
            };
          }
        );
        obj[key] = showArr;
      }
      const length = Object.keys(obj).length;
      obj.length = length;
      return obj;
    },
    /**
     * Возвращает скорректированные данные для отображения дельта графика подробного
     * почасового прогноза с разбивкой на часовые интервалы.
     * @param datasetsHourly Текущее состояние store.state.datasetsHourly.
     * @param datasetsFact Текущее состояние store.state.datasetsFact.
     * @param elem Объект с настройками для отрисовки графика.
     * @param getLocale Языковая метка.
     */
    calcAdjustingForecast:
      ({ datasetsFact, datasetsHourly }, { getConstantLocale }) =>
      (elem) => {
        if (Object.keys(datasetsHourly).length === 0) return {};
        // Погодная переменная для отображения на графике.
        const variable = elem.variable;
        // количество интервалов в которые будут
        // внесены корректировки.
        const periodAdjusted = elem.periodAdjusted;
        // Объект с фактическими данными.
        // obs_time время наблюдения
        const obsTimeFact = {
          time: datasetsFact.obs_time,
          temp: datasetsFact.temp,
        };
        // Объект с данными из почасового прогноза за первый час.
        const firstForecastTime = {
          time: datasetsHourly[0][1].date,
          temp: datasetsHourly[0][1][variable],
        };
        // разница между временем снятия фактических данных и первым прогнозным часом.
        const diffTime =
          (new Date(firstForecastTime.time) - new Date(obsTimeFact.time)) /
            (1000 * 60 * 60) -
          1;
        const deltaTemp = obsTimeFact.temp - firstForecastTime.temp;
        // Текущий период корректировки.
        const indexPointMerge = periodAdjusted - diffTime;

        const sortData = (el) => {
          return parseInt(el.date.split("T")[1].slice(0, 2));
        };
        let dataArr = [];
        for (const key in datasetsHourly) {
          const arr = Object.values(datasetsHourly[key])
            .filter((i) => typeof i === "object")
            .map(({ [variable]: temp, prec_sum, date, feels_like }) => {
              return {
                date,
                temp: {
                  value: temp,
                  unit: getConstantLocale("units", "temp")[0],
                },
                prec_sum: {
                  value: prec_sum,
                  unit: getConstantLocale("units", "precSum")[0],
                },
                feels_like: {
                  value:
                    periodAdjusted !== 0 && Math.abs(deltaTemp) > 1
                      ? feels_like + deltaTemp
                      : feels_like,
                  unit: getConstantLocale("units", "temp")[0],
                },
              };
            })
            .sort((a, b) => sortData(a) - sortData(b));
          dataArr = dataArr.concat(arr);
        }
        const ajustingDataArr = dataArr.map((e, index) => {
          let calcTemp;
          /**
           * Задаем условия применения функции корректировки.
           * Корректируем данные если разница между фактической температурой
           * и прогнозной больше 1 градуса.
           */
          if (
            index < indexPointMerge &&
            periodAdjusted !== 0 &&
            Math.abs(deltaTemp) > 1
          ) {
            calcTemp =
              e.temp.value +
              deltaTemp * elem.func(periodAdjusted, diffTime, index);
          } else {
            calcTemp = e.temp.value;
          }
          return {
            ...e,
            temp: {
              value: Math.round(calcTemp),
              unit: getConstantLocale("units", "temp")[0],
            },
          };
        });
        return {
          value:
            elem.title === "linear_6"
              ? // Для скорректированных данных отображаем только период
                // корректировки на графике.
                ajustingDataArr.slice(0, 7)
              : ajustingDataArr,
          descr: elem.title,
        };
      },
    /**
     * Данные со стороннего API.
     * GFS & HRRR Forecast API
     */
    datasetsAPI: (
      { datasetsHourly, dataFromAPI, chartSettings },
      { getConstantLocale, calcAdjustingForecast }
    ) => {
      if (
        Object.keys(datasetsHourly).length === 0 ||
        Object.keys(dataFromAPI).length === 0
      )
        return {};

      const copyAPITime = [...dataFromAPI.time];
      const copyAPITemp = [...dataFromAPI.temperature_2m];
      const startTime = datasetsHourly[0][1].date;
      const isEqualTime = (elem) => new Date(startTime) - new Date(elem) === 0;
      const startIndex = copyAPITime.findIndex(isEqualTime);
      const finishedIndex = calcAdjustingForecast(chartSettings[0]).value
        .length;
      const spliceArrTime = copyAPITime.splice(startIndex, finishedIndex);
      const spliceArrTemp = copyAPITemp.splice(startIndex, finishedIndex);
      const arr = spliceArrTime.map((elem, index) => {
        return {
          temp: {
            value: Math.round(spliceArrTemp[index]),
            unit: getConstantLocale("units", "temp")[0],
          },
          prec_sum: {
            value: 0,
            unit: getConstantLocale("units", "precSum")[0],
          },
          feels_like: {
            value: "",
            unit: "",
          },
        };
      });
      return {
        value: arr,
        descr: "api",
      };
    },
    /**
     * Возвращает объект данных для отображения графиков подробного
     * почасового прогноза с разбивкой на часовые интервалы.
     * @param chartSettings Текущее состояние store.state.chartSettings.
     * @param calcAdjustingForecast Геттер вычисления данных для графика.
     */
    datasetsForHourlyCharts: (
      { chartSettings },
      { calcAdjustingForecast, datasetsAPI }
    ) => {
      if (
        Object.keys(calcAdjustingForecast).length === 0 &&
        Object.keys(datasetsAPI).length === 0
      )
        return {};
      const data = chartSettings.map((e) => calcAdjustingForecast(e));
      // data.push(datasetsAPI);

      //---finding min max temp

      // const redArr = data.map(({ value }) => {
      //   const arr = value.map((e) => e.temp.value);
      //   const min = Math.min(...arr);
      //   const max = Math.max(...arr);
      //   return { min, max };
      // });

      // const min = Math.min(...redArr.map((e) => e.min));
      // const max = Math.max(...redArr.map((e) => e.max));

      const obj = data.reduce((total, { value }) => {
        const arr = value.map((e) => e.temp.value);
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        total.min < min ? total.min : min;
        total.max > max ? total.max : max;
        // total.min = total.min < min ? total.min : min;
        // total.max = total.max > max ? total.max : max;
        // return total;
        return {
          ...total,
          min: total.min < min ? total.min : min,
          max: total.max > max ? total.max : max,
        };
      }, {});
      return {
        min: obj.min,
        max: obj.max,
        data,
      };
    },
    /**
     * Возвращает данные для температурных карточек на корте.
     * @param supportedLocales Массив с поддерживаемыми языками.
     * @param getLocale Текущий язык.
     * @param datasetsMap Данные для карточек на карте.
     * @param listAllCities Список всех городов Армении..
     * @param getConstantLocale Геттер возвращает строковую константу.
     */
    cardMapData: (
      { datasetsMap, listAllCities, supportedLocales },
      { getLocale, getConstantLocale }
    ) => {
      // Добавляем ключ name_loc в state.datasetMap
      const arr = datasetsMap.map((value) => {
        const { name_loc } = listAllCities.find(
          ({ name_en }) => name_en === value.name_en
        );
        return { ...value, name_loc };
      });
      return arr.map((e) => {
        const cityName = choiceNameByLocale(
          "name",
          getLocale,
          supportedLocales,
          e
        );
        // Добавляем в карточку для отображения временную метку суток
        // в выбранной локали.
        const localDetails = e.details?.map((value) => {
          const nameDaymarker = getConstantLocale("timeMarker").find(
            ([key]) => key === value.name
          );
          return {
            ...value,
            name: nameDaymarker[1],
          };
        });
        const localCondition = getConstantLocale(
          "weather_sign",
          e.now.condition
        );
        e.now.condition_s = localCondition;
        return {
          area_en: e.area_en,
          details: localDetails,
          home: e.home,
          name_en: e.name_en,
          name_loc_choice: cityName,
          now: e.now,
          overmorrow: e.overmorrow,
          tomorrow: e.tomorrow,
          x_svg: e.x_svg,
          y_svg: e.y_svg,
        };
      });
    },
    /**
     *
     * Возвращает список самых населенных городов с разбивкой по странам.
     * @param supportedLocales Массив с поддерживаемыми языками.
     * @param getLocale Текущий язык.
     */
    getListTopCities: ({ listTopCities, supportedLocales }, { getLocale }) => {
      return listTopCities
        .map((e) => {
          const cityName = choiceNameByLocale(
            "name",
            getLocale,
            supportedLocales,
            e
          );
          return {
            temp: e.temp,
            name_en: e.nameURL,
            name_loc_choice: cityName,
          };
        })
        .sort((a, b) => a.name_loc_choice.localeCompare(b.name_loc_choice));
    },
    /**
     * Возвращает сгрупированный по алфавиту список городов и
     * отфильтрованный по выбранной области.
     * @param areaName Название области полученное из компоненты
     * ListAllCities.
     * @param supportedLocales Массив с поддерживаемыми языками.
     * @param getLocale Текущий язык.
     */
    getGroupListAllCities:
      ({ listAllCities, supportedLocales }, { getLocale }) =>
      (areaName) => {
        // Функция группировки объектов с городами в массив
        // по первой букве названия города.
        const callback = (acc, cur) => {
          const city = cur.name_loc_choice;
          if (city) {
            const firstLetter = city[0].toUpperCase();
            acc[firstLetter] === undefined
              ? (acc[firstLetter] = [cur])
              : acc[firstLetter].push(cur);
            // { ...acc, [firstLetter]: [...(acc[firstLetter] || []), cur] };
          }
          return acc;
        };
        const obj = listAllCities
          // Создаем массив объектов с городами, в которых оставляем
          // необходимые поля с заданным форматированием.
          .map((e) => {
            const cityName = choiceNameByLocale(
              "name",
              getLocale,
              supportedLocales,
              e
            );
            const area = choiceAreaByLocale(getLocale, e, "");
            const area_l5 = choiceAreaByLocale(getLocale, e, "_l5");
            const formatArea_ru = (str) =>
              str.split(" ").length > 1 ? `${str.slice(0, -4)}.,` : str;
            const formatArea_ru_l5 = (str) => {
              if (str === "") return "";
              const arr = str.split("");
              arr.splice(-4, 3, "-");
              return arr.join("");
            };
            return {
              name_en: e.nameURL,
              name_loc_choice: cityName,
              area,
              area_l5,
              /**
               * Для русского языка используем заданное форматирование.
               * @example
               * Гехаркуникская обл., Чамбаракский р-н
               */
              area_f: getLocale === "ru" ? formatArea_ru(area) : `${area}, `,
              area_l5_f:
                getLocale === "ru" ? formatArea_ru_l5(area_l5) : `${area_l5}`,
            };
          })
          // фильтруем массив объектов с городами по выбранной области.
          .filter((value) => {
            return areaName === "all"
              ? value
              : value.area.toLowerCase() === areaName.toLowerCase();
          })
          .sort((a, b) => a.name_loc_choice.localeCompare(b.name_loc_choice))
          // Создаем объект, в котором ключи - это заглавная буква алфавита,
          // а значения - массив объектов городов сгруппированные по названию.
          .reduce(callback, {});
        return obj;
      },
    /**
     * Возвращает список областей.
     */
    getListArea: ({ listAllCities }, { getLocale }) => {
      const obj = {};
      listAllCities.forEach(
        (val) => (obj[choiceAreaByLocale(getLocale, val, "")] = true)
      );
      const arr = Object.keys(obj).sort((a, b) => a.localeCompare(b));
      return arr;
    },
    /**
     * Вычисляем значение параметров URL для последующего POST запроса
     * к серверу.
     * @param props Объект со свойствами роута (параметры, имя роута).
     */
    computedParamsURL: (state) => (props) => {
      // Переменная с городом по умолчанию.
      const defaultCity = state.defaultCity;
      // Переменная с языком по умолчанию.
      const defaultLocale = state.defaultLocale;
      // Переменная с городом и языковой меткой из LocalStorage.
      const langLS = localStorage.getItem("lang");
      // Получаем из local storage объект с описанием последнего выбранного города.
      const strCity = localStorage.getItem("city");
      const city = JSON.parse(strCity);

      console.log(props, defaultLocale, langLS, city, defaultCity);
      return props;
    },
  },
  mutations: {
    [SET_DATA_FORECAST]: setDataForecast,
    [SET_DATA_API]: setDataAPI,
    [CHANGE_OPENING_CARD]: changeOpeningCard,
    [SET_LIST_CITIES]: setListCities,
    [SET_MAP_DATA]: setMapDataset,
    [SET_HISTORY_DATA]: setHistoryDataset,
    [SET_POP_CITIES_DATA]: setPopCitiesData,
    [SET_LIST_COUNTRIES]: setListCountries,
    [SET_LIST_TOP_CITIES]: setListTopCities,
    [SET_LIST_REGIONS]: setListRegions,
    [SET_CONSTANTS]: setConstants,
    [SET_CITY]: setCity,
    [SET_LOCALE]: setLocale,
    [SET_SUPPORTED_LOCALES]: setSupportedLocales,
    [LOADING]: loading,
    [INIT_COMMIT]: initCommit,
  },
  actions: {
    /**
     * Вызывается когда пользователь кликает на
     * карточку с подробным прогнозом.
     * @param index Код карточки.
     * @param card Т.к. action store setCardIndex вызывается из разных компонент,
     * дополнительно используется параметр card.
     */
    setCardIndex({ commit }, { index, card }) {
      commit(CHANGE_OPENING_CARD, { index, card });
    },
    /**
     * Загружаем объект с переводами по выбранной локали.
     */
    loadConstants: async ({ commit, state }) => {
      const { default: data } = await import(
        `../assets/locales/${state.currentLocale}.json`
      ).catch((err) => console.log(err));
      commit(SET_CONSTANTS, data);
    },
    /**
     * Получение списка поддерживаемых языкав.
     */
    loadSupportedLocales: async ({ commit }) => {
      try {
        const { data } = await axios.get("/supported-locales.json");
        commit(SET_SUPPORTED_LOCALES, data);
      } catch (error) {
        console.error("Error! Could not load supported locales. " + error);
      }
    },
    /**
     * Получение данных для отображения карточек городов
     * в секции "ИСТОРИЯ ПРОСМОТРОВ".
     */
    loadSectionHistory: async ({ commit }) => {
      try {
        const { data } = await axios.get("/map_dataset.json");
        commit(SET_HISTORY_DATA, data);
      } catch (error) {
        console.error("Error! Could not load history data section. " + error);
      }
    },
    /**
     * Получение данных для отображения карточек городов
     * в секции "ПОПУЛЯРНЫЕ ГОРОДА МИРА".
     */
    loadSectionPopCities: async ({ commit }) => {
      try {
        const { data } = await axios.get("/map_dataset.json");
        commit(SET_SUPPORTED_LOCALES, data);
      } catch (error) {
        console.error("Error! Could not load pop data section. " + error);
      }
    },
    countriesList: async ({ commit }) => {
      try {
        const { data } = await axios.get("/country.json");
        commit(SET_LIST_COUNTRIES, data);
      } catch (error) {
        console.error("Error! Could not load pop data section. " + error);
      }
    },
    countryPage: async ({ commit }) => {
      try {
        const { data } = await axios.get("/countryList.json");
        commit(SET_LIST_COUNTRIES, data);
      } catch (error) {
        console.error("Error! Could not load pop data section. " + error);
      }
    },
    /**
     * Контролер загрузки данных для отображения компонент по выбранному роуту.
     * @param objectRouteProps Объект со свойствами роута (параметры, имя роута).
     */
    manageActions: async (
      { state, commit, getters, dispatch },
      objectRouteProps
    ) => {
      commit(LOADING, true);
      console.log("start manageActions");
      await dispatch("loadSupportedLocales");
      await dispatch("loadSectionHistory");

      // Если это не первоначальная загрузка приложения, то
      // используем язык и город из параметров маршрута роутера.
      if (state.isDataLoad) {
        console.log("data already loaded manageActions");
        commit(SET_LOCALE, objectRouteProps.langURL);
        commit(SET_CITY, state.currentCity);
        await dispatch("loadConstants");
        return 200;
      }

      window.first = {
        page: "countries",
        lang: "ru",
        city: {
          lon: 37.6174943,
          lat: 55.7504461,
          country_ru: "Россия",
          country_en: "Russia",
          country_loc: "Россия",
          region_ru: "Москва",
          region_en: "Moscow",
          region_loc: "Москва",
          name_ru: "Москва__Центральный административный округ",
          name_en: "Moscow__Central Administrative Okrug",
          name_loc: "Москва__Центральный административный округ",
        },
        lon: "37.6174943",
        lat: "55.7504461",
        country_en: "Russia",
        country_ru: "Россия",
        country_loc: "Россия",
        area_en: "Moscow",
        area_ru: "Москва",
        area_loc: "Москва",
        name_en: "Moscow__Central Administrative Okrug",
        name_ru: "Москва__Центральный административный округ",
        name_loc: "Москва__Центральный административный округ",
      };

      const startData = window?.first;
      /**
       * Проверяем переменную window.warn при первом запуске приложения.
       * Если сервер не нашел данные по введенному URL.
       */
      if (window.warn && window.warn.err.length !== 0) {
        return 404;
      }

      const loadData = (name) => {
        const actions = {
          day: () => dispatch("daysForecast"),
          hourly: () => dispatch("hourlyForecast"),
          main: () => dispatch("hourlyForecast"),
          countries: () => dispatch("countriesList"),
          topWorldCities: () => dispatch("topWorldCities"),
          country: () => dispatch("countryPage"),
          cities: () => dispatch("listCities"),
        };
        return actions[name];
      };

      await loadData(startData.page)();
      /**
       * При первоначальной загрузке приложения используем данные
       * из переменной window.first.
       */
      const paramsGetter = getters.computedParamsURL(startData);
      commit(SET_LOCALE, paramsGetter.lang);
      commit(SET_CITY, paramsGetter.city);
      await dispatch("loadConstants");
      commit(INIT_COMMIT, true);
      commit(LOADING, false);
      console.log("finish action manager code 200");
      return 200;

      // // Переменная с городом по умолчанию.
      // const defaultCity = state.defaultCity;
      // // Переменная с языком по умолчанию.
      // const defaultLocale = state.defaultLocale;
      // // Переменная с городом и языковой меткой из LocalStorage.
      // const langLS = localStorage.getItem("lang");
      // const strCity = localStorage.getItem("city");
      // const cityLS = JSON.parse(strCity);
      // // Загружаем данные с сервера.
      // // await dispatch("loadData");
      // /**
      //  * Проверяем и устанавливаем значение локали.
      //  */
      // const setLang = () => {
      //   if (!langURL) {
      //     return langLS ?? defaultLocale;
      //   }
      //   // Проверяем содержит ли массив с поддерживаемыми языками
      //   // параметр langURL.
      //   const isLocaleSupported = state.supportedLocales.some(
      //     (obj) => obj.key.toLowerCase() === langURL.toLowerCase()
      //   );

      //   return isLocaleSupported ? langURL : null;
      // };
      // // /**
      // //  * Проверяем и устанавливаем значение города.
      // //  */
      // // const selectCity = () => {
      // //   if (!cityURL) {
      // //     return cityLS ?? defaultCity;
      // //   }
      // //   // Проверяем содержит ли массив со всеми городами
      // //   // параметр cityURL.
      // //   const hasCityInTheList = state.listAllCities.some(
      // //     (obj) => obj.nameURL === cityURL.toLowerCase()
      // //   );

      // //   return hasCityInTheList ? cityURL : null;
      // // };

      // // const city = selectCity();
      // const lang = setLang();
      // /**
      //  * Если возможное значение языка или города не
      //  * найдено, то берем город и язык из local storage
      //  * или дефолтное значение. После этого возвращаем код 404.
      //  */
      // if (lang === null) {
      //   commit(SET_LOCALE, langLS ?? defaultLocale);
      //   commit(SET_CITY, cityLS ?? defaultCity);
      //   commit(INIT_COMMIT, true);
      //   await dispatch("loadConstants");
      //   return 404;
      // }

      // commit(SET_LOCALE, lang);
      // commit(SET_CITY, cityLS ?? defaultCity);
      // commit(INIT_COMMIT, true);
      // await dispatch("loadConstants");
      // return nameRouteURL === "not-found" ? 404 : 100;
    },
  },
});
