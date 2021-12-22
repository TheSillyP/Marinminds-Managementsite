import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { NotificationOutlined } from '@ant-design/icons'
import { Row, Col, Radio, Divider } from 'antd'

import { TYachtModel } from '../../../data/models/yachts'
import { TEventCondition, TEventEffect } from '../../../data/models/events'
import { useMst } from '../../../data'
import { StyledInput } from '../styled-input'

import { CreateCondition } from './create-condition'
import { CreateEffect } from './create-effect'

import './create-event.less'

export interface IPropTypes {
  loading?: boolean
}

export interface IComponentState {
  name: string
  yacht: string
  conditions: any[]
  effects: any[]
}

export const initialState: IComponentState = {
  name: '',
  yacht: '',
  effects: [
    {
      action: 'triggerNotification',
      target: ['managers', 'customer'],
      actionPath: '',
      actionAssertedValue: 1,
      actionDeassertedValue: 0,
      actionAssertedStatus: '',
      actionDeassertedStatus: '',
      event: '',
    }
  ],
  conditions: [
    {
      kind: 'singlePoint',
      frequencyThreshold: 1,
      association: 'allOf',
      rules: [{ path: '', threshold: 0, operator: '=' }],
      event: ''
    }
  ],
}

export const CreateEvent: React.FC<IPropTypes> = observer(({ loading }) => {
  const [ state, replaceState ] = useState(initialState)
  const { yachts, signalk, events } = useMst()

  useEffect(() => {
    yachts.hydrate()
    signalk.hydrate()
  }, [ yachts, signalk ])

  const setState = (mixinState: Partial<IComponentState>) => {
    const newState: IComponentState = { ...state, ...mixinState }
    replaceState(newState)
    events.setEventToCreate(newState)
  }

  const handleValueChange = (key: string) => (value: any) => setState({ [key]: value })
  const handleTargetValueChange = (key: string) => ({ target }: any) => handleValueChange(key)(target.value)

  const yachtOptions = yachts.yachts.slice().map((y: TYachtModel) => ({ label: y.name, value: y.id }))
  const radioStyle = {
    display: 'block',
    height: '40px',
    lineHeight: '40px',
    margin: 0,
    padding: 0,
  }

  const handleEffectChange = (index: number) => (newEffect: TEventEffect) => setState({ effects: state.effects.map((effect: TEventEffect, num: number) => (num === index) ? { ...newEffect } : { ...effect }) })
  const handleConditionChange = (index: number) => (newCondition: TEventCondition) => setState({ conditions: state.conditions.map((condition: TEventCondition, num: number) => (num === index) ? { ...newCondition } : { ...condition }) })

  return (
    <section className='create-event'>
      <div className='create-event create-event--outer'>
        <Row>
          <Col span={24}>
            <StyledInput
              label={'Event name'}
              block={true}
              icon={<NotificationOutlined />}
              disabled={loading}
              inputProps={{ value: state.name, name: 'name', onChange: handleTargetValueChange('name') }}
              style={{ marginBottom: '1.5em' }} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <label className='group-label'>Yacht:</label>
            <Radio.Group onChange={handleTargetValueChange('yacht')} value={state.yacht}>
              {yachtOptions.map(({ label, value }: any) => <Radio style={radioStyle} key={value} value={value}>{label}</Radio>)}
            </Radio.Group>

            <Divider />

            {state.effects.map((effect: TEventEffect, index: number) => <CreateEffect key={index} index={index} value={effect} onChange={handleEffectChange(index)} />)}
          </Col>
          <Col span={12}>
            {state.conditions.map((condition: TEventCondition, index: number) => <CreateCondition key={index} index={index} value={condition} onChange={handleConditionChange(index)} />)}
          </Col>
        </Row>
      </div>
    </section>
  )
})
