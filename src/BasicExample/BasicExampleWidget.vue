<script>
import superagent from 'superagent';

export default {
  name: 'BasicExampleWidget',

  // Props are provided by the container (dashboard or dialog)
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
     * It has three properties:
     *  - mode = 'Basic' | 'Full';
     *  - container = 'Dashboard' | 'Dialog';
     *  - size = 'Fixed' | 'Content';
     *
     * `mode` is a hint on how much information should be shown.
     * `container` tells us (among other things) what toolbar we should use.
     * `size` is a flag to let us know whether the parent element will grow with content or not.
     */
    context: { type: Object, required: true },
  },

  data: () => ({
    activeMode: null,
    localUrl: '',
    messages: [],
  }),

  computed: {
    featureTitle() {
      // The getter returns a function
      return this.$store.getters['features/widgetTitle'](this.widget.feature);
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
        /**
         * We don't want to save widget config every few letters.
         * That would quickly create datastore conflicts due to multiple updates sent.
         * We save it to a local variable here, and update the config when the user fetches.
         */
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
      // An example notification, triggered by toolbar action
      this.$q.notify({
        color: 'info',
        icon: 'mdi-message-alert',
        message: `Hi! I'm ${this.featureTitle} '${this.widget.title}'.`,
      });
    },
  },
};
</script>

<template>
  <!-- CardWrapper handles sizing issues. It has a template slot for the toolbar.
  If card size is fixed, the body will be wrapped in a scroll area. -->
  <CardWrapper :context="context">
    <template #toolbar>
      <component :is="toolbarComponent" :crud="crud" :mode.sync="mode">
        <template #actions>
          <ActionItem icon="mdi-message-alert" label="Alert" @click="alert" />
        </template>
      </component>
    </template>

    <div class="column q-ma-md q-gutter-y-md">
      <div class="col row no-wrap q-gutter-x-md items-center">
        <q-input
          v-model="url"
          label="URL"
          class="col"
        />
        <div class="col-auto">
          <q-btn
            flat
            icon="mdi-play-circle"
            @click="fetch"
          />
        </div>
      </div>

      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        class="col row q-gutter-x-md items-start"
      >
        <q-icon
          :name="msg.ok ? 'check_circle' : 'error'"
          size="sm"
          class="col-auto"
        />
        <div class="col column">
          <q-item-label>
            {{ msg.url }}
          </q-item-label>
          {{ msg.content }}
        </div>
        <div class="col-auto">
          <q-btn
            round
            flat
            icon="delete"
            @click="removeMessage(idx)"
          />
        </div>
      </div>

      <div v-if="mode === 'Full'" class="col text-center">
        <q-separator inset />
        This section is only shown in full mode.<br>
        Advanced settings go here.
      </div>
    </div>
  </CardWrapper>
</template>
