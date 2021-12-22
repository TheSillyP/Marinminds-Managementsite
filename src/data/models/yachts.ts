import { flow, Instance, types, getEnv } from 'mobx-state-tree'
import { API } from '../../lib/api'
import { TUser } from './users'
import { ECRUDState, CRUDState, IAPINotification } from '../types'

export const YachtStatusModel = types.model({
  batterySOC: types.maybe(types.number),
  fuel: types.maybe(types.number),
  latitude: types.maybe(types.number),
  longitude: types.maybe(types.number),
  range: types.maybe(types.number),
  water: types.maybe(types.number),
  status: types.maybe(types.string),
})

export const YachtModel = types
  .model({
    name: types.string,
    owner: types.string,
    image: types.maybe(types.string),
    active: types.optional(types.boolean, true),
    id: types.maybe(types.string),
    createdAt: types.maybe(types.integer),
    updatedAt: types.maybe(types.integer),
    blackboxId: types.maybe(types.string),
    status: types.maybe(types.union(YachtStatusModel, types.string)),
  })
  .actions((self) => ({
    setStatus (status: TYachtStatusModel) {
      self.status = YachtStatusModel.create(status)
    }
  }))

export const YachtsModel = types
  .model({
    skip: 0,
    limit: 500,
    total: 0,
    count: 0,
    state: types.enumeration(CRUDState),
    yachts: types.array(YachtModel),
    error: types.maybe(types.string),
    selected: types.maybe(types.string),
    saving: types.boolean,
    addName: '',
    addOwner: '',
    addYacht: '',
    addBlackboxId: '',
    pendingNotification: types.maybe(types.frozen()),
    editing: types.maybe(types.string),
  })
  .views((yachts: any) => ({
    get selectedYacht () {
      return yachts.yachts.find((y: TYachtModel) => y.id === yachts.selected)
    }
  }))
  .actions((yachts: any) => {
    const actions: any = {
      setField (key: string, value: string) {
        yachts[key] = value
      },

      setEditing (id: string | undefined = undefined) {
        yachts.editing = id
      },

      selectYacht: flow(function * selectYacht(yacht: TYachtModel) {
        try {
          yachts.selected = yacht.id

          if (yachts.selected) {
            const selected = yachts.yachts.find((candidate: TYachtModel) => (yachts.selected && candidate.id === yachts.selected))
            const status = yield API.fetchYachtStatus(selected.id)
            console.log(`Setting status on ${selected.name}`, status)
            selected.setStatus(status)
          }
        } catch (err) {
          console.log(`[selectYacht] error setting yacht: ${err.message}`)
        }
      }),

      destroyYacht: flow(function* destroyYacht (id: string) {
        yachts.saving = true

        try {
          const destroyed = yield API.destroyYacht(id)
          yield actions.fetch()

          console.log(`[destroyYacht] destroyed:`, destroyed)
        } catch (err) {
          console.log(`Error destroying yacht: ${err.message}`)
        }

        yachts.saving = false
      }),

      updateYacht: flow(function* updateYacht (id: string, update: Partial<TYachtModel>) {
        yachts.saving = true

        try {
          const updated = yield API.updateYacht(id, update)
          yield actions.fetch()

          console.log(`[updateYacht] updated:`, updated)

          yachts.addName = ''
          yachts.addOwner = ''
          yachts.addYacht = ''
          yachts.addBlackboxId = ''
          yachts.editing = undefined
        } catch (err) {
          console.log(`Error updating yacht: ${err.message}`)
        }

        yachts.saving = false
      }),

      createYacht: flow(function* createYacht () {
        const create = {
          name: yachts.addName,
          owner: yachts.addOwner,
          image: yachts.addYacht,
          blackboxId: yachts.addBlackboxId,
        }

        yachts.saving = true

        try {
          const created = yield API.createYacht(create)
          yield actions.fetch()

          console.log(`[createYacht] created:`, created)

          yachts.addName = ''
          yachts.addOwner = ''
          yachts.addYacht = ''
          yachts.addBlackboxId = ''
          yachts.editing = undefined
        } catch (err) {
          console.log(`Error creating yacht: ${err.message}`)
        }

        yachts.saving = false
      }),

      hydrate () {
        if (yachts.state !== ECRUDState.PENDING) {
          return
        }

        return actions.fetch()
      },

      setNotificationToCreate (payload: Partial<IAPINotification>) {
        yachts.pendingNotification = payload
      },

      sendNotification: flow(function * sendNotification(payload: Partial<IAPINotification>) {
        try {
          const result: IAPINotification = yield API.notifications.create(payload)
          console.log(`Created notification:`, result)
          return result
        } catch (err) {
          console.log(`Error creating notification for yacht ${payload.yacht}: ${err.message}`)
        }
      }),

      setStatus: flow(function * setStatus(message: string = '') {
        try {
          const selected = yachts.yachts.find((candidate: TYachtModel) => (yachts.selected && candidate.id === yachts.selected))
          let result

          if (selected) {
            result = yield API.setYachtStatusMessage(selected.id, message)
          }
          
          const status = yield API.fetchYachtStatus(selected.id) 
          console.log(`Set yacht status:`, result, status)
          selected.setStatus(status)
          return status
        } catch (err) {
          console.log(`Error setting status: ${err.message}`)
        }
      }),

      fetch: flow(function* fetchYachts () {
        yachts.state = ECRUDState.FETCHING
        
        try {
          const { body: response } = yield API.fetchYachts()
          const { total, skip, limit, count, results } = response

          yachts.skip = skip
          yachts.total = total
          yachts.count = count
          yachts.limit = limit
          yachts.yachts = results.map((yacht: any) => YachtModel.create({
            ...yacht,
            status: typeof yacht.status === 'string' ? undefined : yacht.status
          }))

          let selected = undefined

          const { getRootStore } = getEnv(yachts)
          const { chat, auth, users } = getRootStore()

          const user = users.users.slice().find(({ id }: TUser) => (id === auth.user().sub))
          
          if (user && user.yachts.length && yachts.yachts.length) {
            selected = yachts.yachts.find((yacht: TYachtModel) => (yacht.id === user.yachts.slice()[0].id))
          }

          if (selected) {
            const status = yield API.fetchYachtStatus(selected.id)
            console.log(`Setting status on ${selected.name}`, status)
            selected.setStatus(status)
          }

          yachts.state = ECRUDState.FETCHED
          yachts.selected = selected && selected.id

          if (yachts.selected) {
            chat.setYacht(yachts.selected)
          }
        } catch (err) {
          console.log(`Error fetching yachts: ${err.message}`)
          yachts.state = ECRUDState.ERRORED
          yachts.error = err.message
        }
      })
    }

    return actions
  })

export type TYachtsModel = Instance<typeof YachtsModel>
export type TYachtModel = Instance<typeof YachtModel>
export type TYachtStatusModel = Instance<typeof YachtStatusModel>

export const yachtsInitialState = {
  state: ECRUDState.PENDING,
  yachts: [],
  error: undefined,
  selected: undefined,
  saving: false
}
