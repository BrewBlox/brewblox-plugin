<script>
import superagent from 'superagent';

export default {
  name: 'BasicExampleWidget',

  // Props are provided by the dashboard
  props: {
    /**
     * A crud is a convenient ball of settings and functions,
     * that can be passed around to child components such as toolbars and forms
     * Defined in https://github.com/BrewBlox/brewblox-ui/blob/develop/src/store/features/types.ts
     * Explained in https://brewblox.netlify.com/dev/decisions/crud_component.html
     */
    initialCrud: { type: Object, required: true },

    /**
     * The context contains information on how and where the widget is currently rendered.
     * Defined in https://github.com/BrewBlox/brewblox-ui/blob/develop/src/store/features/types.ts
     * Explained in https://brewblox.netlify.com/dev/decisions/dynamic_widgets.html
     *
     * It has two properties:
     *  - mode = 'Basic' | 'Full';
     *  - container = 'Dashboard' | 'Dialog';
     *
     * Mode is a hint on how much information should be shown.
     * Container tells us (among other things) what toolbar we should use.
     */
    context: { type: Object, required: true },
  },

  data: () => ({
    activeMode: null,
    localUrl: '',
    messages: [],
  }),

  computed: {
    displayName() {
      return this.$store.getters['features/displayName'](this.widget.feature);
    },
    crud() {
      return this.initialCrud;
    },
    widget() {
      return this.crud.widget;
    },
    widgetConfig() {
      return this.widget.config;
    },
    toolbarComponent() {
      return this.context.container === 'Dialog'
        ? 'WidgetDialogToolbar'
        : 'WidgetToolbar';
    },
    cardClass() {
      return this.context.container === 'Dialog'
        ? ['widget-modal', 'overflow-auto']
        : ['widget-dashboard', 'overflow-auto', 'scroll'];
    },
    mode: {
      get() {
        return this.activeMode || this.context.mode;
      },
      set(val) {
        this.activeMode = val;
      },
    },
    url: {
      get() {
        return this.localUrl || this.widgetConfig.url || '';
      },
      set(url) {
        // We don't want to save widget config every few letters.
        // That would quickly create datastore conflicts due to multiple updates sent.
        // We save it to a local variable here, and update the config when the user fetches.
        this.localUrl = url;
      },
    },
  },

  methods: {
    saveWidget(widget) {
      this.crud.saveWidget(widget);
    },
    saveConfig(config) {
      this.saveWidget({ ...this.widget, config });
    },
    async fetch() {
      const url = this.url;
      try {
        // save the URL when we fetch
        this.saveConfig({ ...this.widgetConfig, url });
        const response = await superagent.get(url);
        this.messages.push({ url, ok: true, content: response.text });
      } catch (e) {
        this.messages.push({ url, ok: false, content: e });
      }
    },
    removeMessage(idx) {
      this.messages.splice(idx, 1);
    },
    alert() {
      // An example notification, triggered by the button on the toolbar
      this.$q.notify({
        color: 'info',
        icon: 'mdi-message-alert',
        message: `Hi! I'm ${this.displayName} '${this.widget.title}'.`,
      });
    },
  },
};
</script>

<template>
  <q-card :class="cardClass" dark>
    <component :is="toolbarComponent" :crud="crud" :mode.sync="mode">
      <template v-slot:actions>
        <ActionItem icon="mdi-message-alert" label="Alert" @click="alert" />
        <WidgetActions :crud="crud" />
      </template>
    </component>

    <q-card-section>
      <q-item dark>
        <q-item-section>
          <q-input v-model="url" dark label="URL" />
        </q-item-section>
        <q-item-section class="col-auto">
          <q-btn outline label="Fetch" @click="fetch" />
        </q-item-section>

        <q-item v-for="(msg, idx) in messages" :key="idx" dark>
          <q-item-section avatar>
            <q-icon :name="msg.ok ? 'check_circle' : 'error'" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption class="q-mb-sm">
              {{ msg.url }}
            </q-item-label>
            {{ msg.content }}
          </q-item-section>
          <q-item-section side>
            <q-btn round flat icon="delete" @click="removeMessage(idx)" />
          </q-item-section>
        </q-item>
      </q-item>
    </q-card-section>

    <q-card-section v-if="mode === 'Full'">
      Advanced settings go here
    </q-card-section>
  </q-card>
</template>
