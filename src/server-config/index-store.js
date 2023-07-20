/**
 * !!! Ghange PATH request !!!
 * Get data from Internal vs External APIs.
 */
// async ({ commit }) => {
//   commit(LOADING, true);
//   try {
//     const res = await Promise.all([
//       axios.get("/vue-app/forecast.json"),
//       axios.get("/vue-app/forecastFromAPI.json"),
//       axios.get("/vue-app/cities_all.json"),
//       axios.get("/vue-app/map_dataset.json"),
//       axios.get("/vue-app/top_cities.json"),
//       axios.get("/vue-app/translated_constants.json"),
//       axios.get("/vue-app/supported-locales.json"),
//       new Promise((resolve) => setTimeout(() => resolve("done"), 500)),
//     ]);
//     const [
//       total,
//       data,
//       cities,
//       mapDataset,
//       topCities,
//       constants,
//       supportedLocales,
//     ] = res.map(({ data }) => data);

//     commit(SET_DATA_FORECAST, total);
//     commit(SET_DATA_API, data);
//     commit(SET_LIST_ALL_CITIES, cities);
//     commit(SET_MAP_DATA_SET, mapDataset);
//     commit(SET_LIST_TOP_CITIES, topCities);
//     commit(SET_CONSTANTS, constants);
//     commit(SET_SUPPORTED_LOCALES, supportedLocales);
//   } catch (error) {
//     console.error("Error! Could not reach the API. " + error);
//   }
// };
