import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Select, Checkbox, Input, InputNumber } from 'antd'

import { TEventEffect } from '../../../data/models/events'
// import { useMst } from '../../../data'
// import { StyledInput } from '../styled-input'

import './create-effect.less'

export interface IProps {
  onChange?: (eventCondition: TEventEffect) => any
  value?: TEventEffect
  disabled?: boolean
  index: number
}

export interface IState {
  target: string[]
  action: string
  actionPath: string
  actionAssertedValue: number
  actionDeassertedValue: number
  actionAssertedStatus: string
  actionDeassertedStatus: string
}

export const initialState: IState = {
  target: ['managers', 'customer'],
  action: 'triggerNotification',
  actionPath: '',
  actionAssertedValue: 1,
  actionDeassertedValue: 0,
  actionAssertedStatus: '',
  actionDeassertedStatus: '',
}

export const CreateEffect: React.FC<IProps> = observer((props) => {
  const [ state, replaceState ] = useState(initialState)

  const onChange = typeof props.onChange === 'function' ? props.onChange : (s: TEventEffect) => true
  
  const setState = (mixin: Partial<IState>) => {
    const newState = { ...state, ...mixin }
    replaceState(newState)
    onChange(newState as TEventEffect)
  }

  const handleValueChange = (key: string) => (value: any) => setState({ [key]: value })
  const handleTargetChange = (key: string) => ({ target }: any) => handleValueChange(key)(target.value)

  const radioStyle = {
    display: 'block',
    height: '40px',
    lineHeight: '40px',
    margin: 0,
    padding: 0,
  }

  return (
    <div className='create-effect'>
      <div className='create-effect create-effect--outer'>
        <label className='group-label' style={{ marginTop: '1em' }}>Effect:</label>
        <label className='secondary-label'>Action</label>
        <Select size='large' style={{ width: '100%' }} value={state.action} onChange={handleValueChange('action')}>
          <Select.Option value='triggerNotification'>Trigger notification</Select.Option>
          <Select.Option value='triggerAlarm'>Trigger alarm</Select.Option>
          <Select.Option value='triggerWarning'>Trigger warning</Select.Option>
          <Select.Option value='setDataPoint'>Set custom path</Select.Option>
          <Select.Option value='setStatusText'>Set yacht status text</Select.Option>
        </Select>

        {state.action === 'setDataPoint' && (
          <>
            <label className='secondary-label'>Signal K path to set</label>
            <Input value={state.actionPath} onChange={handleTargetChange('actionPath')} placeholder='e.g. "notifications.NAME.active"' size='large' style={{ width: '100%' }} />

            <label className='secondary-label'>Value when conditions are true</label>
            <InputNumber value={state.actionAssertedValue} onChange={handleValueChange('actionAssertedValue')} placeholder='e.g. 1' size='large' style={{ width: '100%' }} />

            <label className='secondary-label'>Value when conditions are not true</label>
            <InputNumber value={state.actionDeassertedValue} onChange={handleValueChange('actionDeassertedValue')} placeholder='e.g. 1' size='large' style={{ width: '100%' }} />
          </>
        )}

        {state.action === 'setStatusText' && (
          <>
            <label className='secondary-label'>Status when conditions become true</label>
            <Input value={state.actionAssertedStatus} onChange={handleTargetChange('actionAssertedStatus')} size='large' style={{ width: '100%' }} />

            <label className='secondary-label'>Status when conditions become false</label>
            <Input value={state.actionDeassertedStatus} onChange={handleTargetChange('actionDeassertedStatus')} size='large' style={{ width: '100%' }} />
          </>
        )}

        <label className='secondary-label' style={{ marginTop: '1em' }}>To whom?</label>
        <Checkbox.Group value={state.target} onChange={(target: any[]) => setState({ target })}>
          <Checkbox style={radioStyle} value='superusers'>All superusers</Checkbox>
          <Checkbox style={radioStyle} value='managers'>All yacht managers</Checkbox>
          <Checkbox style={radioStyle} value='customer'>The customer</Checkbox>
        </Checkbox.Group>
      </div>
    </div>
  )
})

export default CreateEffect
