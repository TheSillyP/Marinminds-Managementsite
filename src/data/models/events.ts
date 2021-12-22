import { flow, Instance, types } from 'mobx-state-tree'
import { API } from '../../lib/api'
import { ECRUDState, CRUDState } from '../types'

export const EventRule = types
  .model({
    path: types.string,
    operator: types.string,
    threshold: types.number,
  })

export const EventCondition = types
  .model({
    kind: types.string,
    frequencyThreshold: types.integer,
    association: types.string,
    rules: types.array(EventRule),
    event: types.maybe(types.string),
    id: types.maybe(types.string),
    createdAt: types.maybe(types.number),
    updatedAt: types.maybe(types.number),
  })

export const EventEffect = types
  .model({
    action: types.string,
    target: types.array(types.string),
    actionPath: types.optional(types.string, ''),
    actionAssertedValue: types.optional(types.number, 1),
    actionDeassertedValue: types.optional(types.number, 0),
    actionAssertedStatus: types.optional(types.string, ''),
    actionDeassertedStatus: types.optional(types.string, ''),
    event: types.maybe(types.string),
    id: types.maybe(types.string),
    createdAt: types.maybe(types.number),
    updatedAt: types.maybe(types.number),
  })

export const Event = types
  .model({
    name: types.string,
    yacht: types.string,
    conditions: types.array(EventCondition),
    effects: types.array(EventEffect),
    active: types.optional(types.boolean, true),
    id: types.maybe(types.string),
    createdAt: types.maybe(types.number),
    updatedAt: types.maybe(types.number),
    asserted: types.optional(types.boolean, false),
    muted: types.optional(types.boolean, false),
    acknowledged: types.optional(types.boolean, false),
  })

export const Events = types
  .model({
    skip: 0,
    limit: 500,
    total: 0,
    count: 0,
    state: types.enumeration(CRUDState),
    events: types.array(Event),
    error: types.maybe(types.string),
    eventToCreate: types.maybe(Event)
  })
  .views((events: any) => ({
    get canCreateEvent () {
      const { eventToCreate } = events
      const isNonEmptyString = (mixed: any) => (typeof mixed === 'string' && mixed.trim() !== '')
      const isNumber = (mixed: any) => (typeof mixed === 'number' && !isNaN(mixed))
      
      if (!eventToCreate) {
        return false
      }

      let conditionsValid = true
      let effectsValid = true

      for (const effect of eventToCreate.effects) {
        if (!isNonEmptyString(effect.action)) {
          effectsValid = false
        }
      }

      for (const condition of eventToCreate.conditions) {
        if (!isNonEmptyString(condition.kind)) {
          conditionsValid = false
        }

        if (!isNonEmptyString(condition.association)) {
          conditionsValid = false
        }

        let rulesAreValid = true

        for (const rule of condition.rules) {
          if (!isNonEmptyString(rule.path)) {
            rulesAreValid = false
          }
          if (!isNonEmptyString(rule.operator)) {
            rulesAreValid = false
          }
          if (!isNumber(rule.threshold)) {
            rulesAreValid = false
          }
        }

        if (!rulesAreValid) {
          conditionsValid = false
        }
      }

      if (!isNonEmptyString(eventToCreate.name)) {
        return false
      }
      if (!isNonEmptyString(eventToCreate.yacht)) {
        return false
      }

      if (!conditionsValid || !effectsValid) {
        return false
      }

      return true
    }
  }))
  .actions((events: any) => {
    const actions: any = {
      toggleMute (evt: TEvent) {
        return actions.updateEvent(evt.id, { muted: !evt.muted })
      },

      toggleAcknowledged (evt: TEvent) {
        return actions.updateEvent(evt.id, { acknowledged: !evt.acknowledged })
      },

      toggleActive (evt: TEvent) {
        return actions.updateEvent(evt.id, { active: !evt.active })
      },

      destroyEvent: flow(function * destroyEvent(id: string) {
        try {
          const { body: destroyed } = yield API.events.destroy(id)
          console.log(`[events/destroyEvent] destroyed event:`, destroyed)
          yield actions.fetch()
        } catch (err) {
          console.log(`Error desroying event: ${err.message}`)
          events.state = ECRUDState.ERRORED
          events.error = err.message
        }
      }),

      updateEvent: flow(function * updateEvent(id: string, updates: Partial<TEvent>) {
        try {
          const { body: updated } = yield API.events.update(id, updates)
          console.log(`[events/updateEvent] updated event:`, updated)
          yield actions.fetch()
        } catch (err) {
          console.log(`Error updating event: ${err.message}`)
          events.state = ECRUDState.ERRORED
          events.error = err.message
        }
      }),

      resetEventToCreate () {
        events.eventToCreate = undefined
      },

      setEventToCreate (data: any) {
        try {
          events.eventToCreate = Event.create({ ...data })
        } catch (err) {
          console.log(`[eventToCreate] event is invalid: ${err.message}`, data)
        }
      },

      createEvent: flow(function * createEvent () {
        if (!events.canCreateEvent) {
          return
        }

        try {
          const { body: created } = yield API.events.create(events.eventToCreate.toJSON())
          console.log(`[events/createEvent] created event:`, created)
          yield actions.fetch()
        } catch (err) {
          console.log(`Error creating event: ${err.message}`)
          events.state = ECRUDState.ERRORED
          events.error = err.message
        }
      }),

      hydrate () {
        if (events.state !== ECRUDState.PENDING) {
          return
        }

        return actions.fetch()
      },

      fetch: flow(function* fetchEvents () {
        events.state = ECRUDState.FETCHING
        
        try {
          const { body: response } = yield API.events.fetch()
          const { total, skip, limit, count, results } = response

          events.skip = skip
          events.total = total
          events.count = count
          events.limit = limit
          events.events = results.map((event: any) => Event.create(event))
          events.state = ECRUDState.FETCHED
        } catch (err) {
          console.log(`Error fetching events: ${err.message}`)
          events.state = ECRUDState.ERRORED
          events.error = err.message
        }
      })
    }

    return actions
  })

export type TEventRule = Instance<typeof EventRule>
export type TEventCondition = Instance<typeof EventCondition>
export type TEventEffect = Instance<typeof EventEffect>
export type TEvent = Instance<typeof Event>
export type TEvents = Instance<typeof Events>

export const eventsInitialState = {
  state: ECRUDState.PENDING,
  events: [],
  error: undefined,
  eventToCreate: undefined,
}
