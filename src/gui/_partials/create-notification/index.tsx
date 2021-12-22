import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { WarningOutlined, NotificationOutlined, StopOutlined } from '@ant-design/icons'
import { Row, Col, Select } from 'antd'

import { useMst } from '../../../data'
import { capitalise } from '../../../config'
import { StyledInput } from '../styled-input'

import './create-notification.less'

export interface IPropTypes {
  loading?: boolean
}

export interface IComponentState {
  title: string,
  body: string,
  level: string
}

export const CreateNotification: React.FC<IPropTypes> = observer(({ loading }) => {
  const [ state, replaceState ] = useState({ title: '', body: '', level: 'notification' } as IComponentState)
  const { yachts } = useMst()

  const setState = (mixin: Partial<IComponentState> = {}) => {
    const newState: IComponentState = { ...state, ...mixin }
    replaceState(newState)
    yachts.setNotificationToCreate(newState)
  }

  const handleInputChange = (key: string) => ({ target }: any) => setState({ [key]: target.value })
  const handleLevelChange = (level: string) => setState({ level })

  let icon = <WarningOutlined />

  switch (state.level) {
    case 'alarm':
      icon = <StopOutlined />
      break

    case 'warning':
      icon = <WarningOutlined />
      break
  }

  return (
    <section className='create-notification'>
      <div className='create-notification create-notification--outer'>
        <Row>
          <Col span={24}>
            <Select size='large' value={state.level} onChange={handleLevelChange} style={{ width: '100%', marginBottom: '1.5em' }}>
              <Select.Option value='notification'>
                <NotificationOutlined /> Notification
              </Select.Option>

              <Select.Option value='warning'>
                <WarningOutlined /> Warning
              </Select.Option>

              <Select.Option value='alarm'>
                <StopOutlined /> Alarm
              </Select.Option>
            </Select>

            <StyledInput
              label={`${capitalise(state.level)} title`}
              block={true}
              icon={icon}
              disabled={loading}
              inputProps={{ value: state.title, name: 'title', onChange: handleInputChange('title') }}
              style={{ marginBottom: '1.5em' }} />

            <StyledInput
              label={`${capitalise(state.level)} message`}
              block={true}
              icon={icon}
              disabled={loading}
              inputProps={{ value: state.body, name: 'body', onChange: handleInputChange('body') }}
              style={{ marginBottom: '1.5em' }} />
          </Col>
        </Row>
      </div>
    </section>
  )
})
