import PluginWizard from "./components/PluginWizard.vue";
import PluginWidget from "./components/PluginWidget.vue";

// Define a feature here
// This is used by the application to manage and create widgets
const feature = {
  // The ID must be unique, and is used by dashboard items to declare their type
  id: "PluginExample",

  // The display name is how the feature is described to the user
  // eg. when selecting a new widget to create, and in the widget title bar
  displayName: "Plugin Example",

  /*
    The ref() helper function registers the Vue component by name, and then returns the name
    After registering, it can be used as dynamic component
  
    Example - the two declarations are equal, but the first can use a variable:
  
      <component is="ExampleFeatureWidget" />
      <ExampleFeatureWidget />
    */

  // The widget is the rectangular card displayed on the dashboard
  widget: "PluginWidget",

  // The wizard is responsible for creating new dashboard items for this feature
  // It is an optional property: features without a wizard are considered not creatable by the user.
  wizard: "PluginWizard",

  // This is the default size of a widget of this type
  // We'll be using this in the wizard
  widgetSize: {
    cols: 5,
    rows: 5
  }

  /*
      Features can have more optional properties.
      A quick overview:
  
      validator:
        A function that is called before rendering a dashboard item, to check whether the configuration is ok.
        Example: a Spark widget must check whether the corresponding Block in the backend service exists
  
      deleters:
        Additional actions that may be taken when removing the widget.
        The user chooses whether to do this.
        Example: "Delete block on controller?" when removing a Spark widget.
  
      selector:
        A feature may have multiple possible widgets.
        If a selector is defined, it will be override the widget property.
        Example code:
          featureWidget(feature: Feature, itemConfig: any) {
            if (feature.selector !== undefined) {
              return feature.selector(itemConfig);
            }
            return feature.widget;
          }
    */
};

export default {
  install(Vue, { store }) {
    Vue.component(PluginWizard.name, PluginWizard);
    Vue.component(PluginWidget.name, PluginWidget);

    store.dispatch("features/createFeature", feature);
  }
};
