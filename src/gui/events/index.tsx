import React, { useEffect } from 'react'

import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react-lite'
import { Layout, Table, Switch, Space, Button, Badge, Row, Col, Popconfirm } from 'antd'
import { DeleteOutlined, NotificationOutlined } from '@ant-design/icons'

import { ECRUDState } from '../../data/types'
import { TEvent, TEventCondition, TEventEffect } from '../../data/models/events'
import { Header } from '../_partials/header'
import { useMst } from '../../data'

import './events.less'

export interface IPropTypes extends RouteComponentProps {}

export const Events: React.FC<IPropTypes> = observer(({ history, location, match }) => {
  const { events, ui } = useMst()

  useEffect(() => {
    events.hydrate()
  }, [ events ])

  const columns = [
    {
      dataIndex: 'id',
      title: '#',
      width: 20,
      render: (id: string, user: TEvent, index:number) => (index + 1) 
    },
    {
      dataIndex: 'active',
      title: 'Active',
      width: 30,
      render: (active: boolean, record: TEvent) => (
        <div style={{ textAlign: 'center' }}>
          <Switch checked={!!active} size='small' onClick={() => events.toggleActive(record)} />
        </div>
      )
    },
    {
      dataIndex: 'asserted',
      title: 'Asserted',
      width: 30,
      render: (active: boolean) => (
        <div style={{ textAlign: 'center' }}>
          <Switch checked={!!active} size='small' disabled={true} />
        </div>
      )
    },
    {
      dataIndex: 'muted',
      title: 'Muted',
      width: 30,
      render: (muted: boolean, record: TEvent) => (
        <div style={{ textAlign: 'center' }}>
          <Switch checked={!!muted} size='small' onClick={() => events.toggleMute(record)} />
        </div>
      )
    },
    {
      dataIndex: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'conditions',
      title: 'Conditions',
      width: 50,
      render: (conditions: TEventCondition[]) => <Badge count={conditions.length} />
    },
    {
      dataIndex: 'effects',
      title: 'Effects',
      width: 50,
      render: (effects: TEventEffect[]) => <Badge count={effects.length} style={{ backgroundColor: '#52c41a' }} />
    },
    {
      dataIndex: 'id',
      title: 'Actions',
      width: 150,
      render: (id: string, event: TEvent) => (
        <Space size="middle">
          <Popconfirm trigger='click' title='Are you sure?' onConfirm={() => events.destroyEvent(event.id)}>
            <Button danger={true} ghost={true} size='small'>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      )
    },
  ]

  console.log('[events]', events.events.slice().map((record: any) => record.toJSON()))

  return (
    <section className='events'>
      <div className='events events--container'>
        <Layout>
          <Header {...{ history, location, match }} />
          <Layout.Content className='events events--content'>
            <Row style={{ marginBottom: '1em' }}>
              <Col span={12} />
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button type='primary' onClick={() => ui.toggleShowCreateEvent()}><NotificationOutlined /> Create event</Button>
              </Col>
            </Row>
            <Table
              dataSource={events.events.slice()}
              columns={columns}
              pagination={false}
              loading={events.state === ECRUDState.FETCHING}
              rowKey='id'
            />
          </Layout.Content>
        </Layout>
      </div>
    </section>
  )
})

export default Events
