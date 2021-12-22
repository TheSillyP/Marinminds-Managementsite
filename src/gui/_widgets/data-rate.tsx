import React from 'react'
import { observer } from 'mobx-react-lite'
import { FlexibleWidthXYPlot, LineSeries } from 'react-vis'
import { NodeIndexOutlined } from '@ant-design/icons'
import { TEventFrequencyModel } from '../../data/models/ui'
import { useMst } from '../../data'

import './widgets.less'

export interface IPropTypes {}

export const DataRateWidget: React.FC<IPropTypes> = observer(() => {
  const { ui } = useMst()

  const data = ui.eventFrequency.map((model: TEventFrequencyModel) => {
    return {
      x: model.time,
      y: model.frequency
    }
  })

  return (
    <div className='widget'>
      <div className='widget widget--widget widget--widget-events'>
        <div className='widget widget--widget--background-graph'>
          <FlexibleWidthXYPlot height={200}>
            <LineSeries data={data} opacity={0.5} curve='curveMonotoneX' />
          </FlexibleWidthXYPlot>
        </div>

        <h1 className='widget widget--widget--title'>
          <NodeIndexOutlined /> Realtime data rate
        </h1>
        <h2 className='widget widget--widget--value'>{ui.lastFrequency.frequency} <span>events/sec</span></h2>
      </div>
    </div>
  )
})