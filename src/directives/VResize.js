/**
 * Кастомная директива вызывающая обработчик при изменении размера окна.
 * Аргументами задается оптимизация.
 */
export default {
  inserted: (el, { modifiers, value, arg }) => {
    let timeout = null; // holder for timeout id
    const delay = Object.keys(modifiers)[0] ?? 100;
    let throttled = false;
    const onResizeCallback = value;
    switch (arg) {
      case "debounce":
        el.handler = () => {
          clearTimeout(timeout);
          timeout = setTimeout(onResizeCallback, delay);
        };
        break;
      case "throttle":
        el.handler = () => {
          if (!throttled) {
            onResizeCallback();
            throttled = true;
            setTimeout(() => {
              throttled = false;
            }, delay);
          }
        };
        break;
      default:
        el.handler = () => {
          onResizeCallback();
        };
        break;
    }
    /**
     * Устанавливаем оброботчик на событие resize, которое срабатывает при
     * изменении размера окна.
     */
    window.addEventListener("resize", el.handler);
  },
  /**
   * Удаляем оброботчик на событие resize когда компонент размонтирован.
   */
  unbind: (el) => window.removeEventListener("resize", el.handler),
  name: "resize",
};
