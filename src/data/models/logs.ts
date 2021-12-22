import { Instance, types } from 'mobx-state-tree'
import moment from 'moment'

const Log = types.model({
  fingerprint: types.maybe(types.string),
  time: types.string,
  context: types.maybeNull(types.string),
  data: types.maybeNull(types.string),
  dest: types.maybeNull(types.integer),
  idDec: types.maybeNull(types.integer),
  idHex: types.maybeNull(types.string),
  pgn: types.maybeNull(types.integer),
  source: types.maybeNull(types.string),
  src: types.maybeNull(types.integer),
  yacht: types.maybeNull(types.string),
})

export const Logs = types
  .model({
    list: types.array(Log),
    lastReceived: types.number
  })
  .views((self) => ({
    get mostRecent () {
      const sorter = (a: TLog, b: TLog) => moment(a.time).isBefore(moment(b.time)) ? -1 : 1
      return self.list.slice(0, self.list.length < 1000 ? self.list.length : 1000).sort(sorter)
    }
  }))
  .actions((self) => {
    const actions: any = {
      addLog (log: any) {
        if (Array.isArray(log)) {
          return actions.addLogs(log)
        }

        const fingerprint = `${log.time}.${log.pgn}.${log.data}`
        const exists = self.list.find((candidate: TLog) => candidate.fingerprint === fingerprint)

        if (exists) {
          return
        }

        self.lastReceived = Date.now()
        self.list.unshift(Log.create({
          ...log,
          fingerprint
        }))
      },
      addLogs (logs: any[]) {
        for (const log of logs.reverse()) {
          actions.addLog(log)
        }
      }
    }

    return actions
  })

export type TLog = Instance<typeof Log>
export type TLogs = Instance<typeof Logs>

export const logsInitialState = {
  list: [],
  lastReceived: -1
}
