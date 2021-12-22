import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import './onboarding.less'

import {
  MailOutlined,
  EyeOutlined
} from '@ant-design/icons'

import {
  Form,
  Button
} from 'antd'

import { useMst } from '../../data'
import { StyledInput } from '../_partials/styled-input'

export interface IPropTypes {}

export const SetPassword: React.FC<IPropTypes> = observer(() => {
  const { auth } = useMst()
  const setTargetValue = (key: string) => ({ target }: any) => auth.setField(key, target.value)

  return (
    <section className='onboarding'>
      <aside className='onboarding--left-side'>
        <Link to='/' className='onboarding--brand' />
        <Form name='login-form' className='onboarding--login-form'>
          <h1 className='onboarding--login-form--title'>Recover password</h1>

          <p className='onboarding--login-form--description'>
            Please input your confirmation code and a new password.
          </p>

          <Form.Item name='confirmCode'>
            <StyledInput block={true} label='Confirmation code' icon={<MailOutlined />} inputProps={{ value: auth.confirmCode, onChange: setTargetValue('confirmCode') }} />
          </Form.Item>

          <Form.Item name='password'>
            <StyledInput block={true} password={true} label='New password' icon={<EyeOutlined />} inputProps={{ value: auth.password, onChange: setTargetValue('password') }} />
          </Form.Item>

          <Form.Item>
            <Button size='large' type="primary" block={true} htmlType="submit" className='onboarding--submit-button' onClick={auth.resetPassword}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </aside>
      <aside className='onboarding--right-side'>
        <div className='onboarding--right-side--promo-image' style={{ backgroundImage: `url(/images/hero-yacht.jpg)` }} />
      </aside>
    </section>
  )
})
