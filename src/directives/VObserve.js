/**
 * Кастомная директива добавляет Intersection Observer на элемент.
 */
export default {
  inserted: (el, binding) => {
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        binding.value();
      }
    };
    const observer = new IntersectionObserver(callback);
    observer.observe(el);
  },
  name: "observe",
};
