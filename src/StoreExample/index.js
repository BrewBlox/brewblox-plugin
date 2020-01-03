import { exampleModule } from './store';
import StoreExampleWidget from './StoreExampleWidget.vue';

// A detailed example of the feature interface can be found in the basic example
const feature = {
  id: 'StoreExample',
  displayName: 'Plugin Example (Store)',
  widgetComponent: 'StoreExampleWidget',
  widgetSize: {
    cols: 5,
    rows: 5,
  },
  generateConfig: () => ({}),
};

export default {
  install(Vue, { store }) {
    store.registerModule('example', exampleModule);
    store.dispatch('example/setup', Vue.database);

    Vue.component(StoreExampleWidget.name, StoreExampleWidget);
    store.dispatch('features/createFeature', feature);
  },
};
