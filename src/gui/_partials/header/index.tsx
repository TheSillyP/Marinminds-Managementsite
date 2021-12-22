import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { useMst } from '../../../data'
import { TYachtModel } from '../../../data/models/yachts'
import { EAuthState } from '../../../data/models/auth'
import { ECRUDState } from '../../../data/types'

import './header.less'

import {
  MessageOutlined,
  NotificationOutlined,
  CodeOutlined,
  PlusCircleOutlined,
  RocketOutlined,
  ToolOutlined,
  // SettingOutlined,
  LogoutOutlined,
  ReconciliationOutlined
} from '@ant-design/icons'

import {
  Layout,
  Menu,
  Avatar,
  Row,
  Col,
  Modal,
  Dropdown,
  Button,
} from 'antd'

export interface IPropTypes extends RouteComponentProps {}

export const Header: React.FC<IPropTypes> = observer(({ match }) => {
  const { yachts, auth, chat, users } = useMst()
  const { selectedYacht } = yachts

  useEffect(() => {
    yachts.hydrate()
    users.hydrate()
  })

  const user = auth.user()
  const loggedIn = user && auth.state === EAuthState.LOGGED_IN
  
  const selectYacht = (yacht: TYachtModel) => () => {
    yachts.selectYacht(yacht)
    chat.setYacht(yacht.id)
  }

  const signOut = () => Modal.confirm({
    title: 'Are you sure?',
    onCancel: () => false,
    onOk: () => {
      auth.logout()
      return false
    }
  })

  let activeKey = ''

  switch (match.path) {
    case '/events':
      activeKey = 'events'
      break
    
    case '/logs':
      activeKey = 'logs'
      break

    case '/management':
      activeKey = 'management'
      break

    case '/yachtservice':
      activeKey = 'yachtservice'
      break

    case '/pms':
    activeKey = 'pms'
    break
      
    default:
      activeKey = 'communication'
      break
  }

  const yachtSubMenu = yachts.yachts.map((yacht: TYachtModel) => (
    <Menu.Item key={yacht.id} onClick={selectYacht(yacht)}>
      {yacht.name}
    </Menu.Item>
  ))

  return (
    <Layout.Header className="header">
      <div className='show-xs'>
        <Dropdown disabled={yachts.state !== ECRUDState.FETCHED} overlay={<Menu>{yachtSubMenu}</Menu>} trigger={[ 'click' ]}>
          <Button disabled={yachts.state !== ECRUDState.FETCHED} type="default" block={true}>
            <RocketOutlined /> {yachts.state !== ECRUDState.FETCHED ? 'Laden...' : (!selectedYacht ? 'Select yacht...' : selectedYacht.name)}
          </Button>
        </Dropdown>
      </div>
      <div className='hide-xs'>
        <Row>
          <Col span={6}>
            <Menu theme="dark" mode="horizontal">
              <Menu.SubMenu disabled={yachts.state !== ECRUDState.FETCHED} style={{ marginRight: '5em' }} key="yachts" title={<><RocketOutlined /> {!selectedYacht ? 'Select yacht...' : selectedYacht.name}</>}>
                {yachtSubMenu}
                {yachts.yachts.length > 0 && <Menu.Divider />}
                <Menu.Item key="CREATE">
                  <Link to='/?tab=yacht'><PlusCircleOutlined /> Manage yachts</Link>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Col>
          <Col span={12}>
            <Menu theme="dark" mode="horizontal" style={{ textAlign: 'center' }} activeKey={activeKey}>
              <Menu.Item key="communication" disabled={!selectedYacht}>
                <Link to='/'><MessageOutlined /> Communication</Link>
              </Menu.Item>
              <Menu.Item key="events" disabled={!selectedYacht}>
                <Link to='/events'><NotificationOutlined /> Events</Link>
              </Menu.Item>
              <Menu.Item key="logs" disabled={!selectedYacht}>
                <Link to='/logs'><CodeOutlined /> Logs</Link>
              </Menu.Item>
              <Menu.Item key="management">
                <Link to='/management'><ToolOutlined /> Management</Link>
              </Menu.Item>
              <Menu.Item key="yachtservice">
                <Link to='/yachtservice'><ReconciliationOutlined /> Yachtservice</Link>
              </Menu.Item>
              <Menu.Item key="pms">
                <Link to='/pms'><ReconciliationOutlined /> PMS</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={6}>
            <Menu theme="dark" mode="horizontal">
              {loggedIn && (
                <Menu.SubMenu key="user" style={{ float: 'right' }} title={<Avatar style={{ border: '2px solid rgba(255, 255, 255, 0.35)' }} size='large' src='https://placekitten.com/g/300/300' />}>
                  {/* <Menu.Item key="PROFILE">
                    <UserOutlined /> Profile
                  </Menu.Item>
                  <Menu.Item key="SETTINGS">
                    <SettingOutlined /> Settings
                  </Menu.Item> */}
                  <Menu.Item key="LOGOUT" style={{ color: '#f5222d' }} onClick={signOut}>
                    <LogoutOutlined /> {user.email}
                  </Menu.Item>
                </Menu.SubMenu>
              )}
            </Menu>
          </Col>
        </Row>
      </div>
    </Layout.Header>
  )
})