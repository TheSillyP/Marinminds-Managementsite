import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import './onboarding.less'

import {
  Form,
  Button,
  Row,
  Col
} from 'antd'

// import { EAuthState } from '../../data/models/auth'
// import { useMst } from '../../data'

export interface IPropTypes {}

export const MFA: React.FC<IPropTypes> = observer(() => {
  // const { auth } = useMst()
  // const setTargetValue = (key: string) => ({ target }: any) => auth.setField(key, target.value)

  return (
    <section className='onboarding'>
      <aside className='onboarding--left-side'>
        <Link to='/' className='onboarding--brand' />
        <Form name='login-form' className='onboarding--login-form'>
          <h1 className='onboarding--login-form--title'>Bonjour, Mark!</h1>

          <p className='onboarding--login-form--description'>
            We hebben je ter verificatie een SMS gestuurd op het telefoonnummer dat eindigt op +316***4000.
          </p>

          <Row style={{ marginBottom: '2em' }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div className='onboarding--login-form--codeinput'>
                4
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div className='onboarding--login-form--codeinput'>
                3
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div className='onboarding--login-form--codeinput'>
                2
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <div className='onboarding--login-form--codeinput' />
            </Col>
          </Row>

          <Form.Item>
            <Button size='large' type="primary" block={true} htmlType="submit" className='onboarding--submit-button'>
              Bevestig
            </Button>
          </Form.Item>
        </Form>
      </aside>
      <aside className='onboarding--right-side'>
        <div className='onboarding--right-side--promo-image' style={{ backgroundImage: `url(/images/hero-yacht.png)` }} />
      </aside>
    </section>
  )
})
