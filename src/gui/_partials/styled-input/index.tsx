import React from 'react'
import CSS from 'csstype'
import './styled-input.less'

import { EditOutlined } from '@ant-design/icons'
import { Input } from 'antd'

export interface IPropTypes {
  label: string,
  inputProps?: any
  block?: boolean
  icon?: React.ReactElement
  password?: boolean
  style?: CSS.Properties
  disabled?: boolean
}

export const StyledInput: React.FC<IPropTypes> = (props) => {
  const inputProps = props.inputProps || {}
  const styles = props.style ? { ...props.style } : {}
  
  return (
    <div className='styled-input' style={{ ...styles, display: props.block ? 'block' : 'inline-block' }}>
      <div className='styled-input--inner'>
        <div className='styled-input--icon'>
          {!props.icon && <EditOutlined />}
          {props.icon}
        </div>
        <div className='styled-input--input'>
          <div className='styled-input--input--label'>{props.label}</div>
          {!props.password && <Input disabled={!!props.disabled} {...inputProps} className='styled-input--input--input' />}
          {props.password && <Input.Password disabled={!!props.disabled} {...inputProps} visibilityToggle={false} className='styled-input--input--input' />}
        </div>
      </div>
    </div>
  )
}
