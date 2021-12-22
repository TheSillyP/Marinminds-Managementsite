import { Auth } from 'aws-amplify'
import { ISignUpResult, CognitoUser } from 'amazon-cognito-identity-js'

export interface IUserAttributes {
  email: string
  phone_number: string
}

export interface IRegisterResult {
  user: CognitoUser
  confirmed: boolean
}

interface IGeneric<T> {
  [key: string]: T
}

export const login = async (username: string, password: string): Promise<any> => {
  const user: CognitoUser = await Auth.signIn(username, password)
  return { user }
}

export const register = async (username: string, password: string, attributes: IUserAttributes): Promise<IRegisterResult> => {
  const result: ISignUpResult = await Auth.signUp({
    username,
    password,
    attributes,
  })

  return {
    user: result.user,
    confirmed: result.userConfirmed,
  }
}

export const currentAuthenticatedUser = async () => {
  return await Auth.currentAuthenticatedUser()
}

export const providePassword = async (user: CognitoUser, newPassword: string, attributes: IGeneric<string>): Promise<any> => {
  return await Auth.completeNewPassword(user, newPassword, attributes)
}

export const updatePassword = async (user: CognitoUser, newPassword: string, oldPassword: string): Promise<any> => {
  return await Auth.changePassword(user, oldPassword, newPassword)
}

export const recoverPassword = async (username: string) => {
  return await Auth.forgotPassword(username)
}

export const resetPassword = async (username: string, code: string, newPassword: string) => {
  return await Auth.forgotPasswordSubmit(username, code, newPassword)
}

export const logout = async (): Promise<any> => {
  return await Auth.signOut()
}

export const resend = async (username: string): Promise<any> => {
  return await Auth.resendSignUp(username)
}

export const confirm = async (username: string, code: string): Promise<any> => {
  return await Auth.confirmSignUp(username, code)
}
