import BasicExampleWidget from './BasicExampleWidget.vue';

/**
 * The definition for the widget feature added by this plugin
 * You can find the Typescript interface in
 * https://github.com/BrewBlox/brewblox-ui/blob/develop/src/store/features/types.ts
 */
const widgetFeature = {
  /**
   * The ID must be unique, and is used as foreign key in Widget
   */
  id: 'BasicExample',

  /**
   * The human-friendly name for this feature
   */
  title: 'Plugin Example (Basic)',

  /**
   * Register the display component with Vue.component(), and use its name here
   */
  component: 'BasicExampleWidget',

  /**
   * The wizard is responsible for creating new dashboard items for this feature
   * There are three possible values:
   * - string: the name of the wizard component.
   * - false: this component can't be created in a wizard.
   * - true: use the default wizard. generateConfig() must be defined.
   */
  wizard: true,

  /**
   * Set the default size for a widget of this type.
   * Widgets can later be resized.
   */
  widgetSize: {
    cols: 5,
    rows: 5,
  },

  /**
   * This is used in the default wizard to create the widget.config property
   * widget.config is where you store your widget-specific persistent settings
   * You can fill this however you want
   */
  generateConfig: () => ({
    url: '/datastore',
  }),
};

export default {
  install(Vue, { store }) {

    /**
     * Globally register the Vue component.
     */
    Vue.component(BasicExampleWidget.name, BasicExampleWidget);

    /**
     * Register our widget feature. It will now show up in wizard options.
     */
    store.dispatch('features/registerWidget', widgetFeature);
  },
};
