<script>
import superagent from "superagent";

export default {
  name: "PluginWidget",
  props: {
    widget: Object,
    volatile: Boolean
  },
  computed: {
    displayName() {
      return this.$store.getters["features/displayNameById"](
        this.widget.feature
      );
    },
    crud() {
      return {
        widget: this.widget,
        isStoreWidget: !this.volatile,
        saveWidget: this.saveWidget,
        closeDialog: () => {}
      };
    },
    widgetConfig() {
      return this.widget.config;
    },
    url: {
      get() {
        return this.widget.config.url || "";
      },
      set(url) {
        this.saveConfig({ ...this.widgetConfig, url });
      }
    }
  },
  data: () => ({
    messages: []
  }),
  methods: {
    saveWidget(widget) {
      this.$emit("update:widget", widget);
    },
    saveConfig(config) {
      this.saveWidget({ ...this.widget, config });
    },
    async fetch() {
      const url = this.url;
      try {
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
        color: "positive",
        icon: "mdi-message-alert",
        message: `Hi! I'm ${this.widget.title}.`
      });
    }
  }
};
</script>

<template>
  <q-card dark class="text-white scroll">
    <WidgetToolbar :title="widget.title" :subtitle="displayName">
      <q-btn-dropdown flat label="actions">
        <q-list dark bordered>
          <ActionItem icon="mdi-message-alert" label="Alert" @click="alert" />
          <WidgetActions :crud="crud" />
        </q-list>
      </q-btn-dropdown>
    </WidgetToolbar>

    <q-card-section>
      <!-- The input fields and buttons at the top of the card are defined here -->
      <q-item dark>
        <q-item-section>
          <q-input v-model.lazy="url" dark label="URL" />
        </q-item-section>
        <q-item-section class="col-auto">
          <q-btn outline label="Fetch" @click="fetch" />
        </q-item-section>
      </q-item>

      <q-item v-for="(msg, idx) in messages" :key="idx" dark>
        <q-item-section avatar>
          <q-icon :name="msg.ok ? 'check_circle' : 'error'" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption class="q-mb-sm">{{ msg.url }}</q-item-label>
          {{ msg.content }}
        </q-item-section>
        <q-item-section side>
          <q-btn round flat icon="delete" @click="removeMessage(idx)" />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
