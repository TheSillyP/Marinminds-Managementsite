import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Select, Input, InputNumber, Button } from 'antd'

import { TEventCondition } from '../../../data/models/events'
import { useMst } from '../../../data'
// import { StyledInput } from '../styled-input'

import './create-condition.less'

export interface IProps {
  onChange?: (eventCondition: TEventCondition) => any
  value?: TEventCondition
  disabled?: boolean
  index: number
}

export interface IState {
  kind: string
  frequencyThreshold: number
  association: string
  rules: any[]
  event: string
}

export const initialState: IState = {
  kind: 'singlePoint',
  frequencyThreshold: 1,
  association: 'allOf',
  event: '',
  rules: [
    { path: '', operator: '=', threshold: 0 }
  ],
}

export const CreateCondition: React.FC<IProps> = observer((props) => {
  const [ state, replaceState ] = useState(initialState)
  const { signalk } = useMst()

  const onChange = typeof props.onChange === 'function' ? props.onChange : (s: TEventCondition) => true
  
  const setState = (mixin: Partial<IState>) => {
    const newState = { ...state, ...mixin }
    replaceState(newState)
    onChange(newState as TEventCondition)
  }

  const handleValueChange = (key: string) => (value: any) => setState({ [key]: value })
  const handleRuleChange = (num: number, key: string, useTarget: boolean = false) => (e: any) => {
    const rules: any[] = [ ...state.rules ].map((rule: any, index: number) => {
      if (index !== num) {
        return { ...rule }
      }

      const value = useTarget ? e.target.value : e
      
      return {
        ...rule,
        [key]: value
      }
    })

    setState({ rules })
  }

  const addRule = () => setState({
    rules: [
      ...state.rules,
      { path: '', operator: '=', threshold: 0 }
    ]
  })

  const removeRule = (index: number) => () => setState({
    rules: state.rules.filter((r: any, i: number) => (i !== index))
  })

  const skKeys = signalk.keys.slice()
  const skKeyFilter = (query: string, { value }: any) => String(value).toLowerCase().includes(String(query).toLowerCase())

  return (
    <div className='create-condition'>
      <div className='create-condition create-condition--outer'>
        <label className='group-label' style={{ marginBottom: '1em' }}>Condition:</label>
        <Select size='large' disabled={!!props.disabled} value={state.kind} onChange={handleValueChange('kind')} style={{ width: '100%' }}>
          <Select.Option value='singlePoint'>Single Point</Select.Option>
          <Select.Option value='multiPoint'>Multi Point</Select.Option>
          <Select.Option value='timePeriod'>Over Time</Select.Option>
        </Select>

        {state.kind !== 'singlePoint' && (
          <Input.Group style={{ marginTop: '1em' }}>
            <label className='secondary-label'>{state.kind === 'timePeriod' ? 'To trigger, condition must remain true for N minutes' : 'To trigger, condition must occur N times consecutively'}:</label>
            <InputNumber size='large' value={state.frequencyThreshold} onChange={handleValueChange('frequencyThreshold')} style={{ width: '100%' }} />
          </Input.Group>
        )}

        <label className='secondary-label' style={{ marginTop: '1em' }}>Rule association:</label>
        <Select size='large' disabled={!!props.disabled} value={state.association} onChange={handleValueChange('association')} style={{ width: '100%' }}>
          <Select.Option value='anyOf'>Any number of the rules may be true ("OR")</Select.Option>
          <Select.Option value='allOf'>All of the rules must be true ("AND")</Select.Option>
          <Select.Option value='oneOf'>Only one of the rules may be true</Select.Option>
        </Select>

        <Input.Group style={{ marginTop: '1em' }}>
          {state.rules.map((rule: any, index: number) => (
            <div key={index} className='create-condition create-condition--condition'>
              <label className='secondary-label'>Signal K path:</label>
              <em className='form-explanation'>Consult the "keys reference" in the <a href="http://signalk.org/specification/latest/" target="_blank" rel="noopener noreferrer">Signal K specification</a> for units and details on each path.</em>
              <Select value={rule.path} onChange={handleRuleChange(index, 'path')} style={{ width: '100%' }} showSearch={true} filterOption={skKeyFilter as any}>
                {skKeys.map((key: string) => <Select.Option key={key} value={key}>{key}</Select.Option>)}
              </Select>

              <label className='secondary-label' style={{ marginTop: '0.5em' }}>Operator:</label>
              <Select size='large' value={rule.operator} onChange={handleRuleChange(index, 'operator')} style={{ width: '100%' }}>
                <Select.Option value='='>Equals</Select.Option>
                <Select.Option value='!='>Doesn't equal</Select.Option>
                <Select.Option value='>'>Greater than</Select.Option>
                <Select.Option value='<'>Less than</Select.Option>
                <Select.Option value='>='>Greater than or equal</Select.Option>
                <Select.Option value='<='>Less than or equal</Select.Option>
              </Select>
              
              <label className='secondary-label' style={{ marginTop: '0.5em' }}>Threshold:</label>
              <InputNumber size='large' value={rule.threshold} onChange={handleRuleChange(index, 'threshold')} style={{ width: '100%' }} />

              {((index + 1) !== state.rules.length) && <Button style={{ marginTop: '0.5em' }} size='small' danger={true} onClick={removeRule(index)}><MinusCircleOutlined /> Remove rule</Button>}
            </div>
          ))}

          <Button onClick={addRule}><PlusCircleOutlined /> Add rule</Button>
        </Input.Group>
      </div>
    </div>
  )
})

export default CreateCondition
