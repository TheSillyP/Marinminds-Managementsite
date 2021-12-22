import { TLog } from './models/logs'

export enum EChatMessageKind {
  MESSAGE = 'message',
  ALARM = 'alarm',
  NOTIFICATION = 'notification',
  IMAGE = 'image',
  VIDEO = 'video',
  ATTACHMENT = 'attachment',
  QUOTATION = 'quotation'
}

export enum ESyncState {
  PENDING = 'PENDING',
  SYNCING = 'SYNCING',
  SYNCED = 'SYNCED'
}

export enum ECRUDState {
  PENDING = 'PENDING',
  FETCHING = 'FETCHING',
  FETCHED = 'FETCHED',
  ERRORED = 'ERRORED',
}

export enum EUserStatus {
  FORCE_CHANGE_PASSWORD = 'FORCE_CHANGE_PASSWORD',
  UNCONFIRMED = 'UNCONFIRMED',
  CONFIRMED = 'CONFIRMED',
  ARCHIVED = 'ARCHIVED',
  COMPROMISED = 'COMPROMISED',
  UNKNOWN = 'UNKNOWN',
  RESET_REQUIRED = 'RESET_REQUIRED',
}

export const UserStatus: string[] = Object.values(EUserStatus).filter((v) => (typeof v === 'string'))
export const CRUDState: string[] = Object.values(ECRUDState).filter((v) => (typeof v === 'string'))
export const ChatMessageKinds: string[] = Object.values(EChatMessageKind).filter((v) => (typeof v === 'string'))
export const SyncStates: string[] = Object.values(ESyncState).filter((v) => (typeof v === 'string'))

export interface IIOLogsEvent {
  logs: TLog[],
  timestamp: number,
  to: string[],
  total: number
}
export interface IAPI {
  id?: string,
  createdAt?: number,
  createdBy?: string,
  updatedAt?: number,
  updatedBy?: string,
  yacht?: string|IAPIYacht,
  state?: ESyncState
}

export interface IAPINotification extends IAPI {
  to: IAPIUserDeviceToken,
  sentBy: string,
  seenBy: string[],
  level: string,
  sound: string,
  title: string,
  body: string,
  extra: { 
    [key: string]: any
  }
}

export interface IAPIUserDeviceToken extends IAPI {
  username: string,
  token: string,
  platform: string,
  lastTokenUpdate: number,
  lastUsed: number,
}

export interface IAPIChatMessage extends IAPI {
  yacht?: string,
  from: string,
  to: string,
  message: string,
  kind: EChatMessageKind,
  isOwn?: boolean
}

export interface IAPIUser extends IAPI {
  active: boolean,
  status: EUserStatus,
  email: string,
  phone_number: string,
}

export interface IAPIYacht extends IAPI {
  name: string,
  owner: string,
  active: boolean,
  users: string[],
}

