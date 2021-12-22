/**
 * API
 * 
 * @description   MarinMinds API library
 * @module        api-marinminds
 * @license       UNLICENSED
 * @author        Fabian Tollenaar <fabian@decipher.industries> (https://decipher.digital)
 * @copyright     Decipher Industries, all rights reserved
 */

import { IAPIChatMessage, IAPIUser, IAPINotification } from '../data/types'
import { TUser } from '../data/models/users'

export const API = {
  signalk: {
    keys: async (): Promise<string[]> => {
      const { body: result } = (await socket.get('/api/v1/signalk/keys')) as any
      return result.map((r: any) => r.name)
    }
  },

  notifications: {
    create: async (payload: Partial<IAPINotification>): Promise<IAPINotification> => {
      const { body: result } = (await socket.post(`/api/v1/notification`, payload)) as any
      return (result as IAPINotification)
    }
  },
  
  users: {
    fetch: async (): Promise<IAPIUser[]> => {
      const { body: result } = (await socket.get(`/api/v1/users`)) as any
      return result as IAPIUser[]
    },

    destroy: async (id: string): Promise<any> => {
      const { body: result } = (await socket.delete(`/api/v1/user/${encodeURIComponent(id)}`)) as any
      return result
    },

    deactivate: async (id: string): Promise<IAPIUser> => {
      const { body: result } = (await socket.get(`/api/v1/user/${encodeURIComponent(id)}/deactivate`)) as any
      return result as IAPIUser
    },

    activate: async (id: string): Promise<IAPIUser> => {
      const { body: result } = (await socket.get(`/api/v1/user/${encodeURIComponent(id)}/activate`)) as any
      return result as IAPIUser
    },

    create: async (user: TUser): Promise<IAPIUser> => {
      const { body: result } = (await socket.post(`/api/v1/user`, user)) as any
      return result as IAPIUser
    },

    update: async (user: any): Promise<IAPIUser> => {
      const { body: result } = (await socket.patch(`/api/v1/user/${encodeURIComponent(user.email)}`, user)) as any
      return result as IAPIUser
    },
  },

  events: {
    fetch: async (): Promise<any> => {
      return await socket.get('/api/v1/events')
    },
    show: async (id: string): Promise<any> => {
      return await socket.get(`/api/v1/event/${id}`)
    },
    destroy: async (id: string): Promise<any> => {
      return await socket.delete(`/api/v1/event/${id}`)
    },
    update: async (id: string, updates: any): Promise<any> => {
      return await socket.patch(`/api/v1/event/${id}`, updates)
    },
    create: async (body: any): Promise<any> => {
      return await socket.post(`/api/v1/event`, body)
    }
  },

  destroyMessage: async (id: string): Promise<IAPIChatMessage> => {
    return (await socket.delete(`/api/v1/chat/${id}`)) as IAPIChatMessage
  },

  updateMessage: async (id: string, message: IAPIChatMessage, updatedBy: string): Promise<IAPIChatMessage> => {
    return (await socket.patch(`/api/v1/chat/${id}`, { ...message, updatedBy })) as IAPIChatMessage
  },

  createMessage: async (message: IAPIChatMessage, createdBy: string): Promise<IAPIChatMessage> => {
    return (await socket.post(`/api/v1/chat`, { ...message, createdBy })) as IAPIChatMessage
  },

  fetchMessages: async (user?: string, yachtId?: string): Promise<IAPIChatMessage[]> => {
    let uri = `/api/v1/chat`

    if (user && typeof user === 'string') {
      uri += uri.includes('?') ? '?' : '&'
      uri += `user=${user}`
    }

    if (yachtId && typeof yachtId === 'string') {
      uri += uri.includes('?') ? '?' : '&'
      uri += `yacht=${yachtId}`
    }

    return (await socket.get(uri)) as IAPIChatMessage[]
  },

  fetchYachts: async (): Promise<any> => {
    return await socket.get('/api/v1/yachts')
  },

  fetchYachtStatus: async (id: string): Promise<any> => {
    const { body: status } = await socket.get(`/api/v1/yacht/${id}/status`) as any
    return status
  },

  setYachtStatusMessage: async (id: string, status: string): Promise<any> => {
    const { body: result } = await socket.patch(`/api/v1/yacht/${id}/status`, { status }) as any
    return result
  },

  createYacht: async (create:any): Promise<any> => {
    return await socket.post('/api/v1/yacht', create)
  },

  updateYacht: async (id:string, update:any): Promise<any> => {
    return await socket.patch(`/api/v1/yacht/${id}`, update)
  },

  destroyYacht: async (id:string): Promise<any> => {
    return await socket.delete(`/api/v1/yacht/${id}`)
  }
}

const socket = {
  _getSocket () {
    if ('io' in window) {
      return (window as any).io.socket
    }

    return {
      get: () => undefined,
      patch: () => undefined,
      post: () => undefined,
      put: () => undefined,
      delete: () => undefined,
      on: () => undefined,
      off: () => undefined,
    }
  },

  _createCallback (method: string, path: string, resolve: (response: any) => any, reject: (err: Error) => any) {
    return (body: any, response: any) => {
      if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
        return resolve({
          ...response,
          body
        })
      }

      return reject(new Error(`${method} ${response.statusCode} ${path}: not OK`))
    }
  },

  get: (path: string, data?: any) => new Promise((resolve, reject) => {
    socket._getSocket().get(path, data, socket._createCallback('GET', path, resolve, reject))
  }),

  delete: (path: string, data?: any) => new Promise((resolve, reject) => {
    socket._getSocket().delete(path, data, socket._createCallback('DELETE', path, resolve, reject))
  }),

  patch: (path: string, data: any = {}) => new Promise((resolve, reject) => {
    socket._getSocket().patch(path, data, socket._createCallback('PATCH', path, resolve, reject))
  }),

  put: (path: string, data: any = {}) => new Promise((resolve, reject) => {
    socket._getSocket().put(path, data, socket._createCallback('PUT', path, resolve, reject))
  }),

  post: (path: string, data: any = {}) => new Promise((resolve, reject) => {
    socket._getSocket().post(path, data, socket._createCallback('POST', path, resolve, reject))
  })
}


