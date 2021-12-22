import React, { useEffect, useState } from 'react'
import md5 from 'md5'
// import moment from 'moment'
import { observer } from 'mobx-react-lite'
import { ChatFeed, Message } from 'react-chat-ui'
import { Row, Col, Input, Button, Avatar, Popover } from 'antd'
import { SendOutlined, WarningOutlined } from '@ant-design/icons'

import { TChatMessage } from '../../../data/models/chat'
import { ECRUDState } from '../../../data/types'
import { useMst } from '../../../data'
import { isValidEmail } from '../../../config'

import './communicator.less'

export interface IPropTypes {
}

export interface IComponentState {
  newMessage: string,
  activeUser: string
}

export const Communicator: React.FC<IPropTypes> = observer(() => {
  const { auth, chat, yachts, users, ui } = useMst()
  const [ state, setState ] = useState({ newMessage: '', activeUser: chat.users[0] || '' } as IComponentState)

  const user = auth.user()
  const selectedYacht = yachts.selectedYacht
  const isDemo = !selectedYacht || String(selectedYacht.name).toLowerCase().includes('m/y demo')

  useEffect(() => {
    if (chat.state !== ECRUDState.PENDING) {
      return
    }
    
    users.hydrate()
    chat.hydrate()
  })

  const renderMessage = (id: number|string) => (msg: TChatMessage) => new Message({
    id,
    senderName: msg.from,
    message: msg.message
  })

  const bubbleStyles = {
    chatbubble: {
      backgroundColor: '#eee'
    }
  }

  const onMessageSend = () => {
    const message: string = state.newMessage || ''

    if (message.trim() === '' || state.activeUser.trim() === '') {
      return
    }

    // console.log(`Sending message to yacht ${yachts.selectedYacht.id} from ${user.email}: ${message}`)
    chat.sendMessage(state.activeUser, message, user, yachts.selectedYacht)
    setState({ ...state, newMessage: '' })
  }

  const handleInputChange = ({ target }: any) => {
    setState({
      ...state,
      [target.name]: target.value
    } as IComponentState)
  }

  const handleEnterPress = ({ which }: any) => {
    if (which !== 13) {
      return
    }

    onMessageSend()
  }
  
  const setUserActive = (activeUser: string) => () => setState({ ...state, activeUser })

  const chatMessages = chat.messages.slice(0).filter((msg: TChatMessage) => {
    if (state.activeUser.trim() === '') {
      return false
    }

    // console.log(`${msg.from} => ${msg.to} (${state.activeUser})`)
    return (msg.from === 'SYSTEM' && msg.to === state.activeUser) || (msg.from === state.activeUser && msg.to === 'SYSTEM')
  })

  return (
    <div className='communicator'>
      <div className='communicator communicator--outer'>
        <div className='communicator communicator--inner'>
          <div className='communicator communicator--heads'>
            {chat.users
              .filter((key: string) => (key !== user.id && key !== user.email))
              .filter((key: string) => {
                const user = users.users.slice().find((candidate: any) => (candidate.email === key))
                
                if (!user) {
                  return false
                }

                const yachts = (user.hasOwnProperty('yachts') && user.yachts.length ? user.yachts : []).slice()

                if (yachts.length === 0) {
                  return isDemo
                }

                const hasSelectedYacht = yachts.find((candidate: any) => (selectedYacht && selectedYacht.id === candidate.id))
                const result = hasSelectedYacht !== undefined
                return result
              })
              .map((key: string, index: number) => {
                const user = users.users.slice().find((candidate: any) => (candidate.email === key))

                if (!user) {
                  return null
                }

                const isActive = state.activeUser === user.email
                const classNames = ['communicator', 'communicator--heads--avatar', isActive ? 'communicator--heads--avatar-active' : '' ]
                const props: any = {
                  key,
                  size: 60,
                  className: classNames.join(' ')
                }

                if (isValidEmail(user.email)) {
                  props.src = `https://www.gravatar.com/avatar/${md5(user.email)}`
                }

                if (user.hasOwnProperty('avatar') && user.avatar.includes('http')) {
                  props.src = user.avatar
                }

                return (
                  <Popover key={key} trigger='hover' content={user.email} title={null}>
                    <Avatar {...props} onClick={setUserActive(user.email)} />
                  </Popover>
                )
              })}
          </div>

          {state.activeUser !== '' && (
            <div className='communicator communicator--chatfeed-wrapper'>
              <ChatFeed
                messages={chatMessages.map((msg: TChatMessage) => renderMessage(msg.from)(msg))}
                isTyping={false}
                hasInputField={false}
                showSenderName={true}
                bubblesCentered={false}
                bubbleStyles={bubbleStyles}
              />
            </div>
          )}

          {state.activeUser === '' && (
            <div className='communicator communicator--warning'>
              Select a user to talk to...
            </div>
          )}

          <div className='communicator communicator--messagebar-outer'>
            <div className='communicator communicator--messagebar-inner'>
              <Row>
                <Col sm={18} xs={24}>
                  <div className='communicator communicator--messagebar--input'>
                    <Input disabled={!selectedYacht} value={state.newMessage} name='newMessage' size='large' onChange={handleInputChange} placeholder='Your message...' onKeyUp={handleEnterPress} />
                  </div>
                </Col>
                <Col sm={6} xs={24}>
                  <div className='communicator communicator--messagebar--buttons'>
                    <Button disabled={!selectedYacht || state.newMessage.trim() === ''} type='primary' onClick={onMessageSend}><SendOutlined /> Send</Button>
                    <Button disabled={!selectedYacht} danger={true} onClick={ui.toggleShowCreateNotification}><WarningOutlined /> Notification</Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Communicator
