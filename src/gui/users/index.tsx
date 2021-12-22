import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react-lite'
import { Layout, Table, Switch, Tag, Space, Button, Modal, Tabs } from 'antd'
import { DeleteOutlined, RocketOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons'

import { useMst } from '../../data'
import { EUserStatus, ECRUDState } from '../../data/types'
import { getStatusColor } from '../../config'
import { TUser } from '../../data/models/users'
import { TYachtModel } from '../../data/models/yachts'
import { Header } from '../_partials/header'

import './users.less'

export interface IPropTypes extends RouteComponentProps {}

export const Users: React.FC<IPropTypes> = observer(({ history, location, match }) => {
  const [ activeKey, setActiveKey ] = useState('customer')
  const { users, yachts, ui } = useMst()

  useEffect(() => {
    users.hydrate()
    yachts.hydrate()

    if (typeof window.location.search === 'string' && window.location.search.includes('?tab=')) {
      const setTab = window.location.search.replace('?tab=', '').trim()
      setActiveKey(setTab)
    }
  }, [ users, yachts ])

  const destroyUser = (user: TUser) => () => Modal.confirm({
    title: `Are you sure you want to delete user ${user.email}?`,
    onOk: () => {
      users.destroy(user)
      return false
    },
    onCancel: () => false,
  })

  const deactivateUser = (user: TUser) => () => Modal.confirm({
    title: `Are you sure you want to ${user.active ? 'deactivate' : 'activate'} user ${user.email}?`,
    onOk: () => {
      users.toggleActive(user)
      return false
    },
    onCancel: () => false,
  })

  const destroyYacht = (id: string) => () => Modal.confirm({
    title: 'Are you sure?',
    content: 'Are you sure? This action cannot be undone.',
    onCancel: () => false,
    onOk: () => {
      yachts.destroyYacht(id)
      return false
    }
  })

  const userColumns = [
    {
      dataIndex: 'id',
      title: '#',
      width: 20,
      render: (id: string, user: TUser, index:number) => (index + 1) 
    },
    {
      dataIndex: 'active',
      title: 'Active',
      width: 30,
      render: (active: boolean, user: TUser) => (
        <div style={{ textAlign: 'center' }}>
          <Switch checked={active} size='small' onChange={deactivateUser(user)} />
        </div>
      )
    },
    {
      dataIndex: 'email',
      title: 'Email address',
      render: (email: string) => <a href={`mailto:${email}`}>{email}</a>
    },
    {
      dataIndex: 'phone_number',
      title: 'Phone number',
      render: (phone: string) => <a href={`tel:${phone}`}>{phone}</a>
    },
    {
      dataIndex: 'yachts',
      title: 'Yachts',
      width: 150,
      render: (yachts: (string | TYachtModel)[]) => yachts.map((yacht: string | TYachtModel) => (typeof yacht === 'string' ? yacht : yacht.name)).join(', ')
    },
    {
      dataIndex: 'email',
      title: 'Role',
      width: 100,
      render: (role: string, record: TUser) => <Tag color={record.role === 'customer' ? 'blue' : 'red'}>{record.role === 'customer' ? 'Customer' : 'Manager'}</Tag>
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 150,
      render: (status: EUserStatus) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      dataIndex: 'id',
      title: 'Actions',
      width: 150,
      render: (id: string, user: TUser) => {
        const edit = () => users.setUserToEdit(user)
        return (
          <Space size="middle">
            <Button type='primary' size='small' onClick={edit}>
              <EditOutlined />
            </Button>
    
            <Button danger={true} ghost={true} size='small' onClick={destroyUser(user)}>
              <DeleteOutlined />
            </Button>
          </Space>
        )
      }
    },
  ]

  const yachtColumns = [
    {
      dataIndex: 'id',
      title: '#',
      width: 20,
      render: (id: string, user: TUser, index:number) => (index + 1) 
    },
    /* {
      dataIndex: 'active',
      title: 'Active',
      width: 30,
      render: (active: boolean) => (
        <div style={{ textAlign: 'center' }}>
          <Switch checked={active} size='small' />
        </div>
      )
    }, // */
    {
      dataIndex: 'image',
      title: 'Image',
      width: 140,
      render: (url: string) => <div className='yacht-image-preview' style={{ backgroundImage: `url(${url})` }} />
    },
    {
      dataIndex: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'blackboxId',
      title: 'Blackbox ID',
      render: (blackboxId: string) => <code>{blackboxId}</code>
    },
    {
      dataIndex: 'id',
      title: 'Actions',
      width: 150,
      render: (id: string, user: TUser) => (
        <Space size="middle">
          <Button type='primary' size='small' onClick={() => yachts.setEditing(id)}>
            <EditOutlined />
          </Button>
  
          <Button danger={true} ghost={true} size='small' onClick={destroyYacht(id)}>
            <DeleteOutlined />
          </Button>
        </Space>
      )
    },
  ]

  const addIcon = activeKey === 'yacht' ? <RocketOutlined /> : <UserAddOutlined />

  const handleButtonClick = () => {
    if (activeKey === 'yacht') {
      return ui.toggleShowCreateYacht()
    }

    return ui.toggleShowCreateUser()
  }

  const tabbarButtons = {
    right: <Button type='primary' onClick={handleButtonClick}>{addIcon} Add {activeKey}</Button>
  }

  return (
    <section className='users'>
      <div className='users users--container'>
        <Layout>
          <Header {...{ history, location, match }} />
          <Layout.Content className='users users--content'>
            <div className="users users--table-wrapper">
              <Tabs activeKey={activeKey} onChange={setActiveKey} tabBarStyle={{ paddingLeft: '1em' }} tabBarExtraContent={tabbarButtons}>
                <Tabs.TabPane tab='Customers' key='customer'>
                  <Table
                    dataSource={users.customers.slice()}
                    columns={userColumns}
                    pagination={false}
                    loading={users.state === ECRUDState.FETCHING}
                    rowKey='email'
                  />
                </Tabs.TabPane>

                <Tabs.TabPane tab='Personal Yacht Managers' key='manager'>
                  <Table
                    dataSource={users.managers.slice()}
                    columns={userColumns}
                    pagination={false}
                    loading={users.state === ECRUDState.FETCHING}
                    rowKey='email'
                  />
                </Tabs.TabPane>

                <Tabs.TabPane tab='Yachts' key='yacht'>
                  <Table
                    dataSource={yachts.yachts.slice()}
                    columns={yachtColumns}
                    pagination={false}
                    loading={yachts.state === ECRUDState.FETCHING}
                    rowKey='id'
                  />
                </Tabs.TabPane>
              </Tabs>
            </div>
          </Layout.Content>
        </Layout>
      </div>
    </section>
  )
})
