import React from 'react'
// import { observer } from 'mobx-react-lite'
import { Row, Col, Statistic } from 'antd'
// import { useMst } from '../../data'

import './widgets.less'

export interface IPropTypes {}

export const FinanceWidget: React.FC<IPropTypes> = () => {
  const financials = {
    approved: 10241.21,
    denied: 1412.89
  }

  return (
    <div className='widget'>
      <div className='widget widget--widget widget--widget-finance'>
        <Row style={{ margin: '1.5em 2em 0 2em' }}>
          <Col span={24}>
            <Statistic
              title="Quoted"
              value={financials.approved + financials.denied}
              precision={2}
              valueStyle={{ fontWeight: 'bold' }}
              prefix="€"
            />
          </Col>
        </Row>
        <Row style={{ margin: '1em 2em 4em 2em' }}>
          <Col span={12}>
            <Statistic
              title="Approved"
              value={financials.approved}
              precision={2}
              valueStyle={{ color: '#51c419', fontWeight: 'bold' }}
              prefix="€"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Rejected"
              value={financials.denied}
              precision={2}
              valueStyle={{ color: '#f5222d', fontWeight: 'bold' }}
              prefix="€"
            />
          </Col>
        </Row>
        <h1 className='widget widget--widget--title'>
          Quotations
        </h1>
      </div>
    </div>
  )
}
