# AutoSwagger

> AutoSwagger is a [swagger(openAPI)](https://swagger.io) tool running in [Electron](https://electronjs.org/), it can import a swagger(openAPI) document then send request and receive response in a convenience way.

#### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build
```
#### ScreenShot
![screenshot](./screenshot.gif?raw=true)

#### NPM Packages

|Name	|Desc	|
|--------	|--------	|
|vue	|[🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.](https://vuejs.org)	|
|vue-electron	|[The vue plugin that wraps electron APIs to the Vue object.](https://github.com/SimulatedGREG/vue-electron)	|
|lowdb	|[⚡ lowdb is a small local JSON database powered by Lodash (supports Node, Electron and the browser)](https://github.com/typicode/lowdb)	|
|got	|[Simplified HTTP requests.](https://github.com/axios/axios)  like [axios](https://github.com/axios/axios)	|
|element-ui	|[A Vue.js 2.0 UI Toolkit for Web](https://github.com/ElemeFE/element)	|
|iview	|[A high quality UI Toolkit built on Vue.js 2.0](https://github.com/iview/iview)	|
|jsoneditor	|[A web-based tool to view, edit, format, and validate JSON](https://github.com/josdejong/jsoneditor)	|
|mavon-editor	|[A markdown editor based on Vue that supports a variety of personalized features](https://github.com/hinesboy/mavonEditor)	|
|fs-extra	|[Node.js: extra methods for the fs object like copy(), remove(), mkdirs()](https://github.com/jprichardson/node-fs-extra)	|
|lodash	|[A modern JavaScript utility library delivering modularity, performance, & extras.](https://github.com/lodash/lodash)	|
|lodash-id	|[Makes it easy to manipulate id-based resources with lodash or lowdb](https://github.com/typicode/lodash-id)	|
|countup.js	|[Animates a numerical value by counting to it](https://github.com/inorganik/countUp.js)	|
|vue-moment	|[Handy Moment.js filters for your Vue.js project.](https://github.com/brockpetrie/vue-moment)	|
|vue-smooth-dnd	|[Vue wrappers components for smooth-dnd](https://github.com/kutlugsahin/vue-smooth-dnd)	|
|vue-splitpane	|[Split-Pane component built with vue2.0, can be split vertically or horizontally.](https://www.npmjs.com/package/vue-splitpane)	|

#### DataBase Objects
these objects initialized in `src/renderer/datastore/index.js'

* workspace `represnt for one swagger json document`
```
{
	"id":0,
	"name":"default-workspace",
	"desc":""
}
```
* folder `corresonding tags in swagger json document`
```
{
	"id":0,
	"workspaceId":0,
	"name":"default-folder"
}
```
* request
```
{
	"id":0,
	"workspaceId":0,
	"folderId":null,
	"name":"new-request-01",
	"method":"GET",
	"url":"",
	"data":null,
	"sort":0
}
```
* response
```
{
    "id":null,
    "requestId":null,
    "header":null,
    "data":null
}
```
* lastState `app state, would restore everytime`
```
{
	id: 0,
    lastWorkspaceId: 0,
    lastFolderId: 0,
    lastRequestId: 0,
    openedSubmenuList:[]
}
```


---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli),[lowdb](). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
