import { exampleModule } from './store';
import StoreExampleWidget from './StoreExampleWidget.vue';
import StoreExampleWizard from './StoreExampleWizard.vue';

// A detailed example of the feature interface can be found in the basic example
const feature = {
  id: 'StoreExample',
  displayName: 'Plugin Example (Store)',
  widget: 'StoreExampleWidget',
  wizard: 'StoreExampleWizard',
  widgetSize: {
    cols: 5,
    rows: 5,
  },
};

export default {
  install(Vue, { store }) {
    store.registerModule('example', exampleModule);
    store.dispatch('example/setup', Vue.database);

    Vue.component(StoreExampleWidget.name, StoreExampleWidget);
    Vue.component(StoreExampleWizard.name, StoreExampleWizard);
    store.dispatch('features/createFeature', feature);
  },
};
