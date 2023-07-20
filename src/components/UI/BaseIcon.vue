<template>
  <component :is="iconComponent" />
</template>

<script>
/**
 * Компонента для вставки иконок в формате SVG.
 */
const icons = {};
/**
 * Динамическая загрузка всех svg файлов и создание на их основе
 * объекта с компонентами, в котором ключами (имена компонент) будут имена файлов.
 */
const requireComponents = require.context(
  // Относительный путь к каталогу с svg.
  "../../assets/images?inline",
  // Выполнять (или нет) ли поиск во вложенных каталогах
  true,
  // Регулярное выражение для сопоставления имён файлов базовых компонентов
  /.svg$/
);
requireComponents.keys().forEach((fileName) => {
  const iconName =
    fileName.split("/").at(-1).slice(0, -4) + "-" + fileName.split("/").at(-2);
  const componentConfig = requireComponents(fileName);
  icons[iconName] = componentConfig.default ?? componentConfig;
});
export default {
  name: "BaseIcon",
  props: {
    /**
     * Имя папки где хранится файл с изображением.
     * common - папка со служебными иконками.
     * dark - погодные значки для темного времени суток.
     * light - погодные значки для светлого времени суток.
     */
    pick: String,
    /**
     * Имя иконки должно совпадать с названием файла svg в папке \src\assets\images
     */
    nameIcon: {
      type: String,
      required: true,
    },
    /**
     * Флаг используется для отрисовки всех иконок в тестовой компоненте.
     */
    isTest: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    /**
     * Возвращает компоненту с иконкой для отображения.
     */
    iconComponent() {
      const nameComponent = !this.isTest
        ? this.nameIcon + "-" + this.pick
        : this.nameIcon;
      if (!Object.prototype.hasOwnProperty.call(icons, nameComponent)) {
        return (
          console.log(`${nameComponent} иконка с таким именем не найдена!!!`),
          icons["no-image-common"]
        );
      }
      // Добовляем свойство name в экземпляр компоненты со значением
      // nameComponent.
      icons[nameComponent].name = nameComponent;
      return icons[nameComponent];
    },
  },
};
</script>
