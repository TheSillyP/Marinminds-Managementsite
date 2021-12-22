import React, { useState , useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {Button, message, Space, Popconfirm} from 'antd';
import { Table } from "ant-table-extensions";
import moment from 'moment';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';

import { ExpandedDataTask } from './expandableDataTask.js';

import { getAllTasks, deleteTask, editTask} from '../../../yachtservice/actions/tasks';
import { getAllComments} from '../../../yachtservice/actions/comments';
import { getAllIssues} from '../../../yachtservice/actions/issues';

import { EditTask } from './EditTaskForm';

import { useMst } from '../../../data'

import './tasks.less'

export const Tasks = () =>  {
  const dispatch = useDispatch();

  //useState for the modal
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);

  const [refreshData, setRefreshData] = useState(false);

  //set editdata from rowdata when pressing edit button
  const [editData, setEditData] = useState([]);

  //all rowkeys from which are expanded
  var expandedKeys = [];
  const rowColor = '#ddd';

  const { yachts , users} = useMst();

  //get all yachts
  const yachtMenuInTable =  yachts.yachts.map((yacht) => (
    { text: yacht.name, value: yacht.name }
  ))

  //get all users
  const technicianMenuInTable =  users.users.map((user) => (
    { text: user.email, value: user.email }
  ))

  const taskColumns = [
    {
      title: 'Created at',
      dataIndex: 'creationDate',
      sorter: (a, b) => moment(a.creationDate).unix() - moment(b.creationDate).unix(),
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{getFullDate(text)}</div>,
        };
      }  
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title), 
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Issue',
      dataIndex: 'issueTitle',
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Technician',
      dataIndex: 'technician',
      filters: technicianMenuInTable,
      onFilter: (value, record) => record.technician.indexOf(value) === 0,
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Yacht',
      dataIndex: 'yacht',
      filters: yachtMenuInTable,
      onFilter: (value, record) => record.yacht.indexOf(value) === 0,
      sorter: (a, b) => a.yacht.localeCompare(b.yacht),
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Status',
      dataIndex: 'state',
      filters: [
        { text: 'Open', value: 'Open' },
        { text: 'Closed', value: 'Closed' },
        { text: 'In progress', value: 'In progress' },
        { text: 'Resolved', value: 'Resolved' },
        { text: 'In review', value: 'In review' },
        { text: 'Postponed', value: 'Postponed' },
      ],
      onFilter: (value, record) => record.state.indexOf(value) === 0,
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Category',
      dataIndex: 'category',
      filters: [
        { text: 'Engine', value: 'Engine' },
        { text: 'Propeller', value: 'Propeller' },
        { text: 'Hull', value: 'Hull' },
      ],
      onFilter: (value, record) => record.category.indexOf(value) === 0,
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>,
        };
      }  
    },
    {
      title: 'Planned for',
      dataIndex: 'plannedFor',
      sorter: (a, b) => moment(a.plannedFor).unix() - moment(b.plannedFor).unix(),
      render(date, record) {
        return {
          props: {
            style: { background: new Date(date) < new Date() ? "red" : expandedKeys.includes(record._id) ? rowColor : ''}
          },
          children: <div>{getFullDate(date)}</div>
        };
      }
    },
    {
      title: 'Action',
      key: 'action',
      render(record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children:
        <Space size="middle">
  
          <Button onClick={() => {setRefreshData(false); setEditData(record); setEditTaskModalVisible(true);}} icon = { <EditOutlined />} type="primary" shape="circle" ></Button>
         
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => confirmDeleteTask(record._id)}
          >
            <Button icon = { <DeleteOutlined />} type="primary" shape="circle" ></Button>
          </Popconfirm>
        </Space>
        };
      }
    }
  ];

  const getFullDate = (date) => {
    const dateAndTime = date.split('T');
  
    return dateAndTime[0].split('-').reverse().join('-');
  };

  const confirmDeleteTask = (id) => {
    dispatch(deleteTask(id));
  }

  //When completing the edit task form 
  const onCreateEditTask = (values) => {
    try {

      dispatch(editTask(editData._id,{
        title: values.title,
        description: values.description,
        state: values.state,
        category: values.category,
        technician: values.technician,
        plannedFor: values.plannedFor,
      }));

      message.success('Succesfull edited a task!');

      setEditTaskModalVisible(false);
      setRefreshData(true);

    } catch (error) {
          message.error(error);
    }
  };

  //do a request to the backend for the data || useEffect will check dispatch for changes
  useEffect(() => {
    dispatch(getAllTasks());
    dispatch(getAllIssues());
    dispatch(getAllComments());
  }, [dispatch, refreshData]);

  //getting all the data from the states
  const issues = useSelector((state) => state.issues);
  const tasks = useSelector((state) => state.tasks);
  const comments = useSelector((state) => state.comments);

  const getTheCorrectDataToTask = () => {
    var issueData = [];
    var commentData = [];
    var issueCommentsData = [];


    for (const key in tasks) {

      //loop trough all tasks and check if the are related to the issue && setting the correct tasks for the issue in issueData
      for (const keyIssue in issues){
        if(tasks[key].issueID === issues[keyIssue]._id){
          issueData.push (issues[keyIssue]);
        }
      }

      //loop trough all comments and check if the are related to the issue && setting the correct comments for the issue in commentData
      for (const keyComment in comments){
        if(tasks[key]._id === comments[keyComment].issuetaskID){
          commentData.push (comments[keyComment]);
        }
      }

      //set the correct tasks and comments to the issue data
      tasks[key].expandedDataIssues = issueData;
      tasks[key].expandedDataComments = commentData;

      //loop trough the expandedtasks and add the correct comments to the tasks
      for(const keyExpandedTask in tasks[key].expandedDataIssues){

        for (const keyComment in comments){
          if(tasks[key].expandedDataIssues[keyExpandedTask]._id === comments[keyComment].issuetaskID){
            issueCommentsData.push (comments[keyComment]);
          }
        }

        tasks[key].expandedDataIssues[keyExpandedTask].expandedDataTasksComments = issueCommentsData;
        issueCommentsData = [];
      }

      issueData = [];
      commentData = [];
    }

    tasks.sort(function(a, b) {
      var dateA = new Date(a.creationDate), dateB = new Date(b.creationDate);
      return dateB - dateA;
    });

    return tasks;
  };

    return(
      <div className="tasks tasks--table-wrapper">
    
        {/* Edittask modal */}
        <EditTask
          visible={editTaskModalVisible}
          onCreate={onCreateEditTask}
          onCancel={() => {setEditTaskModalVisible(false);}}
          data={editData}
        />

        <Table 
            dataSource={getTheCorrectDataToTask()}
            expandedRowRender={(record) => 
              <ExpandedDataTask 
                  record={record}
              />}  
            columns={taskColumns}
            rowKey={record => record._id}
            onExpand={(isExpanded, record) =>
              isExpanded ?  expandedKeys.push(record._id) : expandedKeys.splice(expandedKeys.indexOf(record._id),1)
            }
            searchable
        />
                      
      </div>
    );
}