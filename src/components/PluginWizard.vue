<script>
export default {
  name: 'PluginWizard',
  props: {
    featureId: String,
    dashboardId: String,
  }
}
</script>

<template>
  <div>{{ $props.featureId }}</div>
</template>
