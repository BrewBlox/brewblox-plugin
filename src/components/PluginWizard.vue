<script>
import uuid from "uuid/v4";

export default {
  name: "PluginWizard",
  props: {
    featureId: String,
    dashboardId: String
  },
  computed: {
    displayName() {
      return this.$store.getters["features/displayNameById"](
        this.$props.featureId
      );
    },
    defaultWidgetSize() {
      return this.$store.getters["features/widgetSizeById"](
        this.$props.featureId
      );
    }
  },
  data: () => ({
    widgetTitle: ""
  }),
  methods: {
    back() {
      this.$emit("back");
    },
    close() {
      this.$emit("close");
    },
    createWidget() {
      this.$store
        .dispatch("dashboards/appendDashboardItem", {
          id: uuid(),
          title: this.widgetTitle,
          feature: this.featureId,
          dashboard: this.dashboardId,
          order: 0, // automatically set by appendDashboardItem
          config: {
            url: "https://www.google.com"
          },
          ...this.defaultWidgetSize
        })
        .then(() =>
          this.$q.notify({
            icon: "mdi-check-all",
            color: "positive",
            message: `Created ${this.displayName} '${this.widgetTitle}'`
          })
        )
        .catch(e =>
          this.$q.notify({
            icon: "error",
            color: "negative",
            message: `Failed to create widget: ${e.toString()}`
          })
        )
        .finally(this.close);
    }
  },
  created() {
    this.widgetTitle = this.displayName;
  }
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
