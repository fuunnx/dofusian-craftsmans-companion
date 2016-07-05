import express from 'express'
import socket from 'socket.io'
import http from 'http'
import fs from 'fs-promise'
import {Observable as O} from 'rx'
import {stateMachine} from './src/stateMachine'
import {normalizeDB} from './src/attachMetadata'
import {toMap} from './utils/iterable'

const app = express()
const server = http.Server(app)
const io = socket(server)

// proxy the request for static assets
app.use('/initialstate', express.static(`./static/bdd.json`))

io.on('connection', function (socket) {
  const path = './static/db.json'
  const initialState$ = readJson(path)
    .map(toMap)

  const transactions$ = listen(socket, 'transaction')
  const state$ = stateMachine([transactions$], initialState$)
  initialState$.subscribe(x => socket.emit('welcome', x.toArray()))

  state$.skip(1).map(x => x.toArray())
    .debounce(1000)
    .subscribe(x => fs
      .writeJson('./static/db.json', x)
      .then(() => console.log('successfully write file db.json'))
      .catch(x => console.error('error while writing file:', x))
    )
})
function readJson (path) {
  return O.fromPromise(fs.readJson(path))
}

function listen (socket, name) {
  return O.fromEventPattern(
      (h) => socket.on(name, h),
      (h) => socket.removeListener(name, h))
    .shareReplay(1)
}

app.use('/*', express.static(`./dist/dev/index.html`))

// run the two servers
server.listen(3001, () => console.log('listening to localhost:3001'))
