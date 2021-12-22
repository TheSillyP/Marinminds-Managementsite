import { Instance, types } from 'mobx-state-tree'

const EventFrequencyModel = types.model({
  time: types.number,
  frequency: types.number,
})

export const UIModel = types
  .model({
    showCreateEvent: types.boolean,
    showCreateYacht: types.boolean,
    showCreateNotification: types.boolean,
    showCreateUser: types.boolean,
    eventFrequency: types.array(EventFrequencyModel)
  })
  .views((self) => ({
    get lastFrequency () {
      if (self.eventFrequency.length === 0) {
        return EventFrequencyModel.create({ time: 0, frequency: 0 })
      }
      
      return self.eventFrequency[self.eventFrequency.length - 1]
    }
  }))
  .actions((self) => {
    return {
      toggleShowCreateEvent () {
        self.showCreateEvent = !self.showCreateEvent
      },

      toggleShowCreateUser () {
        self.showCreateUser = !self.showCreateUser
      },

      toggleShowCreateYacht () {
        self.showCreateYacht = !self.showCreateYacht
      },

      toggleShowCreateNotification () {
        self.showCreateNotification = !self.showCreateNotification
      },

      addEventFrequency (data: any) {
        self.eventFrequency.push(EventFrequencyModel.create(data))

        if (self.eventFrequency.length > 100) {
          self.eventFrequency.remove(self.eventFrequency[0])
        }
      }
    }
  })

export type TEventFrequencyModel = Instance<typeof EventFrequencyModel>
export type TUIModel = Instance<typeof UIModel>

export const uiInitialState = {
  showCreateYacht: false,
  showCreateNotification: false,
  showCreateUser: false,
  showCreateEvent: false,
  eventFrequency: []
}
