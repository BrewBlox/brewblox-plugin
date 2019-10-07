<script>
import uuid from 'uuid/v4';

// The BasicExampleWidget class contains more detailed comments about how widgets work
// This component is a demonstration of how to interact with the store

export default {
  name: 'StoreExampleWidget',

  props: {
    initialCrud: { type: Object, required: true },
    context: { type: Object, required: true },
  },

  // We interact directly with the store
  data: () => ({}),

  computed: {
    crud() {
      return this.initialCrud;
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
    localMessage: {
      get() {
        return this.$store.state.example.localMessage;
      },
      set(msg) {
        this.$store.dispatch('example/saveLocal', msg);
      },
    },
    persistentMessages: {
      get() {
        return this.$store.getters['example/persistentValues'];
      },
    },
  },

  methods: {
    createLocal() {
      this.localMessage = { id: uuid(), text: 'local message' };
    },
    async createMessage() {
      const msg = { id: uuid(), text: `store message ${this.persistentMessages.length + 1}` };
      await this.$store.dispatch('example/createPersistent', msg);
    },
    async saveMessage(msg) {
      await this.$store.dispatch('example/savePersistent', msg);
    },
    async removeMessage(msg) {
      await this.$store.dispatch('example/removePersistent', msg);
    },
  },
};
</script>

<template>
  <q-card dark :class="cardClass">
    <!-- If you don't add the mode property, the toolbar won't show a button -->
    <component :is="toolbarComponent" :crud="crud" />

    <q-card-section>
      <!-- Local message -->
      <q-item v-if="localMessage" dark>
        <q-item-section>
          <!-- Directly editing a property inside the message does not trigger a store update -->
          <q-input
            v-model="localMessage.text"
            dark
            label="Edit local message"
          />
        </q-item-section>
        <q-item-section class="col-auto">
          <q-tooltip>Save local message</q-tooltip>
          <q-btn flat icon="save" @click="localMessage = localMessage" />
        </q-item-section>
        <q-item-section class="col-auto">
          <q-tooltip>Delete local message</q-tooltip>
          <q-btn flat icon="delete" @click="localMessage = null" />
        </q-item-section>
      </q-item>
      <!-- If no local message, show a create button -->
      <q-item v-else dark>
        <q-item-section class="text-grey">
          No local message set
        </q-item-section>
        <q-space />
        <q-item-section class="col-auto">
          <q-tooltip>Create local message</q-tooltip>
          <q-btn flat icon="add" @click="createLocal" />
        </q-item-section>
      </q-item>

      <q-separator dark inset />

      <!-- Persistent messages -->
      <q-item v-for="msg in persistentMessages" :key="msg.id" dark>
        <q-item-section>
          <!-- Directly editing a property inside the message does not trigger a store update -->
          <q-input v-model="msg.text" dark label="Edit store message" />
        </q-item-section>
        <q-item-section class="col-auto">
          <q-tooltip>Save store message</q-tooltip>
          <q-btn flat icon="save" @click="saveMessage(msg)" />
        </q-item-section>
        <q-item-section class="col-auto">
          <q-tooltip>Delete store message</q-tooltip>
          <q-btn flat icon="delete" @click="removeMessage(msg)" />
        </q-item-section>
      </q-item>

      <!-- Creating a new persistent message -->
      <q-item dark>
        <q-item-section
          v-if="persistentMessages.length === 0"
          class="text-grey"
        >
          No persistent messages set
        </q-item-section>
        <q-space />
        <q-item-section class="col-auto">
          <q-tooltip>Create store message</q-tooltip>
          <q-btn flat icon="add" @click="createMessage" />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
