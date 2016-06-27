import {Observable as O} from 'rx'
import {L} from 'stanga'

import view from './view'
import {k, percent as perc, sign} from 'utils/currency'
import {
  toggleBenefitsPrintMode,
  append,
} from './actions'
import intent from './intent'

export const Card = ({M, updates$, viewParam$, DOM}) => {
  M.distinctUntilChanged().subscribe(x => console.log(x))
  const state$ = O.combineLatest(
    M.distinctUntilChanged(), viewParam$.distinctUntilChanged(),
    (card = {}, params) => ({
      ...card,
      ...params,
      benefits: benefits(card),
      benefitsRate: printBenefitsRate(card),
      secondaryInfo: (params.benefits == '%')
        ? printBenefits(card)
        : printBenefitsRate(card),
      primaryInfo: (params.benefits == '%')
        ? printBenefitsRate(card)
        : printBenefits(card),
    })
  )

  const vtree$ = view(state$)
  const intents = intent(DOM)
  const update$ = O.merge(
      intents.save$.map(price => ({
        type: 'SET_PRICE',
        price,
      })),
      intents.craftBtnIntents.increment$.map(() => ({
        type: 'PLAN',
        quantity: 1,
      })),
      intents.craftBtnIntents.decrement$.map(() => ({
        type: 'RM_PLANNED',
        quantity: 1,
      })),
      intents.stockBtnIntents.increment$.map(() => ({
        type: 'CRAFT',
        quantity: 1,
      })),
      intents.stockBtnIntents.decrement$.map(() => ({
        type: 'RM_STORED',
        quantity: 1,
      })),
      intents.sellBtnIntents.increment$.map(() => ({
        type: 'SELL',
        quantity: 1,
      })),
      intents.sellBtnIntents.decrement$.map(() => ({
        type: 'RM_SOLD',
        quantity: 1,
      })),
      intents.toggleFavorites$.map(() => ({
        type: 'TOGGLE_FAVORITES',
      })),
    )
    .timestamp()
    .withLatestFrom(
      M.lens(L.props('id', 'name')),
      ({value, timestamp}, {id, name}) => ({
        ...value,
        timestamp,
        id,
        name,
      }),
    )

  const mod$ = O.merge(
    viewParam$.lens('benefits').mod(
      intents.toggleBenefitsPrintMode$.map(toggleBenefitsPrintMode)),
    viewParam$.lens('editing').set(intents.startEdit$.map(() => true)),
    viewParam$.lens('editing').set(intents.endEdit$.map(() => false)),
    viewParam$.lens('focused').set(intents.focus$),
    updates$.mod(update$.map(append)),
  )

  return {
    DOM: vtree$,
    M: mod$,
  }
}

const benefits = ({price, cost}) => price - cost
const benefitsRate = ({price, cost}) => benefits({price, cost}) / cost
const prettyPrint = (signFn, formatFn, x) =>
  `${signFn(x) + formatFn(x).replace('-', '')}`

const printBenefits = x =>
  prettyPrint(sign('-', '+'), k, benefits(x))
const printBenefitsRate = x =>
  prettyPrint(sign('⨉', '⨉'), x => perc(x + 1), benefitsRate(x))
