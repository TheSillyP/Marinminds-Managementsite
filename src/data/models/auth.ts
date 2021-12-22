import { flow, Instance, types } from 'mobx-state-tree'
import { CognitoUser } from 'amazon-cognito-identity-js'
import { message } from 'antd'
import { isValidPassword, isValidEmail, isValidPhonenumber } from '../../config'
import { login, logout, resend, confirm, providePassword, recoverPassword, resetPassword, currentAuthenticatedUser } from '../../lib/auth'

export enum EAuthState {
  PENDING = 'PENDING',
  LOGGING_IN = 'LOGGING_IN',
  LOGGING_OUT = 'LOGGING_OUT',
  REGISTERING = 'REGISTERING',
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
  NEEDS_CONFIRMATION = 'NEEDS_CONFIRMATION',
  NEEDS_MFA = 'NEEDS_MFA',
  NEEDS_PASSWORD_CHANGE = 'NEEDS_PASSWORD_CHANGE',
  NEEDS_LOGIN = 'NEEDS_LOGIN',
  NEEDS_PASSWORD_RESET = 'NEEDS_PASSWORD_RESET',
  RESENT_CONFIRMATION_CODE = 'RESENT_CONFIRMATION_CODE',
  ERRORED = 'ERRORED'
}

export const AuthState: string[] = Object.values(EAuthState).filter((v) => (typeof v === 'string'))

export const AuthModel = types
  .model({
    email: '',
    password: '',
    phoneNumber: '',
    confirmCode: '',
    mfaCode: '',
    name: '',
    didTryAutoLogin: types.boolean,
    userToken: types.maybe(types.string),
    state: types.enumeration(AuthState),
    error: types.maybe(types.string),
  })
  .actions((model: any) => ({
    setValue (key: string, value: any) {
      model[key] = value
    },

    setState (state: EAuthState) {
      model.state = state
    }
  }))
  .extend((auth) => {
    let currentUser: CognitoUser | undefined

    return {
      views: {
        cognitoUser() {
          return currentUser
        },

        user () {
          const user: any = this.cognitoUser()

          if (user) {
            return user.attributes
          }

          return undefined
        },

        isLoggedIn() {
          return currentUser && auth.state === EAuthState.LOGGED_IN
        },

        passwordIsValid() {
          return isValidPassword(auth.password)
        },

        emailIsValid() {
          return isValidEmail(auth.email)
        },

        phoneNumberIsValid() {
          return isValidPhonenumber(auth.phoneNumber)
        },
      },

      actions: {
        setField(field: string, value: string) {
          switch (field) {
            case 'email':
              auth.email = String(value).toLowerCase()
              break

            case 'name':
              auth.name = String(value)
              break

            case 'password':
              auth.password = String(value)
              break

            case 'phoneNumber':
              auth.phoneNumber = String(value)
              break

            case 'confirmCode':
              auth.confirmCode = String(value)
              break

            case 'mfaCode':
              auth.mfaCode = String(value)
              break
          }
        },

        resendConfirmation: flow(function* authResend() {
          if (auth.state !== EAuthState.NEEDS_CONFIRMATION) {
            return
          }

          try {
            const result = yield resend(auth.email)

            console.log('Resend code:', result)
            auth.state = EAuthState.RESENT_CONFIRMATION_CODE
          } catch (err) {
            auth.state = EAuthState.ERRORED
            auth.error = err.message
          }
        }),

        confirm: flow(function* authConfirm() {
          if (auth.state !== EAuthState.NEEDS_CONFIRMATION) {
            return
          }

          try {
            const result = yield confirm(auth.email, auth.confirmCode)

            console.log('Confirmed user account:', result)
            auth.state = EAuthState.NEEDS_LOGIN
          } catch (err) {
            auth.state = EAuthState.ERRORED
            auth.error = err.message
          }
        }),

        changePassword: flow(function* authChangePassword() {
          try {
            if (!currentUser) {
              throw new Error('Not logged in')
            }

            auth.state = EAuthState.LOGGING_IN
            yield providePassword(currentUser, auth.password, { name: auth.name })
            auth.state = EAuthState.PENDING
          } catch (err) {
            auth.state = EAuthState.ERRORED
            auth.error = err.message
          }
        }),

        recoverPassword: flow(function* authRecoverPassword() {
          try {
            auth.state = EAuthState.NEEDS_PASSWORD_RESET
            auth.password = ''

            yield recoverPassword(auth.email)
            message.success('We sent you an email with a confirmation code.')
          } catch (err) {
            auth.state = EAuthState.ERRORED
            auth.error = err.message
          }
        }),

        resetPassword: flow(function* authRecoverPassword() {
          try {
            const r = yield resetPassword(auth.email, auth.confirmCode, auth.password)
            console.log('resetPassword', r)
            auth.state = EAuthState.PENDING
          } catch (err) {
            auth.state = EAuthState.ERRORED
            auth.error = err.message
          }
        }),

        autoLogin: flow(function* authAutoLogin() {
          if (auth.didTryAutoLogin) {
            return
          }

          auth.didTryAutoLogin = true

          try {
            auth.state = EAuthState.LOGGING_IN
            currentUser = yield currentAuthenticatedUser()

            if (currentUser) {
              auth.state = EAuthState.LOGGED_IN
            }
          } catch (err) {
            auth.state = EAuthState.PENDING
          }
        }),

        login: flow(function* authLogin() {
          auth.state = EAuthState.LOGGING_IN

          try {
            const { user } = yield login(auth.email, auth.password)

            currentUser = user
            console.log('Logged in:', currentUser)

            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
              auth.state = EAuthState.NEEDS_PASSWORD_CHANGE
            } else {
              auth.state = EAuthState.LOGGED_IN
            }
          } catch (err) {
            auth.state = EAuthState.ERRORED
            auth.error = err.message
          }
        }),

        logout: flow(function* authLogout() {
          auth.state = EAuthState.LOGGING_OUT

          try {
            yield logout()
          } catch (err) {
            auth.state = EAuthState.ERRORED
            auth.error = err.message
          }
        }),
      },
    }
  })

export type TAuthModel = Instance<typeof AuthModel>

export const authInitialState = {
  userToken: undefined,
  error: undefined,
  state: EAuthState.PENDING,
  email: 'info@decipher.industries',
  password: 'MarinMinds2020#',
  phoneNumber: '+31630334165',
  didTryAutoLogin: false,
  confirmCode: '',
  mfaCode: '',
  name: '',
}
