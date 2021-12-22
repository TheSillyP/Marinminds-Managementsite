import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { Row, Col, Radio, Checkbox } from 'antd'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons'

import { EUserStatus } from '../../../data/types'
import { TYachtModel } from '../../../data/models/yachts'
import { TUser, User } from '../../../data/models/users'
import { useMst } from '../../../data'
import { StyledInput } from '../styled-input'

import './create-user.less'

export interface IPropTypes {
  edit?: TUser
}

export interface IState {
  email: string
  phone: string
  role: string
  loading: false
  yachts: string[]
  editing: string
}

export const initialState: IState = {
  email: '',
  phone: '',
  editing: '',
  role: 'customer',
  loading: false,
  yachts: []
}

export const CreateUser: React.FC<IPropTypes> = observer(({ edit }) => {
  const { yachts, users } = useMst()
  const [ state, replaceState ] = useState(initialState)

  const setState = (mixin: Partial<IState>) => {
    const newState = { ...state, ...mixin }
    replaceState(newState)

    const update = {
      email: newState.email,
      phone_number: newState.phone,
      yachts: newState.yachts,
      role: newState.role
    }

    if (!edit) {
      return users.setUserToCreate({
        ...update,
        active: true,
        status: EUserStatus.UNCONFIRMED,
      })
    } else {
      const user = User.create({
        ...edit,
        ...update,
      })
      
      console.log(`Setting user to update...`, user)
      return users.setUserToEdit(user)
    }
  }

  useEffect(() => {
    if (!edit || state.editing === edit.email) {
      return
    }

    let y: any = edit.yachts

    y = typeof y === 'string' ? y.split(',') : y
    y = !y ? [] : y
    y = typeof y.slice === 'function' ? y.slice() : []
    y = y.map((yacht: string|TYachtModel) => (typeof yacht === 'string' ? yacht : yacht.id))

    setState({
      editing: edit.email,
      email: edit.email,
      phone: edit.phone_number,
      role: edit.role || 'customer',
      yachts: y
    })
  })

  const setTargetValue = (key: string) => ({ target }: any) => setState({ [key]: target.value })

  const radioStyle = {
    display: 'block',
    height: '40px',
    lineHeight: '40px',
    margin: 0,
    padding: 0,
  }

  const yachtOptions = yachts.yachts.slice().map((y: TYachtModel) => ({ label: y.name, value: y.id }))
  const handleYachtSelect = ({ target }: any) => setState({ yachts: [ target.value ] })
  const handleMultiYachtSelect = (yachts: any[]) => setState({ yachts })

  return (
    <section className='create-yacht'>
      <div className='create-yacht create-yacht--outer'>
        <Row>
          <Col span={12}>
            <StyledInput
              label='Email address'
              block={true}
              icon={<MailOutlined />}
              disabled={state.loading}
              inputProps={{ value: state.email, onChange: setTargetValue('email') }}
              style={{ marginBottom: '1.5em' }} />

            <StyledInput
              label='Phone number (including country code, e.g. +31612345678)'
              block={true}
              icon={<PhoneOutlined />}
              disabled={state.loading}
              inputProps={{ value: state.phone, onChange: setTargetValue('phone') }}
              style={{ marginBottom: '1.5em' }} />

            <label className='group-label'>Role:</label>
            <Radio.Group onChange={setTargetValue('role')} value={state.role}>
              <Radio style={radioStyle} value='customer'>Customer</Radio>
              <Radio style={radioStyle} value='manager'>Personal Yacht Manager</Radio>
              <Radio style={radioStyle} value='superuser'>superuser</Radio>
            </Radio.Group>
          </Col>
          
          {state.role === 'customer' && (
            <Col span={12} style={{ padding: '0 4em' }}>
              <label className='group-label'>Yachts:</label>
              <Radio.Group onChange={handleYachtSelect} value={state.yachts[0]}>
                {yachtOptions.map(({ label, value }: any) => <Radio style={radioStyle} key={value} value={value}>{label}</Radio>)}
              </Radio.Group>
            </Col>
          )}

          {state.role !== 'customer' && (
            <Col span={12} style={{ padding: '0 4em' }}>
              <label className='group-label'>Yachts:</label>
              <Checkbox.Group onChange={handleMultiYachtSelect} value={state.yachts}>
                {yachtOptions.map(({ label, value }: any) => <Checkbox style={radioStyle} key={value} value={value}>{label}</Checkbox>)}
              </Checkbox.Group>
            </Col>
          )}
        </Row>
      </div>
    </section>
  )
})
