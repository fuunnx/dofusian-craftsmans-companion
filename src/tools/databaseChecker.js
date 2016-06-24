import db from '../bdd'
import {nameToDofusId} from 'utils/strings'
const notNormed = db.filter((x) => {
  if(!x.id || !x.name) return false
  const normId = x.id.match(/\d+-(.*)/)[1]
  const normName = nameToDofusId(x.name)
  const result = normName != normId
  if(result) {
    console.log(normId, '!=', normName)
    console.log('id:', x.id)
    console.log('name:', x.name)
  }
  return result
})
console.log(notNormed)
console.log(notNormed.length)
