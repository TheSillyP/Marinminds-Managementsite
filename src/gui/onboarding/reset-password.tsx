import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import './onboarding.less'

import {
  MailOutlined,
  LeftOutlined
} from '@ant-design/icons'

import {
  Form,
  Button
} from 'antd'

import { useMst } from '../../data'
import { StyledInput } from '../_partials/styled-input'

export interface IPropTypes {}

export const ResetPassword: React.FC<IPropTypes> = observer(() => {
  const { auth } = useMst()
  const setTargetValue = (key: string) => ({ target }: any) => auth.setField(key, target.value)

  return (
    <section className='onboarding'>
      <aside className='onboarding--left-side'>
        <Link to='/' className='onboarding--brand' />
        <Form name='login-form' className='onboarding--login-form'>
          <h1 className='onboarding--login-form--title'>Recover password</h1>

          <p className='onboarding--login-form--description'>
            Please fill in your email address to recover your password.
          </p>

          <Form.Item name='username'>
            <StyledInput block={true} label='Email' icon={<MailOutlined />} inputProps={{ value: auth.email, onChange: setTargetValue('email') }} />
          </Form.Item>

          <Form.Item>
            <Link to='/' onClick={auth.recoverPassword}>
              <Button size='large' type="primary" block={true} htmlType="submit" className='onboarding--submit-button'>
                Recover password
              </Button>
            </Link>
          </Form.Item>

          <Form.Item>
            <Link to='/'>
              <Button type="link" block={true} className='onboarding--forgot-password-button'>
                <LeftOutlined /> Back to sign-in
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </aside>
      <aside className='onboarding--right-side'>
        <div className='onboarding--right-side--promo-image' style={{ backgroundImage: `url(/images/hero-yacht.jpg)` }} />
      </aside>
    </section>
  )
})
