import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Modal } from 'antd'

import { EAuthState } from '../../data/models/auth'
import { useMst } from '../../data'
import { IAPINotification } from '../../data/types'

import { Loading } from '../loading'
import { Onboarding } from '../onboarding'
import { ResetPassword } from '../onboarding/reset-password'
import { Dashboard } from '../dashboard'
import { Error } from '../error'
import { Users } from '../users'
import { Logs } from '../logs'
import { Events } from '../events'
import { Yachtservice } from '../yachtservice'
import PMS from '../pms/src/App'


import { CreateYacht } from '../_partials/create-yacht'
import { CreateNotification } from '../_partials/create-notification'
import { CreateUser } from '../_partials/create-user'
import { CreateEvent } from '../_partials/create-event'

export interface IPropTypes {}

export const Router: React.FC<IPropTypes> = observer(() => {
  const { auth, ui, yachts, events, users } = useMst()

  useEffect(() => {
    if (auth.didTryAutoLogin === false) {
      auth.autoLogin()
    }
  })

  let content: any = (
    <Switch>
      <Route exact={true} path="/" component={Onboarding} />
      <Route exact={true} path="/reset-password" component={ResetPassword} />
    </Switch>
  )
  
  if (auth.state === EAuthState.LOGGED_IN) {
    content = (
      <Switch>
        <Route exact={true} path="/" component={Dashboard} />
        <Route exact={true} path="/logs" component={Logs} />
        <Route exact={true} path="/events" component={Events} />
        <Route exact={true} path="/management" component={Users} />
        <Route exact={true} path="/yachtservice" component={Yachtservice} />
        <Route exact={true} path="/pms" component={PMS} />

      </Switch>
    )
  }

  if (auth.state === EAuthState.LOGGING_IN) {
    content = (
      <Switch>
        <Route exact={true} path="/" component={Loading} />
      </Switch>
    )
  }

  if (auth.state === EAuthState.ERRORED) {
    const error = typeof auth.error === 'string' && auth.error.trim() !== '' ? auth.error : 'Error'
    content = (
      <Switch>
        <Route exact={true} path="/" component={() => <Error title={error} />} />
      </Switch>
    )
  }

  const cancelCreateYacht = () => {
    yachts.setEditing(undefined)
    
    if (ui.showCreateYacht) {
      ui.toggleShowCreateYacht()
    }
    
    return false
  }

  const createYacht = () => {
    if (yachts.editing) {
      yachts.updateYacht(yachts.editing, {
        name: yachts.addName,
        owner: yachts.addOwner,
        blackboxId: yachts.addBlackboxId,
        image: yachts.addYacht,
      })
      
      cancelCreateYacht()
      return
    }

    cancelCreateYacht()
    yachts.createYacht()
  }

  const updateUser = () => {
    if (!users.userToEdit) {
      return
    }

    users.updateUser(users.userToEdit.toJSON())
    users.setUserToEdit()
  }

  const createUser = () => {
    if (!users.userToCreate) {
      return Modal.warn({
        title: 'Incomplete',
        content: 'Please fill in all the fields to continue',
        onOk: () => false,
        onCancel: () => false,
      })
    }

    users.createUser(users.userToCreate.toJSON())
    ui.toggleShowCreateUser()
  }

  const createNotification = () => {
    if (yachts.selectedYacht && typeof yachts.pendingNotification === 'object' && yachts.pendingNotification) {
      const notification: IAPINotification = {
        yacht: yachts.selectedYacht.id,
        ...yachts.pendingNotification
      }

      yachts.sendNotification(notification)
    }

    ui.toggleShowCreateNotification()
    yachts.setNotificationToCreate({})
  }

  const createEvent = () => {
    if (!events.canCreateEvent) {
      return Modal.warn({
        title: 'Incomplete',
        content: 'Please fill in all the fields to continue',
        onOk: () => false,
        onCancel: () => false,
      })
    }

    events.createEvent()
    ui.toggleShowCreateEvent()
  }

  if (users.createdUser) {
    console.log(`[user.createdUser]`, users.createdUser)
  }

  const clearCreatedUser = () => {
    users.setCreatedUser()
    return false
  }

  return (
    <>
      <BrowserRouter>
        {content}
      </BrowserRouter>
      
      {auth.isLoggedIn() && (<>
        <Modal
          title="Temporary password"
          visible={(typeof users.createdUser === 'object' && users.createdUser)}
          onCancel={clearCreatedUser}
          onOk={clearCreatedUser}
        >
          {(typeof users.createdUser === 'object' && users.createdUser) && (<>
            <p>
              <strong>Username: </strong> {users.createdUser.Username || users.createdUser.email}
            </p>
            <p>
              <strong>Password: </strong> {users.createdUser.password}
            </p>
          </>)}
        </Modal>

        <Modal
          title="Create event"
          width="80vw"
          centered={true}
          visible={ui.showCreateEvent}
          okText="Create event"
          onOk={createEvent}
          onCancel={() => ui.toggleShowCreateEvent()}>
          <CreateEvent />
        </Modal>

        <Modal
          title={yachts.editing ? "Edit yacht" : "Add new yacht"}
          width="80vw"
          centered={true}
          visible={ui.showCreateYacht === true || yachts.editing !== undefined}
          okText={yachts.editing ? "Save yacht" : "Add yacht"}
          onOk={createYacht}
          onCancel={cancelCreateYacht}>
          <CreateYacht loading={yachts.saving} />
        </Modal>

        <Modal
          title="Add user"
          width="80vw"
          centered={true}
          visible={ui.showCreateUser}
          okText="Create"
          onOk={createUser}
          onCancel={ui.toggleShowCreateUser}>
          <CreateUser />
        </Modal>

        <Modal
          title="Edit user"
          width="80vw"
          centered={true}
          visible={users.userToEdit !== undefined}
          okText="Save"
          onOk={updateUser}
          onCancel={() => users.setUserToEdit()}>
          <CreateUser edit={users.userToEdit} />
        </Modal>

        <Modal
          title="Create notification"
          width="80vw"
          centered={true}
          visible={ui.showCreateNotification}
          okText="Send"
          onOk={createNotification}
          onCancel={ui.toggleShowCreateNotification}>
          <CreateNotification />
        </Modal>
      </>)}
    </>
  )
})

export default Router
