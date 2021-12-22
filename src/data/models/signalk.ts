import { flow, Instance, types } from 'mobx-state-tree'
import { API } from '../../lib/api'
import { ECRUDState, CRUDState } from '../types'

export const SignalK = types
  .model({
    state: types.enumeration(CRUDState),
    keys: types.array(types.string),
    error: types.maybe(types.string),
  })
  .actions((signalk: any) => {
    const actions: any = {
      hydrate () {
        if (signalk.state !== ECRUDState.PENDING) {
          return
        }

        return actions.fetch()
      },

      fetch: flow(function* fetchYachts () {
        signalk.state = ECRUDState.FETCHING
        
        try {
          const keys = yield API.signalk.keys()

          signalk.keys = keys
          signalk.state = ECRUDState.FETCHED
        } catch (err) {
          console.log(`Error fetching signalk keys: ${err.message}`)
          signalk.state = ECRUDState.ERRORED
          signalk.error = err.message
        }
      })
    }

    return actions
  })

export type TSignalK = Instance<typeof SignalK>

export const signalkInitialState = {
  state: ECRUDState.PENDING,
  keys: [],
  error: undefined,
}
