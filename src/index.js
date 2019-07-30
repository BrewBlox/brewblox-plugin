import PluginWizard from "./PluginWizard.vue";
import PluginWidget from "./PluginWidget.vue";

// The definition for the feature added by this plugin
// You can find the Typescript interface in
// https://github.com/BrewBlox/brewblox-ui/blob/develop/src/store/features/index.ts
const feature = {
  // The ID must be unique, and is used by dashboard items to declare their type
  id: "PluginExample",

  // The display name is the human-friendly name for this feature
  displayName: "Plugin Example",

  // The widget is the rectangular card displayed on the dashboard
  // Register the component with Vue.component(), and use its name here
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

// This is the entry point for your plugin.
// The install function will be called by the BrewBlox UI before starting the Vue app.
// You can register as many features and components as you want
export default {
  install(Vue, { store }) {
    Vue.component("PluginWizard", PluginWizard);
    Vue.component("PluginWidget", PluginWidget);

    store.dispatch("features/createFeature", feature);
  }
};
