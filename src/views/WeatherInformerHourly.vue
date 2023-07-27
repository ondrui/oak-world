<template>
  <WeatherInformer>
    <TabInformerHourly />
  </WeatherInformer>
</template>
<script>
import WeatherInformer from "@/views/WeatherInformer.vue";
import TabInformerHourly from "@/views/TabInformerHourly.vue";
export default {
  name: "WeatherInformerHourly",
  components: {
    WeatherInformer,
    TabInformerHourly,
  },
};
</script>
