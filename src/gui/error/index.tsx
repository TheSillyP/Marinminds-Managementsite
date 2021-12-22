import React from 'react'
import './error.less'

export interface IPropTypes {
  title?: string
}

export const Error: React.FC<IPropTypes> = (props) => {
  let { title } = props

  if (typeof title !== 'string' || title.trim() === '') {
    title = 'Error'
  }

  return (
    <div className='dashboard-wrapper'>
      <h1>{title}</h1>
    </div>
  )
}

export default Error
