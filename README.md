# Play React 101

~~A todo list app~~
A introspection app

## todo

- [ ] move this to learning Note?
- [x] how to sort items?
  - seems can not do it on UI, have to sort array first(make a copy of state data),
    - then use sorted array to map to jsx
  - [ref](https://stackoverflow.com/questions/43572436/sort-an-array-of-objects-in-react-and-render-them/43572944)
- [x] disable delete button when deleting
- [ ] confirm(2 steps) before delete
- [x] router(nav bar)
- [ ] sometimes page doesn't load correctly when nav by click on backward button of chrome
- [ ] cache loaded data for 5 sec when switch tabs?
- [ ] Introspection
  - [x] allow add note when submit fulfillment
  - [x] show history fulfillments
  - [x] fix days ago calculation bug
  - [x] archive history fulfillments
  - [ ] increase list width when showing remark
  - [x] extract fulfillment history records to a component
    - [x] test show remark
    - [x] test load more
  - [x] support soft delete routine via popup to input a reason
  - [x] support soft delete fulfillment record via popup
  - [x] support recursive routines
    - [x] warning when scheduled days approach
  - [ ] impl backend with node.js
    - [ ] migrate to node first
    - [ ] sync filter flags to backend
    - [ ] notification hub
      - [ ] can view history messages
      - [ ] auto stack when multi messages same/near time?
- [ ] state manage deep dive
- [ ] router deep dive
- [ ] use webpack ?
- [ ] auth
  - [ ] jwt token

## how to

```sh
# 1. how start the app
  # start the api server(node or asp.net) first
  npm run start # note the settings {}.scripts.start in package.json


# 2. release website
  npm run build # note the settings {}.scripts.build in package.json


```

## react basic

- background
  - react is a js library(though behave like a framework) published by facebook
  - SPA web app
  - the 'V' in MVC(backend)
  - name convention
    - capital first char for component name
- virtual DOM
- state
  - component can have state which is an object that determines how that component renders and behaves
  - we can also have 'application level' state by using a state manager like 'Redux' or reacts own 'context api'
    - which can be used to share data between components
  - change state data(non primary types, i.e object, array, classes) without mutation
    - do not do this `const player = {score:1, name:'Jeff'}; player.score = 2;`
    - do do this     `const player = {score:1, name:'Jeff'}; const newPlayer = Object.assign({}, player, {score:2});`
      - or           `const newPlayer = {...player, score:2};`
      - for array    `const newArray = old.slice()`
- uses Webpack but needs no configuration from you
- comes bundled with a dev server with hot reload
- prerequisite
  - nodejs
  - react developer tools (chrome web store)
- react library
  - react-dom, load components into browser
  - react-native, build app for mobile
  - react-scripts, dev server related
- service worker
  - for progressive web app and offline content
- lifecycle methods
  - render()
  - componentWillMount()
  - componentDidMount()
    - do ajax call inner this func???
- events
  - define event callback with arrow function so it gets proper `this` (which is the component) inner it.
- JSX - html code block
  - use `className=` instead of `class=`
  - syntax & api
    - `<React.Fragment>` lets you return multiple elements in a render() method without creating additional dom element
    - `props` pass values from parent to child component
      - `ChildComponent.propTypes = { ... }` setup type checking for props
      - access it by `this.props.x` in child component
      - assign value by `<ChildComponent x = { ... }>`

## webpack

- webpack (v4)
- background
  - module bundler
    - webpack reads the entry point and analyzes its dependencies, its dependencies' dep, and so on
    - webpack bundles the entry point(e.g index.js or app.js) and all its dependencies into a single file
  - dev only dependency
  - for smaller and faster build
  - minify js/css files
  - bundle source files into one js file(static assets - can view on browser directly, without web server)
- functionality
  - code splitting
  - loaders (css, sass, jsx, ts)
    - css-loader, style-loader
  - plugins
- preset
  - babel-preset-env, without any config, 'env' behaves the same as babel-preset-es2015/es2016/es2017 together
- package.json file
  - `scripts.build: "webpack"`
  - on bash window: `npm run build`
- webpack config file (webpack.config.js in root folder)
  - entry: `./src/index.js`
  - output
    - path: `path.join(__dirname, '/dist')`
    - filename: `index_bundle.js` //can be any name you want
  - module
    - rules
      - // rule sample 0
      - test: `/\.js$/` //end with .js
      - exclude: `/node_modules/`
      - use: `{ loader: 'babel-loader' }`
      - query: `{ presets: ['env'] }`
      - // rule sample 1
      - test: `/\.css$/`
      - use: `{ loader: 'style-loader!css-loader' }`
    - plugins: `[ new HtmlWebpackPlugin({ template: './src/index.html' })]`
- webpack-dev-server package
  - auto reload after detect file changes
  - setup
    - install by `npm install webpack-dev-server --save-dev`
    - update package.json, add `scripts.start: "webpack-dev-server --output-public-path=/dist/"`
    - on bash window, run `npm start`

## babel

- babel ability
  - translate ES6(or later) to lower version (e.g es5) for compatible
  - a js compiler
- fix async, await error 'regeneratorRuntime is not defined'
  - install babel-polyfill, babel-preset-env, babel-preset-stage-0
  - webpack.config.js, add `babel-polyfill` to entry, add `stage-0` to `loaders[].query.presets[]`
- config

```js
```

## CLI

```sh
# install dependencies
npm install

# bundles the app into static files for prod
npm run build

# start dev server
npm start

### start test runner
## npm test

# one step - create app (under current folder) - this won't install react globally
npx create-react-app .

# step by step - with webpack and babel
npm init --yes         # create package.json
npm i react react-dom  # react libraries (prod only need these 2)
# dev dependencies
npm i --save-dev webpack webpack-dev-server webpack-cli
npm i --save-dev babel-core babel-loader babel-preset-env babel-preset-react html-webpack-plugin
# create file in root folder and setup config
touch webpack.config.js
# create app entry files
touch ./src/index.html
touch ./src/index.js
# add <div id='app'></div> to <body>  # react-dom will looking for this elem and insert react view
# create file for babel presets in root folder
touch .babelrc  # add { "presets": ["env", "react"] } to file
# setup index.js - hookup react render with dom elem
# main line
ReactDom.render(<App />, document.getElementById('app'));
# impl App.js
// you app logic
# modify package.json, set following entries
scripts.start: "webpack-dev-server --mode development --hot --open"
scripts.build: "webpack --mode production"

# removes this tool and copies build dependencies, config files and scripts into the app dir
# if you do this, you can't go back
# npm run eject

```

## 3rd party packages

### react-bootstrap

- setup
  - install `npm install react-bootstrap bootstrap`
  - include css in App.js `import 'bootstrap/dist/css/bootstrap.min.css';`
  - import in component `import Button from 'react-bootstrap/Button'`
    - import individual components like above rather than the entire library, it only pulls components that you use, thus reduce traffic sent to client

## error fix

- deploy to subdomain
  - // -------------------------- correct the url path --v
  - opt1) package.json file, `homepage:"http://leoskywork.com/r101/"` # `only affect build`
    - alternative, you can set `homepage:"."` rather hard coded the domain
  - opt2) app.js file, `<Router basename="/r101">`
  - opt31) tag `<Link to={process.env.PUBLIC_URL}+'/about' ...` ---# `affect tag <a>`
  - opt32) tag `<Route path={process.env.PUBLIC_URL}+'/about' ...` # `affect router(browser address input)`
  - do (opt1, opt2) or (opt1, opt31, opt32)
  - // -------------------------- auto move bits to dest folder --v
  - modify package.json, `scripts.build: "react-scripts build && rm -rf ../dist/react101 && mv build ../dist/react101"`
  - run `npm run build`
- error 404 when refresh page on a sub url path(non-home page)
  - a quick work around is to config IIS to redirect to home page (e.g /r101/) when have 404 error
  - sophisticated approach would be use hash history/browser history
    - [ref](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually)
    - [ref2](https://github.com/jintoppy/react-training/blob/master/basic/node_modules/react-router/docs/guides/Histories.md#browserhistory)

---

## Below is auto generated ----------------------------------------------------------

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: <https://facebook.github.io/create-react-app/docs/code-splitting>

### Analyzing the Bundle Size

This section has moved here: <https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size>

### Making a Progressive Web App

This section has moved here: <https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app>

### Advanced Configuration

This section has moved here: <https://facebook.github.io/create-react-app/docs/advanced-configuration>

### Deployment

This section has moved here: <https://facebook.github.io/create-react-app/docs/deployment>

### `npm run build` fails to minify

This section has moved here: <https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify>
