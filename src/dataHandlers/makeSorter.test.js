import {makeSorter} from './makeSorter'
import {createGroup, assert} from 'painless'

const test = createGroup('dashboard/makeSorter')
test(`makeSorter('benefits') should order by benefits asc`, () => {
  const sort = makeSorter({property: 'benefits'})
  const input = [
    {price: 4, cost: 2}, //benefits = 2
    {price: 1, cost: 2}, //benefits = -1
    {price: 4, cost: 3}, //benefits = 1
  ]
  const expected = [
    {price: 1, cost: 2}, //benefits = -1
    {price: 4, cost: 3}, //benefits = 1
    {price: 4, cost: 2}, //benefits = 2
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
test(`makeSorter('benefits') should consider benefits as infinite when price is 0, then order them by cost`, () => {
  const sort = makeSorter({property: 'benefits', ascending: false})
  const input = [
    {price: 0, cost: 1, recipe: [{}]}, //benefits = Infinite -1
    {price: 102, cost: 2}, //benefits = 100
    {price: 0, cost: 2, recipe: [{}]}, //benefits = Infinite -2
    {price: 0, cost: 2, recipe: []}, //impossible -> -2
  ]
  const expected = [
    {price: 0, cost: 1, recipe: [{}]}, //benefits = Infinite -1
    {price: 0, cost: 2, recipe: [{}]}, //benefits = Infinite -2
    {price: 102, cost: 2}, //benefits = 100
    {price: 0, cost: 2, recipe: []}, //impossible -> -2
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
test(`makeSorter('benefitsRate') should order by benefits % asc`, () => {
  const sort = makeSorter({property: 'benefitsRate'})
  const input = [
    {price: 4, cost: 2}, //benefitsRate = x2.0
    {price: 1, cost: 2}, //benefitsRate = x0.5
    {price: 40, cost: 30}, //benefitsRate = x1.3
  ]
  const expected = [
    {price: 1, cost: 2}, //benefitsRate = x0.5
    {price: 40, cost: 30}, //benefitsRate = x1.3
    {price: 4, cost: 2}, //benefitsRate = x2.0
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
test(`makeSorter('price') should order by price`, () => {
  const sort = makeSorter({property: 'price'})
  const input = [
    {price: 4},
    {price: 1},
    {price: 40},
  ]
  const expected = [
    {price: 1},
    {price: 4},
    {price: 40},
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
test(`makeSorter('cost') should order by cost`, () => {
  const sort = makeSorter({property: 'cost'})
  const input = [
    {cost: 4},
    {cost: 1},
    {cost: 40},
  ]
  const expected = [
    {cost: 1},
    {cost: 4},
    {cost: 40},
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
test(`makeSorter('alphabetical') should order by name, caps and special chars agnostic`, () => {
  const sort = makeSorter({property: 'alphabetical'})
  const input = [
    {name: 'B'},
    {name: 'a'},
    {name: 'u2'},
    {name: 'u1'},
    {name: '8'},
    {name: 'é'},
    {name: '$'},
  ]
  const expected = [
    {name: '$'},
    {name: '8'},
    {name: 'a'},
    {name: 'B'},
    {name: 'é'},
    {name: 'u1'},
    {name: 'u2'},
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
test('putEmptyRecipesLast', () => {
  const sort = makeSorter({property: 'benefits', ascending: true})
  const input = [
    {name: '3', recipe: []},
    {name: '4'},
    {name: '1', recipe: [{}, {}]},
    {name: '2', recipe: [{}]},
    {name: '5', recipe: []},
  ]
  const expected = [
    {name: '1', recipe: [{}, {}]},
    {name: '2', recipe: [{}]},
    {name: '3', recipe: []},
    {name: '4'},
    {name: '5', recipe: []},
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
test('sort by level', () => {
  const sort = makeSorter({property: 'level', ascending: true})
  const input = [
    {level: '3', name: 'B'},
    {level: '3', name: 'A'},
    {level: '1', name: 'B'},
    {level: '2', name: 'A'},
    {level: '14', name: 'A'},
  ]
  const expected = [
    {level: '1', name: 'B'},
    {level: '2', name: 'A'},
    {level: '3', name: 'A'},
    {level: '3', name: 'B'},
    {level: '14', name: 'A'},
  ]
  const output = sort(input)
  return assert.deepEqual(output, expected)
})
