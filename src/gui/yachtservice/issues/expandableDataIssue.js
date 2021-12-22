import mongoose from 'mongoose';
import React, { useState} from 'react';
import { useDispatch } from 'react-redux';

import {Table, Input, Button, Divider, Space, Form, message, Popconfirm, Select} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';

import { createComment } from '../../../yachtservice/actions/comments';
import { createTask, deleteTask, editTask, updateCommentOnTask} from '../../../yachtservice/actions/tasks';
import { updateCommentOnIssue } from '../../../yachtservice/actions/issues';

import { EditTask } from '../tasks/EditTaskForm';
import { AddTask } from '../tasks/AddTaskForm';

import { useMst } from '../../../data'

const formRef = React.createRef();

export const ExpandedDataIssue = ({record}) => {
  const dispatch = useDispatch();

  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [editData, setEditData] = useState([]);

  const {auth} = useMst()
  const user = auth.user();

  const taskColumns = [
    {title: 'Created at', dataIndex: 'creationDate', render: (date) => getFullDate(date)},
    {title: 'Title', dataIndex: 'title'},
    {title: 'Description', dataIndex: 'description'},
    {title: 'Comment', dataIndex: 'comment'},
    {title: 'Technician', dataIndex: 'technician'},
    {title: 'Yacht', dataIndex: 'yacht'},
    {title: 'Status', dataIndex: 'state'},
    {title: 'Category', dataIndex: 'category'},
    {title: 'Planned for:', dataIndex: 'plannedFor', render: (date) => getFullDate(date)},
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <Button onClick={() => {setEditData(record); setEditTaskModalVisible(true);}} icon = { <EditOutlined />} type="primary" shape="circle" ></Button>

          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => confirmDeleteTask(record._id)}
          >
            <Button icon = { <DeleteOutlined />} type="primary" shape="circle" ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

    const commentsColumns = [
      {title: 'Date of comment', dataIndex: 'creationDate', render: (date) => getFullDate(date)},
      {title: 'Creator', dataIndex: 'creator', width: '10%'},
      {title: 'Comment', dataIndex: 'comment', width: '80%'}
    ];

    const getFullDate = (date) => {
      const dateAndTime = date.split('T');
    
      return dateAndTime[0].split('-').reverse().join('-');
    };

    const confirmDeleteTask = (record) => {
      dispatch(deleteTask(record));
    }
    
    const onCreateEditTask = (values) => {
      setEditTaskModalVisible(false);

      dispatch(editTask(editData._id,{
        title: values.title,
        description: values.description,
        state: values.state,
        category: values.category,
        technician: values.technician,
        plannedFor: values.plannedFor,
      }));
    };

    //addtask to the issue
    const onCreateAddTask = (values) => {
      setAddTaskModalVisible(false);

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

    //addcomment to the issue
    const addComment = (values) => {
      const creationDate = new Date();

      //get the account name
      const creator = user.name;

      try {
        if(values.type === "issue"){ //check if the comment is for a issue or task

          dispatch(createComment({
            issuetaskID: record._id,
            comment: values.comment,
            creationDate: creationDate,
            creator: creator
          }))

          dispatch(updateCommentOnIssue(record._id,values.comment));
        }
        else{ //comment is for the task

          dispatch(createComment({
            issuetaskID: values.id,
            comment: values.comment,
            creationDate: creationDate,
            creator: creator
          }))

          dispatch(updateCommentOnTask(values.id,values.comment));
        }
        
        formRef.current.resetFields();

        message.success('Succesfull added a comment!');

      } catch (error) {
        message.success(error);
      }
    };

    const displayComments = (record) =>{

      return (
        <>
          <Table 
            style={{ marginLeft: 0, marginRight: 50, marginBottom: 25 }} 
            columns={commentsColumns} 
            dataSource={record.expandedDataTasksComments.reverse()} 
            pagination={false} rowKey={record => record._id} 
          />
          
          <Form name="comment" onFinish={addComment} ref={formRef} initialValues={{'type':"task", 'id':record._id}}>
            <div style={{ marginLeft: 0, marginRight: 50}}>

              <Form.Item name="comment">
                <Input.TextArea></Input.TextArea>
              </Form.Item>

            </div>

            <Form.Item hidden name="type">
              <Input.TextArea></Input.TextArea>
            </Form.Item>

            <Form.Item hidden name="id">
              <Input.TextArea></Input.TextArea>
            </Form.Item>

            <Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />} style={{ marginRight: 50, marginBottom: 25 , float: 'right' }}>Add comment</Button>
          </Form>
        </>
      )
    }

    return(
      <> 
        <EditTask 
          visible={editTaskModalVisible}
          onCreate={onCreateEditTask}
          onCancel={() => {setEditData(null); setEditTaskModalVisible(false); }}
          data={editData}
        />

        <AddTask 
          visible={addTaskModalVisible}
          onCreate={onCreateAddTask}
          onCancel={() => { setAddTaskModalVisible(false); }}
          selectIssues={<Select.Option key={record._id} value={record._id + "/" + record.title + "/" + record.yacht}>{record.title}</Select.Option>}
        />

        <div className="expandableData--content">
          <Button onClick={() => {setAddTaskModalVisible(true);}} type="primary" htmlType="submit" icon={<PlusCircleOutlined />} style={{ marginRight: 50, marginBottom: 25 , marginTop: 25, float: 'right' }}>Add task to this issue</Button>

          <Divider>Related tasks</Divider>

          <Table 
            style={{ marginLeft: 50, marginRight: 50, marginBottom: 25 }} 
            columns={taskColumns} 
            dataSource={record.expandedDataTasks.reverse()} 
            pagination={false} rowKey={record => record._id} 
            expandedRowRender={(record) => displayComments(record)}  
          />

          <Divider>Comments</Divider>

          <Table style={{ marginLeft: 50, marginRight: 50, marginBottom: 25 }} columns={commentsColumns} dataSource={record.expandedDataComments.reverse()} pagination={false} rowKey={record => record._id}/>

          <Form name="comment" onFinish={addComment} ref={formRef} initialValues={{'type':"issue"}}>

            <div style={{ marginLeft: 50, marginRight: 50}}>

              <Form.Item name="comment">
                <Input.TextArea></Input.TextArea>
              </Form.Item>

            </div>

            <Form.Item hidden name="type">
              <Input.TextArea></Input.TextArea>
            </Form.Item>

            <Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />} style={{ marginBottom: 25 , marginRight: 50, float: 'right' }}>Add comment</Button>
          </Form>

          <div className="expandableData--extraHeight"/>

        </div>
      </>
    );
}


