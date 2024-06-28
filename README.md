# Adonis HTMX

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

Better HTMX development with AdonisJS framework.

## Features
- JSX/TSX rendering engine. Adapted from [adonisjsx](https://github.com/macieklad/adonisjsx), based on [KitaJS](https://github.com/kitajs/html)
- `Request` and `Response` extensions for HTMX headers management 
- Prefers explicit rendering - does not wrap rendered components in root layout implicitly 
- Removes the need to ALS - if you need data attached to `HttpContext` you can extract it with extractor function defined in config that runs as a part of rendering pipeline
 
## Instalation
Install and configure it in two steps.

```bash
# npm
npm i adonis-htmx
node ace configure adonis-htmx
```

Or use `ace add` command that combines those two steps:
```bash
node ace add adonis-htmx
```

## Configuration
### Add jsx factories
After installing package, extend your tsconfig.json compiler options:

```jsonc
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "Html.createElement",
    "jsxFragmentFactory": "Html.Fragment"
  },
  // Optionally add the ts-html-plugin for xss protection
  // the package is installed automatically if you are using adonisjsx
  "plugins": [{ "name": "@kitajs/ts-html-plugin" }]
}
```

### Register kitaJS
Once done, edit the `bin/server.ts` file to register Kita.

```ts
import 'reflect-metadata'
import '@kitajs/html/register.js'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
```

### Configure injected props
You can edit `extract` function defined in `config/htmx.ts` file and add additional fields computed from `HttpContext` that will be injected into components rendered by `adonis-htmx` via `adonis` prop.
```ts
const extract = (context: HttpContext) => {
  // Inject csrfToken via adonis prop
  const csrf: string = context.request.csrfToken

  // Inject isHtmx via adonis prop
  const isHtmx: boolean = !!context.request.htmx
  return {
    csrf,
    isHtmx,
  }
}
```
Then you can use `AdonisProps` and `AdonisComponent` to have it typed correctly
```tsx
import { AdonisComponent } from 'adonis-htmx'

function MyComponent({ myProp, adonis }): AdonisComponent<{ myProp: string }> {
  return (
    <ul>
      <li>{ myProp }</li>
      <li>{ adonis.csrf }</li>
      <li>{ adonis.isHtmx }</li>
    </ul>
  )
}
```
## Api

### Request
You can check if given request has been made by htmx and act accordingly

```ts
async function handle({ request }: HtppContext) {
  if(request.htmx) {
    // Request has been made by HTMX - you can now use request.htmx to get access to HTMX related info e.g.
    request.htmx.boosted // true if boosted
  }
}
```

### Response
The provider adds `htmx` property to `HttpContext`. This property introduces fluent interface to create and render HTMX responses. It helps with setting correct headers and then render the response defined with JSX/TSX.

```ts
import Component from "."
...
async function handle({ htmx }: HttpContext) {
...
  return htmx
    .location('/client-redirect')
    .trigger('some-event')
    .render(Component, { data })
}
```

### Rendering 
`htmx` property gives you access to two methods for rendering JSX. These are:
#### `HttpContext.htmx.render`
```tsx
render: <TData extends Record<string, unknown>>(
  view: Component<TData> | Element | string,
  data?: TData
) => Promise<JSX.Element>
```
This method lets you render your components. 

```tsx
// routes.tsx
import { MyComponent, } from '#components'

route.get('/', async ({ htmx }) => {
  return htmx.render(MyComponent)
  // If your component takes props, data option will be typed accordingly
  return htmx.render(MyComponent, { name: 'John' })
})
```

#### `HttpContext.htmx.stream`
```tsx
stream: <TData extends Record<string, unknown>>(
  view: Component<TData & { rid?: number | string }>,
  data?: TData,
  errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]
) => void
```

You can `await` any data in the component normally, as they are not react components but just functions that are converted from syntax sugar into pure javascript. 

```tsx 
async function MyComponent() {
  const data = await fetch('https://api.com/data')
  return <div>{data}</div>
}
```

But you may want to show most of your UI instantly, and then stream only the parts that require async data. You can do that with `stream` method. It will render the component and then stream the async parts as they resolve. Underneath, this method uses AdonisJS streaming, so you do not return the result of the method, you just call it.

`stream` accepts optional `errorCallback` , which is called when an error occurs during streaming. By default, it will log the error and send 500 status code, but you can override it to handle errors in your own way. It comes directly from the framework [streaming methods](https://docs.adonisjs.com/guides/response#streaming-content). The method will also pass the render id to your component - through `rid` prop that you can pass to the `Suspense` component as unique identifier. If you want to, feel free to generate one yourself.

```tsx
import { Suspense } from 'adonis-htmx'

router.get('/', async ({ htmx }) => {
  htmx.stream(MyComponent, {}, (error) => ([`Rendering failed: ${error.message}`, 500]))
})

function MyComponent({ rid }) {
  return (<>
    <div>Instant UI</div>
    <Suspense
      rid={rid}
      fallback={<div>Loading username...</div>}
      catch={(err) => <div>Error: {err.stack}</div>}
    >
      <MyAsyncComponent />
    </Suspense>
  </>)
}

async function MyAsyncComponent() {
  const data = await fetch('https://api.com/data')
  return <div>{data}</div>
}
```
### Helper methods
#### `viteAssets`
```tsx
function viteAssets(entries: string[], attributes: Record<string, unknown> = {}): JSX.Element
```
If you use vite with AdonisJS, there are helper methods for edge templates that integrate your templates with vite. `adonis-htmx` provides similar helpers for JSX. 

You can use `viteAssets` method to generate resource tags in your JSX that refer to the vite entries.

For vite config like this:
```tsx
adonisjs({
  entrypoints: ['resources/js/app.js'],
})
```

You can add the javascript entry to your JSX like this:
```tsx
import { viteAssets } from 'adonis-htmx'

function MyComponent() {
  return (
    <html>
      <head>
        {viteAssets(['resources/js/app.js'])}
      </head>
      <body>
        <div>Hello World</div>
      </body>
    </html>
  )
}
```
#### `viteReactRefresh`

```tsx
function viteReactRefresh(): JSX.Element
```

This function will add the necessary script tags to enable vite's react refresh feature. Make sure it is registered before actual react scripts.

```tsx
import { viteReactRefresh, viteAssets } from 'adonis-htmx'

function MyComponent() {
  return (
    <html>
      <head>
        {viteReactRefresh()}
        {viteAssets(['resources/js/app.js'])}
      </head>
      <body>
        <div>Hello World</div>
      </body>
    </html>
  )
}
```

#### `route`
You can use `route` method to generate urls for your routes. It works the same way as in edge templates.

```tsx
// routes.tsx
import router from "@adonisjs/core/services/router";

router.get('/foo', async () => {
  return "foo"
}).as('foo')
```

```tsx

// MyComponent.tsx
import {route} from 'adonis-htmx'

function MyComponent() {
  return (
    <a href={route('foo')}>Home</a>
  )
}
```

## Thanks
Huge shoutouts to [adonisjsx](https://github.com/macieklad/adonisjsx) which is a library that `adonis-htmx` is based on. If you don't need tight HTMX integration and just want to render JSX I encourage you to check it out.

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"

[license-image]: https://img.shields.io/npm/l/adonis-htmx?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'

[npm-image]: https://img.shields.io/npm/v/adonis-htmx.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/adonis-htmx 'npm'
