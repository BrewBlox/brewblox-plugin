# brewblox-plugin

This is a small example of how to write a plugin for the [BrewBlox UI][brewblox-ui].

The BrewBlox UI can load and use [UMD][umd] packages from an URL at startup. This allows adding plugins without rebuilding the UI.

To install the plugins, the [Vue plugin mechanism](https://vuejs.org/v2/guide/plugins.html) is used. A plugin must have an `install()` function, in which it can register Vue components and BrewBlox widgets.

In this plugin, the `install()` function can be found in [./src/index.js](./src/index.js).

## Editor

You're free to use whatever editor or IDE you prefer, but we preconfigured some settings for VSCode.

Recommended VSCode plugins:
- Vetur
- ESLint
- EditorConfig

## Changing the plugin name

It's recommended you change the plugin name to something other than `brewblox-plugin`. You can do so in [package.json](./package.json). The name occurs multiple times, so it's best to use a search and replace.

## Serving the plugin

You can [publish](https://hackernoon.com/publish-your-own-npm-package-946b19df577e) your plugin package to NPM to easily load it with [unpkg](https://unpkg.com/).

This is convenient for releases, but less so for development. Here the simplest solution is to host a web server on localhost. For this, the `server.js` file exists. Run it in the background, and you can load your plugin from `http://localhost:8200/{PLUGIN_NAME}.umd.js`

Note: hot reloading is not yet implemented. To see your changes, run `npm run build`, and then reload your BrewBlox UI page.

## BrewBlox Architecture

BrewBlox mostly adheres to the [Vue application structure][vue-structure], but defines a set of concepts within this framework.

### Feature

Features define the Vue components required to create and display dashboard items. Features must be registered on startup, in the plugin `install()` function.

### PersistentWidget

`PersistentWidget` objects are instances of features. This is the configuration data, and is stored in VueX. The widget component is passed the widget as part of the `crud` property.

### Widget, Wizard

To implement specific functionality, features can register various Vue components. These components are passed configuration as Vue props, and can use provided callbacks to update configuration.

* To be displayed on a dashboard, a feature must have a widget.
  * [The basic example widget](./src/BasicExample/BasicExampleWidget.vue)
* You can provide a function to generate the configuration for a new wizard.
  * If your feature needs more specific configuration during setup, you can define a wizard component.

## Data Management

Local application state is kept using [VueX][vuex]. Settings that are not session-specific (dashboards, dashboard items, services) are persisted to the BrewBlox datastore.

The full datastore state is loaded on startup, and all changes are persisted here.

Your plugin has full access to the BrewBlox store, but can't use the Typescript wrappers from the brewblox-ui repository.

You can also register your own store module. See [the store example](./src/StoreExample/store.js) for how to do this.

For reference, these are the relevant store modules in brewblox-ui:
- [dashboards and dashboard items](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/dashboards/index.ts)
- [features](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/features/index.ts)
- [history](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/plugins/history/store/index.ts)
- [providers](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/providers/index.ts)
- [services](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/services/index.ts)

All modules are namespaced. For example, the Typescript definition for creating dashboard items is:
```ts
@Action({ rawError, commit: 'commitPersistentWidget' })
public async createPersistentWidget(widget: PersistentWidget): Promise<PersistentWidget> {
  return await widgetApi.create(widget);
}
```

In Javascript, you can call this store action using:
```js
this.$store.dispatch('dashboards/createPersistentWidget', item);
```

## Using BrewBlox components

Because the plugin is loaded in the BrewBlox UI, you have full access to all Vue components registered in the BrewBlox UI. This includes those registered by other plugins.

Registered components fall under two groups:
  - Those provided by [Quasar](https://quasar.dev/)
    - Quasar component names always start with `q-`, and are `kebab-cased` (eg. `q-item`)
  - Those defined in BrewBlox itself (Everything in the [components](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/components) directory).
    - For convenience, we use `PascalCase` for local components. This makes it easier to identify local and imported components.

Quasar also offers useful functions added to `this` in Vue components. The most noteworthy are `this.$q.dialog()` and `this.$q.notify()`.
See the [dialog](https://quasar.dev/quasar-plugins/dialog) and [notify](https://quasar.dev/quasar-plugins/notify) documentation pages for more details.

## Commands

### Project setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```

### Serves the generated files locally
```
node server.js
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

[brewblox-ui]: https://github.com/BrewBlox/brewblox-ui
[umd]: https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
[vuex]: https://vuex.vuejs.org/guide/
[vuex-dynamic]: https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration
[vue-structure]: https://vuex.vuejs.org/guide/structure.html
