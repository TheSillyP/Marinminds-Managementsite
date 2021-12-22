import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Input, Button } from 'antd'
import { useMst } from '../../../data'

import './status.less'

export interface IPropTypes {
}

export interface IComponentState {
  status: string
  loading: boolean
}

export const Status: React.FC<IPropTypes> = observer(() => {
  const { yachts } = useMst()
  const [ state, setState ] = useState({ status: '', loading: false } as IComponentState)

  const handleStatusChange = ({ target }: any) => setState({ ...state, status: target.value })
  // const toggleLoading = () => setState({ ...state, ...{ loading: !state.loading } })

  const selectedYacht = yachts.selectedYacht
  const isDemo = !selectedYacht || String(selectedYacht.name).toLowerCase().includes('m/y demo')

  if (isDemo) {
    return null
  }

  const status = selectedYacht.status || {}
  const message = status.message || ''

  const persistStatus = () => {
    yachts.setStatus(state.status)
    setState({ ...state, status: '', loading: false })
  }

  return (
    <div className='status-widget'>
      <div className='status-widget status-widget--outer'>
        <p>
          <strong>Huidige status:</strong><br />
          {message}
        </p>
        <pre>{JSON.stringify(status, null, 2)}</pre>
        <Input disabled={state.loading} placeholder='Yacht Status' value={state.status} onChange={handleStatusChange} />
        <Button disabled={state.loading} type='primary' style={{ marginTop: '0.5em' }} onClick={persistStatus}>Save</Button>
      </div>
    </div>
  )
})

export default Status
