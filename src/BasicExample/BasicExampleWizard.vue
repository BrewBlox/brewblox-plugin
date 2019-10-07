<script>
import uuid from 'uuid/v4';

export default {
  name: 'BasicExampleWizard',
  props: {
    featureId: { type: String, required: true },
    dashboardId: { type: String, required: true },
  },
  data: () => ({
    widgetTitle: '',
  }),
  computed: {
    displayName() {
      return this.$store.getters['features/displayName'](this.featureId);
    },
    defaultWidgetSize() {
      return this.$store.getters['features/widgetSize'](this.featureId);
    },
  },
  created() {
    // Must be done after we have access to the featureId prop
    this.widgetTitle = this.displayName;
  },
  methods: {
    back() {
      this.$emit('back');
    },
    close() {
      this.$emit('close');
    },
    createWidget() {
      this.$store
        .dispatch('dashboards/appendPersistentWidget', {
          id: uuid(), // Must be unique
          title: this.widgetTitle,
          feature: this.featureId,
          dashboard: this.dashboardId,
          order: 0, // automatically set by appendPersistentWidget
          config: {
            url: '/datastore',
          },
          ...this.defaultWidgetSize,
        })
        .then(() =>
          this.$q.notify({
            icon: 'mdi-check-all',
            color: 'positive',
            message: `Created ${this.displayName} '${this.widgetTitle}'`,
          })
        )
        .catch(e =>
          this.$q.notify({
            icon: 'error',
            color: 'negative',
            message: `Failed to create widget: ${e.toString()}`,
          })
        )
        .finally(this.close);
    },
  },
};
</script>

<template>
  <div>
    <q-card-section>
      <q-item dark>
        <q-item-section>
          <q-input v-model="widgetTitle" dark label="Widget name" />
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-actions class="row justify-between">
      <q-btn unelevated label="Back" @click="back" />
      <q-btn unelevated label="Create" color="primary" @click="createWidget" />
    </q-card-actions>
  </div>
</template>
