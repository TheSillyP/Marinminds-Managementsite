import React from 'react'
// import { render } from '@testing-library/react'
import renderer from 'react-test-renderer'

import App from '../app'
import { Login } from './login'
import { MFA } from './mfa'
import { ResetPassword } from './reset-password'

test('Login component renders OK', () => {
  const { toJSON } = renderer.create(<App><Login /></App>)
  const tree = toJSON()
  expect(tree).toMatchSnapshot()
})

test('MFA component renders OK', () => {
  const { toJSON } = renderer.create(<App><MFA /></App>)
  const tree = toJSON()
  expect(tree).toMatchSnapshot()
})

test('ResetPassword component renders OK', () => {
  const { toJSON } = renderer.create(<App><ResetPassword /></App>)
  const tree = toJSON()
  expect(tree).toMatchSnapshot()
})
