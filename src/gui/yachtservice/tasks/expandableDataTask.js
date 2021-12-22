import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {Table, Input, Button, Divider, Space, Form, message, Popconfirm} from 'antd';
import {PlusCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';

import { createComment } from '../../../yachtservice/actions/comments';
import { deleteIssue, editIssue, updateCommentOnIssue} from '../../../yachtservice/actions/issues';
import { updateCommentOnTask} from '../../../yachtservice/actions/tasks'

import { EditIssue } from '../issues/EditIssueForm';

import { useMst } from '../../../data'

const formRef = React.createRef();

export const ExpandedDataTask = ({record}) => {
  const dispatch = useDispatch();

  const [editIssueModalVisible, setEditIssueModalVisible] = useState(false);
  const [editData, setEditData] = useState([]);

  const {auth} = useMst()
  const user = auth.user();

  const issueColumns = [
    {title: 'Created at', dataIndex: 'creationDate', render: (date) => getFullDate(date)},
    {title: 'Title', dataIndex: 'title'},
    {title: 'Description', dataIndex: 'description'},
    {title: 'Comment', dataIndex: 'comment'},
    {title: 'Yacht', dataIndex: 'yacht'},
    {title: 'Priority', dataIndex: 'priority'},
    {title: 'Status', dataIndex: 'state'},
    {title: 'Category', dataIndex: 'category'},
    {title: 'Deadline', dataIndex: 'deadline', render: (date) => getFullDate(date)},
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <Button onClick={() => {setEditData(record); setEditIssueModalVisible(true);}} icon = { <EditOutlined />} type="primary" shape="circle" ></Button>

          <Popconfirm
            title="Are you sure to delete this issue?"
            onConfirm={() => confirmDeleteIssue(record._id)}
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
    {title: 'Comment', dataIndex: 'comment', width: '85%'}
  ];

  const getFullDate = (date) => {
    const dateAndTime = date.split('T');
  
    return dateAndTime[0].split('-').reverse().join('-');
  };


  const confirmDeleteIssue = (record) => {
    dispatch(deleteIssue(record));
  }

  //When completing the issue
  const onCreateEditIssue = (values) => {
    setEditIssueModalVisible(false);

    //get the account name
    const creator = user.name;

    dispatch(editIssue(editData._id,
      {
      title: values.title,
      description: values.description,
      comment: values.comment,
      state: values.state,
      category: values.category,
      yacht: values.yacht,
      yachtManager: creator,
      priority: values.priority,
      deadline: values.deadline,
    }));
  };
  
  //addcomment to the task
  const addComment = (values) => {
    const creationDate = new Date();

    //get the account name
    const creator = user.name;

    try {
      if(values.type === "issue"){ //check if the comment is for a issue or task

        dispatch(createComment({
          issuetaskID: values.id,
          comment: values.comment,
          creationDate: creationDate,
          creator: creator
        }))

        dispatch(updateCommentOnIssue(values.id,values.comment));
      }
      else{ //comment is for the task

        dispatch(createComment({
          issuetaskID: record._id,
          comment: values.comment,
          creationDate: creationDate,
          creator: creator
        }))

        dispatch(updateCommentOnTask(record._id,values.comment));
      }

      formRef.current.resetFields();

      message.success('Succesfull added a comment!');

    } catch (error) {
      message.error(error);
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
        
        <Form name="comment" onFinish={addComment} ref={formRef} initialValues={{'type':"issue", 'id':record._id}}>
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
      <EditIssue
      visible={editIssueModalVisible}
      onCreate={onCreateEditIssue}
      onCancel={() => {setEditData(null); setEditIssueModalVisible(false); }}
      data={editData}
      />

      <div className="expandableData--content">
        <br/>
        <Divider>Related issue</Divider>
      
        <Table 
          style={{ marginLeft: 50, marginRight: 50, marginBottom: 25 }} 
          columns={issueColumns} 
          dataSource={record.expandedDataIssues.reverse()} 
          pagination={false} 
          rowKey={record => record._id}
          expandedRowRender={(record) => displayComments(record)}  
        />

        <Divider>Comments</Divider>

        <Table style={{ marginLeft: 50, marginRight: 50, marginBottom: 25 }} columns={commentsColumns} dataSource={record.expandedDataComments.reverse()} pagination={false} rowKey={record => record._id}/>

        <Form name="comment" onFinish={addComment} ref={formRef} initialValues={{'type':"task"}}>
          <div style={{ marginLeft: 50, marginRight: 50}}>

            <Form.Item  name="comment">
              <Input.TextArea></Input.TextArea>
            </Form.Item>

          </div>

          <Form.Item hidden name="type">
            <Input.TextArea></Input.TextArea>
          </Form.Item>
          
          <Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />} style={{ marginRight: 50, marginBottom: 25 , float: 'right' }}>Add comment</Button>
        </Form>
        <div className="expandableData--extraHeight"/>
      </div>
    </>
  );
}


