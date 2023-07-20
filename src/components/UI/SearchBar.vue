<template>
  <div class="search-header">
    <input
      type="text"
      class="input-search-header"
      placeholder=""
      :value="getCitySelected.name_loc_choice"
      @change="handler"
    />
    <div class="history-icon-container">
      <BaseIcon
        nameIcon="history"
        pick="common"
        width="23"
        class="history-icon"
      />
    </div>
    <div class="search-icon-container">
      <BaseIcon
        nameIcon="search"
        pick="common"
        width="23"
        class="search-icon"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SearchBar",
  computed: {
    ...mapGetters(["getListAllCities", "getCitySelected", "getLocaleURL"]),
  },
  methods: {
    handler(e) {
      const city = e.target.value;
      this.getListAllCities.forEach((element) => {
        const arr = Object.entries(element).filter(([key]) => {
          return key.includes("name");
        });
        const elem = arr.find(
          (f) => f[1]?.toLowerCase() === city.toLowerCase()
        );
        if (!city || !elem) return;
        this.$router
          .push({
            name: "hourly",
            params: {
              lang: this.getLocaleURL,
              city: element.name_en.toLowerCase(),
            },
            hash: "#top",
          })
          .catch(() => {});
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-header {
  position: relative;
  margin-bottom: 50px;
}
.input-search-header {
  height: 50px;
  width: 100%;
  padding-left: 13px;
  background-color: #f0f7fc;
  border: 1px solid #b2d3e8;
  border-radius: 4px;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  color: #04569c;
}

.search-icon-container {
  position: absolute;
  right: 13px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.history-icon-container {
  position: absolute;
  right: 45px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
