import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './loading.less'

export interface IPropTypes {}

export const Loading: React.FC<IPropTypes> = () => {
  return (
    <div className='loading-wrapper'>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 42 }} spin />} />
    </div>
  )
}

export default Loading
