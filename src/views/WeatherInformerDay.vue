<template>
  <WeatherInformer>
    <TabInformerDay />
  </WeatherInformer>
</template>
<script>
import WeatherInformer from "@/components/WeatherInformer.vue";
import TabInformerDay from "@/components/TabInformerDay.vue";
export default {
  name: "WeatherInformerDay",
  components: {
    WeatherInformer,
    TabInformerDay,
  },
};
</script>
