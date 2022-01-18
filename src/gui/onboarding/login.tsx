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

export const Login: React.FC<IPropTypes> = observer(() => {
  const { auth } = useMst()

  const setTargetValue = (key: string) => ({ target }: any) => auth.setField(key, target.value)

  return (
    <section className='onboarding'>
      <aside className='onboarding--left-side'>
        <Link to='/' className='onboarding--brand' />
        <Form name='login-form' className='onboarding--login-form'>
          <h1 className='onboarding--login-form--title'>Sign in</h1>
          <Form.Item name='username'>
            <StyledInput block={true} label='Email address' icon={<MailOutlined />} inputProps={{ value: auth.email, onChange: setTargetValue('email') }} />
          </Form.Item>

          <Form.Item name='Password'>
            <StyledInput block={true} password={true} label='Password' icon={<EyeOutlined />} inputProps={{ value: auth.password, onChange: setTargetValue('password') }} />
          </Form.Item>

          <Form.Item>
            <Button size='large' type="primary" block={true} htmlType="submit" className='onboarding--submit-button' onClick={auth.login}>
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Link to='/reset-password'>
              <Button type="link" block={true} className='onboarding--forgot-password-button'>
                Forgot password?
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
