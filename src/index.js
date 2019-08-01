import BasicExample from './BasicExample';
import StoreExample from './StoreExample';

const examples = [
  BasicExample,
  StoreExample,
];

// This is the entry point for your plugin.
// The install function will be called by the BrewBlox UI before starting the Vue app.
// You can register as many features and components as you want
export default {
  install(Vue, { store }) {
    // Each example has its own install() function.
    // It's not required, but more flexible
    examples.forEach(example => {
      Vue.use(example, { store });
    });
  },
};
