<script>
export default {
  name: "PluginWizard",
  props: {
    featureId: String,
    dashboardId: String
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
    createWidget() {}
  },
  created() {
    console.log(this.$store);
    this.widgetTitle = this.$store.getters["features/displayNameById"](
      this.$props.featureId
    );
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
