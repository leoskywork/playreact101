# React 101

## todo

- [ ] move this to Note?

## basic

- background
  - react is a js library(though behave like a framework) published by facebook
  - SPA web app
- state
  - component can have state which is an object that determines how that component renders and behaves
  - we can also have 'application level' state by using a state manager like Redux or reacts own 'context api'
    - which can be used to share data between components
- uses Webpack but needs no configuration form you
- comes bundled with a dev server with hot reload
- prerequisite
  - nodejs
  - react dev tool
- library
  - react-dom, load components into browser
  - react-native, build app for mobile
  - react-scripts, dev server related
- service worker
  - for progressive web app and offline content

## CLI

```sh
# bundles the app into static files for prod
npm run build

# start dev server
npm start

# start test runner
npm test

# create app (under current folder) - this won't install react globally
npx create-react-app .

# removes this tool and copies build dependencies, config files and scripts into the app dir
# if you do this, you can't go back
npm run eject

```

## more
