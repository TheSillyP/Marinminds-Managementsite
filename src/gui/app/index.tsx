import React from 'react'
import { Provider, rootStore } from '../../data'

import './app.less'

import { Router } from '../router'

export interface IPropTypes {}

export const App: React.FC<IPropTypes> = (props) => {
  let content: any = <Router />
  
  // Used for tests. 
  // Overwrite content if the component has child components 
  if (props.children) {
    content = props.children
  }

  return (
    <Provider value={rootStore}>
      {content}
    </Provider>
  )
}

export default App
