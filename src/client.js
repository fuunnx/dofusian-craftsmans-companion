import {run} from '@cycle/rx-run'
import {drivers} from './drivers'

const {main} = require('./main')
run(main, drivers)


// waiting for cycle-restart diversity release !

// import isolate from '@cycle/isolate'
// import {rerunner, restartable} from 'cycle-restart'
//
// const rerun = rerunner(run, isolate)
// rerun(main, makeRestartable(drivers))
// if (module.hot) {
//   module.hot.accept('./main', () => {
//     console.clear() // eslint-disable-line no-console
//     const {main} = require('./main')
//     rerun(main, makeRestartable(drivers))
//   })
// }
//
// function makeRestartable(drivers) {
//   return Object.keys(drivers).reduce(
//     (_drivers, name) => {
//       if (isInBlackList(name)) {
//         _drivers[name] = drivers[name]
//       } else if (name === 'DOM') {
//         _drivers[name] = restartable(drivers[name], {pauseSinksWhileReplaying: false})
//       } else {
//         _drivers[name] = restartable(drivers[name])
//       }
//       return _drivers
//     },
//     {},
//   )
// }
//
// function isInBlackList(name) {
//   const blackList = ['M']
//   return blackList.indexOf(name) > -1
// }
