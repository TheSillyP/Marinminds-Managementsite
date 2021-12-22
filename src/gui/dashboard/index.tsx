import React from 'react'
import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react-lite'

import {
  Layout,
  Row,
  Col,
} from 'antd'

import { Header } from '../_partials/header'
import { Communicator } from '../_partials/communicator'
import { Status } from '../_partials/status'

import './dashboard.less'

export interface IPropTypes extends RouteComponentProps {
}

export const Dashboard: React.FC<IPropTypes> = observer(({ history, location, match }) => {
  return (
    <section className='dashboard'>
      <div className='dashboard dashboard--container'>
        <Layout>
          <Header {...{ history, location, match }} />
          <Layout.Content className='dashboard dashboard--content'>
            <Row>
              <Col lg={6} sm={8} className='hide-xs'>
                <Status />
              </Col>

              <Col lg={18} sm={16} xs={24}>
                <div className="dashboard dashboard--chat-wrapper">
                  <Communicator />
                </div>
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </div>
    </section>
  )
})

export default Dashboard
