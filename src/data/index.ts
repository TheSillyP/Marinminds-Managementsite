import { useContext, createContext } from 'react'
import { types, Instance } from 'mobx-state-tree'
import { AuthModel, authInitialState } from './models/auth'
import { YachtsModel, yachtsInitialState } from './models/yachts'
import { UIModel, uiInitialState } from './models/ui'
import { Chat, TChatMessage, chatInitialState } from './models/chat'
import { Users, usersInitialState } from './models/users'
import { Logs, logsInitialState } from './models/logs'
import { Events, eventsInitialState } from './models/events'
import { IIOLogsEvent } from './types'
import { SignalK, signalkInitialState } from './models/signalk'

export const RootModel = types.model({
  auth: AuthModel,
  yachts: YachtsModel,
  ui: UIModel,
  chat: Chat,
  users: Users,
  logs: Logs,
  events: Events,
  signalk: SignalK,
})

export type RootInstance = Instance<typeof RootModel>
export const RootStoreContext = createContext<null | RootInstance>(null)
export const Provider = RootStoreContext.Provider

let store: RootInstance
const getRootStore = () => store

store = RootModel.create({
  auth: authInitialState,
  yachts: yachtsInitialState,
  ui: uiInitialState,
  chat: chatInitialState,
  users: usersInitialState,
  logs: logsInitialState,
  events: eventsInitialState,
  signalk: signalkInitialState,
}, { getRootStore })

export const rootStore = store

export function useMst() {
  const store = useContext(RootStoreContext)

  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  
  return store
}

/* Sails.io */
const io = (window as any).io

io.socket.on('logs', ({ to, logs }: IIOLogsEvent) => {
  const id: string = io.socket._raw.id
  
  if (!to.includes(id)) {
    return
  }

  rootStore.logs.addLogs(logs)
})

io.socket.on('events:frequency', (data:any) => rootStore.ui.addEventFrequency(data))
io.socket.on('chat:message', (data: any) => {
  const { op, id, message } = data
  const { email } = rootStore.auth.user()
  const exists = rootStore.chat.messages.find((m: TChatMessage) => (m.id === id))

  if (op === 'CREATE' && message.from === email) {
    return
  }

  if (op === 'DESTROY' && exists) {
    rootStore.chat.removeMessage(id)
    return
  }

  if (!exists) {
    rootStore.chat.addMessage(message)
  } else {
    rootStore.chat.updateMessage(id, message)
  }
})
