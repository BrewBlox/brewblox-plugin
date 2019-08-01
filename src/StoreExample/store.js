const Vue = window.Vue;
const dbModuleId = 'store-example';

// See https://vuex.vuejs.org/guide/ for a full guide on how to use VueX modules
// See https://github.com/BrewBlox/brewblox-ui/blob/develop/src/plugins/database.ts for the database spec

/*
* Datastore objects must implement the StoreObject interface
* {
*  id: string;       <- required
*  _rev?: string;    <- assigned by the database when you create the object
* }                     required when you later save the object again.
*/

export const exampleModule = {
  namespaced: true,

  state: {
    // This message is saved to the VueX store, but not to the datastore.
    // It will remain when you switch pages, but disappear if you reload the UI.
    localMessage: null,

    // These messages are saved to the datastore.
    // They will be reloaded when you reload the UI.
    persistentMessages: {},
  },

  getters: {
    persistentValues(state) {
      return Object.values(state.persistentMessages);
    },
  },

  mutations: {
    commitLocal(state, msg) {
      state.localMessage = msg;
    },

    commitPersistent(state, msg) {
      // We use Vue.set() because creating a new entry with obj[key] doesn't trigger reactivity
      Vue.set(state.persistentMessages, msg.id, msg);
    },

    commitAllPersistent(state, messages) {
      state.persistentMessages = messages.reduce((acc, msg) => ({ ...acc, [msg.id]: msg }), {});
    },

    commitRemovePersistent(state, msg) {
      // To trigger reactivity updates, we have to use Vue.delete()
      Vue.delete(state.persistentMessages, msg.id);
    },
  },

  actions: {
    async saveLocal(context, msg) {
      context.commit('commitLocal', msg);
    },

    async createPersistent(context, msg) {
      const created = await Vue.database.create(dbModuleId, msg);
      context.commit('commitPersistent', created);
    },

    async savePersistent(context, msg) {
      if (!msg._rev) {
        throw new Error("Can't save a message without revision ID (_rev)");
      }
      const saved = await Vue.database.persist(dbModuleId, msg);
      context.commit('commitPersistent', saved);
    },

    async removePersistent(context, msg) {
      const removed = await Vue.database.remove(dbModuleId, msg);
      context.commit('commitRemovePersistent', removed);
    },

    async setup(context, database) {
      // Initial fetch to populate the VueX store
      const messages = await Vue.database.fetchAll(dbModuleId);
      context.commit('commitAllPersistent', messages);

      // Register the database module
      // The onChanged / onDeleted callbacks will keep the store synchronized
      await database.registerModule({
        id: dbModuleId,
        onChanged: async (msg) => {
          // The update may have been triggered here
          // Don't bother re-committing the same message
          // This only causes unnecessary re-renders in the UI
          const existing = context.state.persistentMessages[msg.id];
          if (!existing || existing._rev !== msg._rev) {
            context.commit('commitPersistent', msg);
          }
        },
        onDeleted: async (id) => {
          const existing = context.state.persistentMessages[id];
          if (existing) {
            context.commit('commitRemovePersistent', existing);
          }
        },
      });
    },
  },
};
