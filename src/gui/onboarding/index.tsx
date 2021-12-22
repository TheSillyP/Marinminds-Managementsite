import React from 'react'
import { observer } from 'mobx-react-lite'

import { EAuthState } from '../../data/models/auth'
import { useMst } from '../../data'
import { Login } from './login'
import { MFA } from './mfa'
import { SetPassword } from './set-password'

export interface IPropTypes {}

export const Onboarding: React.FC<IPropTypes> = observer(() => {
  const { auth } = useMst()

  if (auth.state === EAuthState.NEEDS_MFA) {
    return <MFA />
  }

  if (auth.state === EAuthState.NEEDS_PASSWORD_RESET) {
    return <SetPassword />
  }
  
  return <Login />
})
