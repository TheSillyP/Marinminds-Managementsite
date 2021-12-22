import { flow, Instance, types, clone } from 'mobx-state-tree'
import { API } from '../../lib/api'
import { IAPIUser, ECRUDState, CRUDState, UserStatus } from '../../data/types'
import { YachtModel } from './yachts'

export const User = types.model({
  id: types.maybe(types.string),
  active: types.boolean,
  status: types.enumeration(UserStatus),
  email: types.string,
  phone_number: types.string,
  yachts: types.array(types.union(types.string, YachtModel)),
  role: types.optional(types.string, 'customer'),
  accessLevel: types.optional(types.integer, 20),
  password: types.maybe(types.string),
})

export const Users = types
  .model({
    state: types.enumeration(CRUDState),
    error: types.maybe(types.string),
    skip: types.number,
    limit: types.number,
    total: types.number,
    count: types.number,
    users: types.array(User),
    userToCreate: types.maybe(User),
    userToEdit: types.maybe(User),
    createdUser: types.maybe(User),
  })
  .views((model: any) => ({
    get managers () {
      return model.users.slice().filter((user: TUser) => user.role !== 'customer')
    },
    get customers () {
      return model.users.slice().filter((user: TUser) => user.role === 'customer')
    }
  }))
  .actions((model: any) => {
    const actions: any = {
      setCreatedUser (user?: TUser) {
        model.createdUser = user
      },

      setUserToEdit (user?: TUser) {
        model.userToEdit = user ? clone(user) : user
      },

      setUserToCreate (user?: Partial<TUser>) {
        try {
          model.userToCreate = !user ? user : User.create({ ...user } as TUser)
        } catch (err) {
          console.log(`[setUserToCreate] invalid user: ${err.message}`, user)
          model.userToCreate = undefined
        }
      },

      updateUser: flow(function * updateUser (user: TUser) {
        try {
          if (!user) {
            return
          }

          console.log(`[updateUser]`, user)

          yield API.users.update(user)
          yield actions.hydrate(true)
        } catch (err) {
          console.log('error', err.message)
          model.state = ECRUDState.ERRORED
          model.error = err.message
        }
      }),

      createUser: flow(function * createUser (user: TUser) {
        try {
          if (!user) {
            return
          }

          const created = yield API.users.create(user)
          yield actions.hydrate(true)

          actions.setCreatedUser(created)
        } catch (err) {
          console.log('error', err.message)
          model.state = ECRUDState.ERRORED
          model.error = err.message
        }
      }),

      toggleActive: flow(function * toggleActive (user: TUser) {
        try {
          yield API.users[user.active ? 'deactivate' : 'activate'](user.email)
          yield actions.hydrate(true)
        } catch (err) {
          console.log('error', err.message)
          model.state = ECRUDState.ERRORED
          model.error = err.message
        }
      }),

      destroy: flow(function * destroy (user: TUser) {
        try {
          yield API.users.destroy(user.email)
          yield actions.hydrate(true)
        } catch (err) {
          console.log('error', err.message)
          model.state = ECRUDState.ERRORED
          model.error = err.message
        }
      }),

      hydrate: flow(function * hydrateUsers (force: boolean = false) {
        if (!force && model.state !== ECRUDState.PENDING) {
          return
        }

        model.state = ECRUDState.FETCHING

        try {
          const users: IAPIUser[] = yield API.users.fetch()
          
          model.state = ECRUDState.FETCHED
          model.total = users.length
          model.count = users.length
          model.users = users.map((u: IAPIUser) => User.create(u)) as any
        } catch (err) {
          console.log('error', err.message)
          model.state = ECRUDState.ERRORED
          model.error = err.message
        }
      })
    }

    return actions
  })

export type TUser = Instance<typeof User>
export type TUsers = Instance<typeof Users>

export const usersInitialState = {
  skip: 0,
  limit: 0,
  total: 0,
  count: 0,
  users: [],
  state: ECRUDState.PENDING,
  error: undefined
}
