<template>
  <WeatherInformer>
    <TabInformerHourly />
  </WeatherInformer>
</template>
<script>
import WeatherInformer from "@/components/WeatherInformer.vue";
import TabInformerHourly from "@/components/TabInformerHourly.vue";
export default {
  name: "WeatherInformerHourly",
  components: {
    WeatherInformer,
    TabInformerHourly,
  },
};
</script>
