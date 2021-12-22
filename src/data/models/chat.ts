import { flow, Instance, types, getEnv } from 'mobx-state-tree'
import { TYachtModel } from './yachts'
import { API } from '../../lib/api'
import { IAPIChatMessage, ChatMessageKinds, EChatMessageKind, SyncStates, ESyncState, ECRUDState, CRUDState } from '../../data/types'

export const ChatMessage = types.model({
  state: types.optional(types.enumeration(SyncStates), ESyncState.PENDING),
  id: types.maybe(types.string),
  from: types.string,
  to: types.string,
  createdAt: types.maybe(types.integer),
  updatedAt: types.maybe(types.integer),
  message: types.string,
  kind: types.enumeration(ChatMessageKinds),
  yacht: types.union(types.maybe(types.string), types.maybeNull(types.string)),
  isOwn: false
})

export const Chat = types
  .model({
    messages: types.array(ChatMessage),
    lastMessageReceived: types.integer,
    yacht: types.maybe(types.string),
    users: types.array(types.string),
    state: types.optional(types.enumeration(CRUDState), ECRUDState.PENDING)
  })
  .actions((model) => {
    const actions: any = {
      setYacht: flow(function* setYacht (yachtId: string) {
        actions.clearMessages()
        model.yacht = yachtId
        model.state = ECRUDState.PENDING

        yield actions.hydrate()
      }),

      hydrate: flow(function* hydrateMessages (force: boolean = false) {
        if (force === false && model.state !== ECRUDState.PENDING) {
          return
        }

        try {
          model.state = ECRUDState.FETCHING
          model.messages.clear()

          const { body: result } = yield API.fetchMessages()
          const { results } = result
          const { getRootStore } = getEnv(model)
          const { auth } = getRootStore()

          const user = auth.user()
          
          const messages = results.map((msg: IAPIChatMessage) => ({
            ...msg,
            kind: msg.kind || 'message',
            isOwn: msg.from === user.email || msg.from === 'SYSTEM'
          }))

          console.log(`[fetched messages]`, messages.slice())

          model.state = ECRUDState.FETCHED

          actions.seedUsers(messages)
          actions.replaceMessages(messages)
        } catch (err) {
          console.error(`Error fetching messages: ${err.message}`)
          actions.clearMessages()
        }
      }),

      sendMessage: flow(function* sendMessage (to: string, message: string, user: any, yacht: TYachtModel) {
        const chat:IAPIChatMessage = {
          state: ESyncState.PENDING,
          kind: EChatMessageKind.MESSAGE,
          id: Date.now().toString(36),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isOwn: true,
          from: 'SYSTEM',
          yacht: String(yacht.id),
          to,
          message,
        }

        try {
          yield API.createMessage(chat, String(user.id))
        } catch (err) {
          console.error(`Error sending message: ${err.message}`)
        }
      }),

      addMessage (message: IAPIChatMessage, state: ESyncState = ESyncState.PENDING) {
        model.messages.push(ChatMessage.create({
          ...message,
          isOwn: message.from === 'SYSTEM',
          state
        }))
      },
  
      removeMessage (message: IAPIChatMessage | string) {
        const id = typeof message === 'string' ? message : message.id
        const msg = model.messages.find(m => m.id === id)
  
        if (msg) {
          model.messages.remove(msg)
        }
      },

      updateMessage (id: string, message: IAPIChatMessage) {
        const msg = model.messages.find(m => m.id === id)
        const index = model.messages.findIndex(m => m.id === id)

        if (msg) {
          model.messages[index] = ChatMessage.create(message)
        }
      },
  
      replaceMessages (messages: IAPIChatMessage[]) {
        actions.clearMessages()

        for (const msg of messages) {
          actions.addMessage(msg, ('state' in msg) ? msg.state : ESyncState.PENDING)
        }

        actions.seedUsers(messages)
      },

      seedUsers: flow(function * seedUsers (messages: IAPIChatMessage[]) {
        const { getRootStore } = getEnv(model)
        const { users } = getRootStore()

        yield users.hydrate()
        
        for (const msg of messages) {
          if (!model.users.includes(msg.from)) {
            model.users.push(msg.from)
          }
        }
      }),
      
      clearMessages () {
        model.users.clear()
        model.messages.clear()
      }
    }

    return actions
  })

export const chatInitialState = {
  messages: [],
  lastMessageReceived: -1,
  yacht: undefined,
  state: ECRUDState.PENDING
}

export type TChatMessage = Instance<typeof ChatMessage>
export type TChat = Instance<typeof Chat>
