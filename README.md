# brewblox-plugin

This is a small example of how to write a plugin for the [Brewblox UI][brewblox-ui].

The Brewblox UI can load and use [UMD][umd] packages from an URL at startup. This allows adding plugins without rebuilding the UI.

To install the plugins, the [Vue plugin mechanism](https://vuejs.org/v2/guide/plugins.html) is used. A plugin must have an `install()` function, in which it can register Vue components and Brewblox widgets.

In this plugin, the `install()` function can be found in [./src/index.js](./src/index.js).

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

## Editor

You're free to use whatever editor or IDE you prefer, but we preconfigured some settings for VSCode.

Recommended VSCode plugins:
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

## Changing the plugin name

It's recommended you change the plugin name to something other than `brewblox-plugin`. You can do so in [package.json](./package.json). The name occurs multiple times, so it's best to use a search and replace.

## Serving the plugin

You can [publish](https://hackernoon.com/publish-your-own-npm-package-946b19df577e) your plugin package to NPM to easily load it with [unpkg](https://unpkg.com/).

This is convenient for releases, but less so for development. Here the simplest solution is to host a web server on localhost. For this, the `server.js` file exists. Run it in the background, and you can load your plugin from `http://localhost:8200/{PLUGIN_NAME}.umd.js`

Note: hot reloading is not yet implemented. To see your changes, run `npm run build`, and then reload your Brewblox UI page.

## Brewblox Interfaces

There are some generic interfaces used throughout the UI. Plugins can register functionality they provide.

### [Dashboard, Widget](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/dashboards/types.ts)

To ensure flexibility, one of the core display elements in the UI is the `Dashboard`. A dashboard is populated with `Widget` elements.

`Widget` data blobs are loaded from the store. The dashboard uses the `widget.feature` property to find the Vue component capable of rendering the data.

This allows the user to display the most relevant items, regardless of whether they are core Brewblox components, or added by a third-party plugin.

### [Service](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/services/index.ts)

While widgets are displayed on dashboards, services get their own page.

Other than that, they're very much alike: they have persistent configuration, and are implemented by plugins.

### [Feature](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/features/types.ts)

Widgets and Services by themselves are nothing more than blobs of JSON data. In order for them to be created and rendered, they must be combined with Vue components.

Features are how the UI knows which components can be used to render data. Plugins can use their `install(Vue)` function to register features.

As Features contain functions and references to Vue components, they are not persisted in the datastore.


## VueX Data Management

Local application state is kept using [VueX][vuex]. Settings that are not session-specific (dashboards, dashboard items, services) are persisted to the Brewblox datastore.

The full datastore state is loaded on startup, and all changes are persisted here.

Your plugin has full access to the Brewblox store, but can't use the Typescript wrappers from the brewblox-ui repository.

You can also register your own store module. See [the store example](./src/StoreExample/store.js) for how to do this.

For reference, these are the relevant store modules in brewblox-ui:
- [dashboards, widgets](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/dashboards/index.ts)
- [services](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/services/index.ts)
- [features](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/store/features/index.ts)
- [history](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/plugins/history/store/index.ts)

All modules are namespaced. For example, the Typescript definition for saving widgets is:
```ts
@Action({ rawError })
public async saveWidget(widget: Widget): Promise<void> {
  this.commitWidget(await widgetApi.persist(widget));
}
```

In Javascript, you can call this store action using:
```ts
this.$store.dispatch('dashboards/saveWidget', item);
```


## Global Vue properties

There are multiple global objects available in Brewblox through the `Vue` object.

- [$database](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/plugins/database/types.ts) exposes the client for the CouchDB datastore.
- [$eventbus](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/plugins/eventbus.ts) lets plugins subscribe to data published by backend services.
- [$startup](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/plugins/startup.ts) lets plugins schedule functions, to be called just after

## Global component mixins

Quasar offers useful functions added to `this` in Vue components. The most noteworthy are `this.$q.dialog()` and `this.$q.notify()`.
See the [dialog](https://quasar.dev/quasar-plugins/dialog) and [notify](https://quasar.dev/quasar-plugins/notify) documentation pages for more details.

Brewblox defines the (Boolean) `this.$dense` property. It is used to help responsive design for mobile devices.


## Using Brewblox components

Because the plugin is loaded in the Brewblox UI, you have full access to all Vue components registered in the Brewblox UI. This includes those registered by other plugins.

Registered components fall under two groups:
  - Those provided by [Quasar](https://quasar.dev/)
    - Quasar component names always start with `q-`, and are `kebab-cased` (eg. `q-item`)
  - Those defined in Brewblox itself (Everything in the [components](https://github.com/BrewBlox/brewblox-ui/tree/develop/src/components) directory).
    - For convenience, we use `PascalCase` for local components. This makes it easier to identify local and imported components.


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

[brewblox-ui]: https://github.com/BrewBlox/brewblox-ui
[umd]: https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
[vuex]: https://vuex.vuejs.org/guide/
[vuex-dynamic]: https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration
[vue-structure]: https://vuex.vuejs.org/guide/structure.html
