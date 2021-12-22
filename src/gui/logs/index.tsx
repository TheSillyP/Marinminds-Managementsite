import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { RouteComponentProps } from 'react-router'
import { observer } from 'mobx-react-lite'
import { LazyLog } from 'react-lazylog'
import { Layout } from 'antd'

import { TLog } from '../../data/models/logs'
import { Header } from '../_partials/header'
import { useMst } from '../../data'

import './logs.less'

export interface IPropTypes extends RouteComponentProps {}

export const Logs: React.FC<IPropTypes> = observer(({ history, location, match }) => {
  const [ now, setNow ] = useState(Date.now())
  const { logs } = useMst()
  const lines = logs.mostRecent.map((log: TLog) => `${log.time} (${log.yacht}) ${log.pgn} => ${log.data}`).join('\n')

  const tick = () => setNow(Date.now())

  useEffect(() => {
    const timerID = setInterval( () => tick(), 500)
    return () => clearInterval(timerID)
  })

  return (
    <section className='logs'>
      <div className='logs logs--container'>
        <Layout>
          <Header {...{ history, location, match }} />
          <Layout.Content className='logs logs--content'>
            <div>Last update: <strong>{moment(now).diff(moment(logs.lastReceived), 'seconds')}s ago</strong><br /></div>
            <div className='logs logs--logviewer-container'>
              <LazyLog enableSearch={true} extraLines={1} caseInsensitive={true} text={lines} />
            </div>
          </Layout.Content>
        </Layout>
      </div>
    </section>
  )
})

export default Logs
