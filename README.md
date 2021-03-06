# Template to create web components extending TEI Publisher pb-components

This is a template repository you can clone to quickly get started writing your own web component library, which extends the [pb-components](https://gitlab.existsolutions.com/tei-publisher/pb-components) of TEI Publisher. It includes a simple example component: `pb-clipboard`, and the necessary setup to

* run a development server to test components
* generate an API documentation with demos
* bundle the library for distribution
* localize components via i18n

A more beginner-friendly walk-trough is included in the TEI Publisher documentation.

##  Getting started

To get started, run `npm install`. This will install required dependencies: above all `pb-components` but also the `es-dev-server` and `web-component-analyzer` packages which are needed for local development and documentation.

Afterwards, run `npm start` to launch a development server. This will open a browser window pointing to `index.html`, which shows example usage of the `pb-clipboard` component. You can also browse to `api.html` to see the generated API documentation for the component. This is extracted from the [documentation-style comments](https://www.npmjs.com/package/web-component-analyzer#%E2%9E%A4-how-to-document-your-components-using-jsdoc) in the code.

The source code of new component should be placed into the `src` directory. For bundling, any new component must also be imported by `pb-extension-bundle.js`.

## Bundling for distribution

To create a bundle of the library, call

`npm run build:production`

The bundle (written into `dist`) will include everything, i.e. the version of the `pb-components` library you are building upon and all dependencies. You can thus use it as a drop-in replacement for TEI Publisher components or custom apps generated by TEI Publisher.

## Using in TEI Publisher or generated apps

The created library can be used as a drop-in replacement for the default `pb-components` library. To do so:

1. clone `tei-publisher-app` or the generated app you would like to modify
2. edit `package.json` and replace the dependency for `@teipublisher/pb-components` with the replacement library. For example, to use the git source of `pb-extension-template` in `package.json`, change the dependencies as follows:

    ```json
    "dependencies": {
        "@teipublisher/pb-extension-template": "git+https://github.com/eeditiones/pb-extension-template#master"
    }
    ```
3. edit `build.properties` and change `scripts.dir` to point to the replacement library, e.g.:
    ```
    scripts.dir=node_modules/@teipublisher/pb-extension-template/dist
    ```
4. edit `modules/config.xqm` and change the `$config:webcomponents` variable to read `local`:
   ```xquery
   declare variable $config:webcomponents := "local";
   ```
5. call `ant xar-local` to build a version of tei-publisher-app (or your own app) which loads the included version of the component library instead of the public one from CDN.
6. to actually use the components you added (e.g. `pb-clipboard`), you need to import them into the HTML pages in which you want to use them. For example, to have the `pb-clipboard` component available in the main `index.html` of TEI Publisher or your app, add
   ```html
   <script type="module" src="resources/scripts/pb-extension-bundle.js"></script>
   ```
   after the line importing `pb-components-bundle.js`.

### Copying i18n files

Finally, if your component needs custom i18n keys, copy the corresponding directory into `resources/i18n`. For example, this template repository has additional translations in `i18n/app`, so you should copy the contents of that directory into `resources/i18n/app` of TEI Publisher or your target app. In `index.html` (or wherever else you want to use your components) add a `locales` attribute to `pb-page` to make it aware that there are additional translations available:

```html
<pb-page data-template="pages:pb-page" locales="resources/i18n/{{ns}}/{{lng}}.json" unresolved="unresolved">
```