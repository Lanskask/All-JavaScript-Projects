System.config({
  "transpiler": "ts",
  "typescriptOptions": {
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": true,
    "suppressImplicitAnyIndexErrors": true
  },
  "meta": {
    "typescript": {
      "exports": "ts"
    },
    "*.json": {
      "loader": "systemjs-json-plugin"
    }
  },
  "map": {
    "app": "app",
    "systemjs-json-plugin": "https://unpkg.com/systemjs-plugin-json@0.3.0",
    "@telerik": "http://www.telerik.com/kendo-angular-ui/npm/node_modules/@telerik",
    "@progress": "http://www.telerik.com/kendo-angular-ui/npm/node_modules/@progress",
    "cldr-data": "http://www.telerik.com/kendo-angular-ui/npm/node_modules/cldr-data",
    "@angular": "https://unpkg.com/@angular",
    "angular2-in-memory-web-api": "https://unpkg.com/angular2-in-memory-web-api",
    "rxjs": "https://unpkg.com/rxjs@5.4.3",
    "hammerjs": "https://unpkg.com/hammerjs@2.0.8",
    "pako": "https://unpkg.com/pako@1.0.5",
    "ts": "https://unpkg.com/plugin-typescript@5.3.3/lib/plugin.js",
    "tslib": "https://unpkg.com/tslib@1.7.1",
    "typescript": "https://unpkg.com/typescript@2.3.4/lib/typescript.js",
    "@angular/http/testing": "https://unpkg.com/@angular/http@4.2.2/bundles/http-testing.umd.js",
    "@angular/platform-browser/animations": "https://unpkg.com/@angular/platform-browser@4.2.2/bundles/platform-browser-animations.umd.js",
    "@angular/animations/browser": "https://unpkg.com/@angular/animations@4.2.2/bundles/animations-browser.umd.js",
    "@angular/common": "https://unpkg.com/@angular/common@4.2.2",
    "@angular/compiler": "https://unpkg.com/@angular/compiler@4.2.2",
    "@angular/forms": "https://unpkg.com/@angular/forms@4.2.2",
    "@angular/core": "https://unpkg.com/@angular/core@4.2.2",
    "@angular/http": "https://unpkg.com/@angular/http@4.2.2",
    "@angular/platform-browser": "https://unpkg.com/@angular/platform-browser@4.2.2",
    "@angular/platform-browser-dynamic": "https://unpkg.com/@angular/platform-browser-dynamic@4.2.2",
    "@angular/upgrade": "https://unpkg.com/@angular/upgrade@4.2.2"
  },
  "packages": {
    "app": {
      "main": "./main.ts",
      "defaultExtension": "ts"
    },
    "rxjs": {
      "defaultExtension": "js"
    },
    "chroma-js": {
      "defaultExtension": "js"
    },
    "pako": {
      "defaultExtension": "js",
      "main": "./index.js"
    },
    "@angular/common": {
      "main": "/bundles/common.umd.js"
    },
    "@angular/compiler": {
      "main": "/bundles/compiler.umd.js"
    },
    "@angular/forms": {
      "main": "bundles/forms.umd.js",
      "defaultExtension": "js"
    },
    "@angular/core": {
      "main": "/bundles/core.umd.js"
    },
    "@angular/http": {
      "main": "bundles/http.umd.js",
      "defaultExtension": "js"
    },
    "@angular/platform-browser": {
      "main": "/bundles/platform-browser.umd.js"
    },
    "@angular/platform-browser-dynamic": {
      "main": "/bundles/platform-browser-dynamic.umd.js"
    },
    "@angular/upgrade": {
      "main": "/bundles/upgrade.umd.js"
    },
    "@angular/animations": {
      "main": "/bundles/animations.umd.js"
    },
    "@progress/kendo-angular-buttons": {
      "main": "dist/cdn/js/kendo-angular-buttons.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-l10n": {
      "main": "dist/cdn/js/kendo-angular-l10n.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-charts": {
      "main": "dist/cdn/js/kendo-angular-charts.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-inputs": {
      "main": "dist/cdn/js/kendo-angular-inputs.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-intl": {
      "main": "dist/cdn/js/kendo-angular-intl.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-data-query": {
      "main": "dist/cdn/js/kendo-data-query.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-drawing": {
      "main": "dist/es/main.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-file-saver": {
      "main": "dist/npm/main.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-dateinputs": {
      "main": "dist/cdn/js/kendo-angular-dateinputs.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-dialog": {
      "main": "dist/cdn/js/kendo-angular-dialog.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-dropdowns": {
      "main": "dist/cdn/js/kendo-angular-dropdowns.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-grid": {
      "main": "dist/cdn/js/kendo-angular-grid.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-popup": {
      "main": "dist/cdn/js/kendo-angular-popup.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-label": {
      "main": "dist/cdn/js/kendo-angular-label.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-layout": {
      "main": "dist/cdn/js/kendo-angular-layout.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-scrollview": {
      "main": "dist/cdn/js/kendo-angular-scrollview.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-sortable": {
      "main": "dist/cdn/js/kendo-angular-sortable.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-upload": {
      "main": "dist/cdn/js/kendo-angular-upload.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-date-math": {
      "main": "dist/cdn/js/kendo-date-math.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-excel-export": {
      "main": "dist/cdn/js/kendo-angular-excel-export.js",
      "defaultExtension": "js"
    },
    "@progress/kendo-angular-pdf-export": {
      "main": "dist/cdn/js/kendo-angular-pdf-export.js",
      "defaultExtension": "js"
    }
  }
});