<template>
  <WeatherInformer>
    <TabInformerDay />
  </WeatherInformer>
</template>
<script>
import WeatherInformer from "@/views/WeatherInformer.vue";
import TabInformerDay from "@/views/TabInformerDay.vue";
export default {
  name: "WeatherInformerDay",
  components: {
    WeatherInformer,
    TabInformerDay,
  },
};
</script>
