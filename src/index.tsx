import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from '@aws-amplify/core'

import './index.less'
import { AWS_CONFIG } from './config'
import App from './gui/app'

Amplify.configure(AWS_CONFIG)

// TODO (https://bit.ly/CRA-PWA) 
// import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
