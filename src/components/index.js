import Vue from "vue";
import PluginWizard from "./PluginWizard.vue";

const components = {
  PluginWizard
};

Object.entries(components).forEach(([name, cmp]) => Vue.component(name, cmp));

export default components;
