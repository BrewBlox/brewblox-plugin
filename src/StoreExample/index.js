import { exampleModule } from './store';
import StoreExampleWidget from './StoreExampleWidget.vue';

// A detailed example of the feature interface can be found in the basic example
const widgetFeature = {
  id: 'StoreExample',
  title: 'Plugin Example (Store)',
  component: 'StoreExampleWidget',
  widgetSize: {
    cols: 5,
    rows: 5,
  },
  wizard: true,
  generateConfig: () => ({}),
};

export default {
  install(Vue, { store }) {

    /**
     * Add our new store module.
     * It's namespaced, so all get/commit/dispatch calls must be prefixed.
     */
    store.registerModule('example', exampleModule);

    /**
     * We can't commit new data to the store until the app starts.
     * Schedule a callback in $startup, and it will be called immediately after startup.
     */
    Vue.$startup.onStart(() => store.dispatch('example/start'));

    /**
     * Globally register the Vue component.
     */
    Vue.component(StoreExampleWidget.name, StoreExampleWidget);

    /**
     * Register our widget feature. It will now show up in wizard options.
     */
    store.dispatch('features/registerWidget', widgetFeature);
  },
};
