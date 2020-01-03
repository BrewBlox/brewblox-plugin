import BasicExampleWidget from './BasicExampleWidget.vue';

// The definition for the feature added by this plugin
// You can find the Typescript interface in
// https://github.com/BrewBlox/brewblox-ui/blob/develop/src/store/features/types.ts
const feature = {
  // The ID must be unique, and is used by dashboard items to declare their type
  id: 'BasicExample',

  // The display name is the human-friendly name for this feature
  displayName: 'Plugin Example (Basic)',

  // The widget is the rectangular card displayed on the dashboard
  // Register the component with Vue.component(), and use its name here
  widgetComponent: 'BasicExampleWidget',

  // The wizard is responsible for creating new dashboard items for this feature
  // There are three possible values:
  // - string: the name of the wizard component
  // - null: this component can't be created in a wizard
  // - undefined: use the default wizard
  wizardComponent: undefined,

  // This is the default size of a widget of this type
  // We'll be using this in the wizard
  widgetSize: {
    cols: 5,
    rows: 5,
  },

  // This is used in the default wizard to create the widget.config property
  // widget.config is where you store your widget-specific persistent settings
  // You can fill this however you want
  generateConfig: () => ({
    url: '/datastore',
  }),
};

export default {
  install(Vue, { store }) {
    Vue.component(BasicExampleWidget.name, BasicExampleWidget);
    store.dispatch('features/createFeature', feature);
  },
};
