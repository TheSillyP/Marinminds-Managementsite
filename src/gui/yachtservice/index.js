import React, { useState , useEffect,} from 'react';
import mongoose from 'mongoose';
import { observer } from 'mobx-react-lite'

import { Provider, useDispatch, useSelector} from 'react-redux';
import {Button, Layout, Tabs, message, Typography, Select} from 'antd';
import {PlusCircleOutlined, IssuesCloseOutlined ,ReconciliationOutlined,} from '@ant-design/icons';

import { AddIssue } from './issues/AddIssueForm';
import { AddTask} from './tasks/AddTaskForm';

import { createTask} from '../../yachtservice/actions/tasks';
import { createIssue, getAllIssues} from '../../yachtservice/actions/issues';
import { createComment} from '../../yachtservice/actions/comments';

import { createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../../yachtservice//reducers';

import { Header } from '../_partials/header'

import './yachtservice.less'

import { Tasks } from './tasks';
import { Issues } from './issues';

import { useMst } from '../../data'

export const Yachtservice = () => {
  const store = createStore(reducers, compose(applyMiddleware(thunk)));

  return (
    <Provider store={store}> 
      <App 
      history
      location
      match
      />
    </Provider>
  )
}

export const App = observer(({ history, location, match }) =>  {
    const dispatch = useDispatch();

    const [ activeKey, setActiveKey ] = useState('Issue')
    const [addIssueFormVisible, setAddIssueModalVisible] = useState(false);
    const [addTaskFormVisible, setAddTaskFormvisible] = useState(false);

    const {auth} = useMst()
    const user = auth.user();

    //When completing the add issue form 
    const onCreateAddIssue = (values) => {

        setAddIssueModalVisible(false);

        const deadlineDate = new Date(values.deadline);
        const creationDate = new Date();

        const id = mongoose.Types.ObjectId();
        
        //get the account name
        const creator = user.name;

        try {
        //push data to mongoDB
        dispatch(createIssue({
            _id: id,
            title: values.title,
            description: values.description,
            comment: values.comment,
            state: values.state,
            category: values.category,
            yacht: values.yacht,
            yachtManager: creator,
            priority: values.priority,
            deadline: deadlineDate,
            creationDate: creationDate
        }));

        if(values.comment){
            dispatch(createComment({
            issuetaskID: id,
            comment: values.comment,
            creationDate: creationDate,
            creator: creator
            }))
        }

        message.success('Succesfull added a issue!');

        } catch (error) {
        message.error(error);
        }
        
    };

    //When completing the add task form 
    const onCreateAddTask = (values) => {

        setAddTaskFormvisible(false);

        const plannedForDate = new Date(values.plannedFor);

        const creationDate = new Date();

        const id = mongoose.Types.ObjectId();
        
        //get the account name
        const creator = user.name;

        const inputIssue = values.issueID.split('/');

        const issueID = inputIssue[0];
        const issueTitle = inputIssue[1];
        const yacht = inputIssue[2];

        try {
            //push data to mongoDB
        dispatch(createTask({
            _id: id,
            issueID: issueID,
            title: values.title,
            issueTitle: issueTitle,
            description: values.description,
            comment: values.comment,
            state: values.state,
            category: values.category,
            yacht: yacht,
            technician: values.technician,
            plannedFor: plannedForDate,
            creationDate: creationDate
        }));

        if(values.comment){
            dispatch(createComment({
            issuetaskID: id,
            comment: values.comment,
            creationDate: creationDate,
            creator: creator
            }))
        }

        message.success('Succesfull added a task!');

        } catch (error) {
        message.error(error);
        }
    };

    //do a request to the backend for the data || useEffect will check dispatch for changes
    useEffect(() => {
        dispatch(getAllIssues());
    }, [dispatch]);

    //getting all the data from the states
    const issues = useSelector((state) => state.issues);

    const getIssuesForTaskList = () => {
        const selectIssues = [];
        
            for (const key in issues.reverse()) {
                selectIssues.push(<Select.Option key={issues[key]._id} value={issues[key]._id + "/" + issues[key].title + "/" + issues[key].yacht}>{issues[key].title}</Select.Option>);
            }
      
        return selectIssues;
      };

      
    const changeAddButton = () => {
        if (activeKey === 'Issue') {
            setAddIssueModalVisible(true);
        }
        else{
            setAddTaskFormvisible(true);
        }
    }

    const tabbarButtons = {
        right: <Button icon={<PlusCircleOutlined />} type="primary" onClick={changeAddButton}> Add {activeKey}</Button>
    }

    return(
      <section className='jachtservice'>
        <div className='jachtservice jachtservice--container'>
          <Layout>
            <Header {...{ history, location, match }} />

            <Layout.Content className='jachtservice jachtservice--content'>

                <Typography.Title align="middle">{activeKey}s</Typography.Title>

                {/* Addissue modal */}
                <AddIssue
                    visible={addIssueFormVisible}
                    onCreate={onCreateAddIssue}
                    onCancel={() => { setAddIssueModalVisible(false); }}
                />

                {/* Addtask modal */}
                <AddTask 
                  visible={addTaskFormVisible}
                  onCreate={onCreateAddTask}
                  onCancel={() => { setAddTaskFormvisible(false); }}
                  selectIssues={getIssuesForTaskList()}
                />

                <Tabs activeKey={activeKey} onChange={setActiveKey} tabBarStyle={{ paddingLeft: '1em' }} tabBarExtraContent={tabbarButtons}>

                    <Tabs.TabPane tab={ <span> <IssuesCloseOutlined/>Issues</span>} key='Issue'>
                        <Issues/>
                    </Tabs.TabPane> 

                    <Tabs.TabPane tab={<span><ReconciliationOutlined/>Tasks</span>} key='Task'>
                        <Tasks/>
                    </Tabs.TabPane>
                </Tabs>
    
            </Layout.Content>
          </Layout>
        </div>
      </section>
    )
})
