<script>
import superagent from 'superagent';

export default {
  name: 'BasicExampleWidget',

  // Props are provided by the dashboard
  props: {
    widget: { type: Object, required: true },
    volatile: { type: Boolean, default: false },
  },

  data: () => ({
    localUrl: '',
    messages: [],
  }),

  computed: {
    displayName() {
      return this.$store.getters['features/displayNameById'](this.widget.feature);
    },
    // A crud is a convenient ball of settings and functions,
    // that can be passed around to child components such as toolbars and forms
    // Defined in https://github.com/BrewBlox/brewblox-ui/blob/develop/src/components/Widget/CrudComponent.ts
    // Explained in https://brewblox.netlify.com/dev/decisions/crud_component.html
    // Here used by the WidgetActions component.
    crud() {
      return {
        widget: this.widget,
        isStoreWidget: !this.volatile,
        saveWidget: this.saveWidget,
        closeDialog: () => { },
      };
    },
    widgetConfig() {
      return this.widget.config;
    },
    url: {
      get() {
        return this.localUrl || this.widget.config.url || '';
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
      this.$emit('update:widget', widget);
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
        color: 'positive',
        icon: 'mdi-message-alert',
        message: `Hi! I'm ${this.widget.title}.`,
      });
    },
  },
};
</script>

<template>
  <q-card dark class="text-white scroll">
    <WidgetToolbar :title="widget.title" :subtitle="displayName">
      <q-btn-dropdown flat label="actions">
        <q-list dark bordered>
          <ActionItem @click="alert" icon="mdi-message-alert" label="Alert" />
          <WidgetActions :crud="crud" />
        </q-list>
      </q-btn-dropdown>
    </WidgetToolbar>

    <q-card-section>
      <!-- The input fields and buttons at the top of the card are defined here -->
      <q-item dark>
        <q-item-section>
          <q-input v-model="url" dark label="URL" />
        </q-item-section>
        <q-item-section class="col-auto">
          <q-btn @click="fetch" outline label="Fetch" />
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
            <q-btn @click="removeMessage(idx)" round flat icon="delete" />
          </q-item-section>
        </q-item>
      </q-item>
    </q-card-section>
  </q-card>
</template>
