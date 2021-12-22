import React, { useState , useEffect} from 'react';
import moment from 'moment';

import { useDispatch, useSelector} from 'react-redux';
import {Button, message, Space, Popconfirm} from 'antd';
import { Table } from "ant-table-extensions";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';

import { ExpandedDataIssue } from './expandableDataIssue';

import { EditIssue } from './EditIssueForm'

import { getAllIssues, deleteIssue, editIssue} from '../../../yachtservice/actions/issues';
import { getAllComments} from '../../../yachtservice/actions/comments';
import { getAllTasks} from '../../../yachtservice/actions/tasks';

import { useMst } from '../../../data'

import './issues.less'

export const Issues = () =>  {
  const dispatch = useDispatch();

  const [editIssueModalVisible, setEditIssueModalVisible] = useState(false);

  const [refreshData, setRefreshData] = useState(false);

  //the editdata from the row
  const [editData, setEditData] = useState([]);

  //all the rowkeys from which are expanded so this will get a different rowcolor
  var expandedKeys = [];
  const rowColor = '#e0e0e0';

  const { yachts } = useMst();

  const yachtMenuInTable =  yachts.yachts.map((yacht) => (
    { text: yacht.name, value: yacht.name }
  ))

  const issueColumns = [
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
      title: 'Yacht',
      dataIndex: 'yacht',
      filters: yachtMenuInTable,
      onFilter: (value, record) => record.yacht.indexOf(value) === 0,
      sorter: (a, b) => a.yacht.localeCompare(b.yacht), 
      width: '10%',
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
      title: 'Priority',
      dataIndex: 'priority',
      filters: [
        { text: 'Urgent', value: 'Urgent' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' },
      ],
      onFilter: (value, record) => record.priority.indexOf(value) === 0,
      width: '10%',
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
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      width: '10%',
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
      width: '10%',
      render(text, record) {
        return {
          props: {
            style: {  background: expandedKeys.includes(record._id) ? rowColor : '' },
          },
          children: <div>{text}</div>
        };
      }  
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
      width: '10%',
      render(text, record) {
          return {
            props: {
              style: { background: new Date(text) < new Date() ? "red" : expandedKeys.includes(record._id) ? rowColor : ''}
            },
            children: <div>{getFullDate(text)}</div>
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
          
          <Button onClick={() => {setRefreshData(false); setEditData(record); setEditIssueModalVisible(true);}} icon = { <EditOutlined />} type="primary" shape="circle" ></Button>
  
          <Popconfirm
            title="Are you sure to delete this issue and the related tasks?"
            onConfirm={() => confirmDeleteIssue(record._id)}
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

  const confirmDeleteIssue = (id) => {
    dispatch(deleteIssue(id));
  }

 //When completing the edit issue form 
   const onCreateEditIssue = async (values) => {
    try {
      dispatch(editIssue(editData._id,
      {
        title: values.title,
        description: values.description,
        comment: values.comment,
        state: values.state,
        category: values.category,
        yacht: values.yacht,
        priority: values.priority,
      }));

      message.success('Succesfull edited a issue!');
      
      setEditIssueModalVisible(false);
      setRefreshData(true);

    } catch (error) {
      message.error(error);
    }
  };

  //do a request to the backend for the data , and refresh when dispatch or editData changed
  useEffect(() => {
    dispatch(getAllIssues());
    dispatch(getAllTasks());
    dispatch(getAllComments());
  } , [dispatch, refreshData]);

  //getting all the data from the states
  const issues = useSelector((state) => state.issues);
  const tasks = useSelector((state) => state.tasks);
  const comments = useSelector((state) => state.comments);

  const getTheCorrectDataToIssue = () => {
    var taskData = [];
    var taskCommentsData = [];
    var commentData = [];

    for (const key in issues) {

      //loop trough all tasks and check if the are related to the issue && setting the correct tasks for the issue in taskData
      for (const keyTask in tasks){
        if(issues[key]._id === tasks[keyTask].issueID){
          taskData.push (tasks[keyTask]);
        }
      }

      //loop trough all comments and check if the are related to the issue && setting the correct comments for the issue in commentData
      for (const keyComment in comments){
        if(issues[key]._id === comments[keyComment].issuetaskID){
          commentData.push (comments[keyComment]);
        }
      }

      //set the correct tasks and comments to the issue data
      issues[key].expandedDataTasks = taskData;
      issues[key].expandedDataComments = commentData;

      //loop trough the expandedtasks and add the correct comments to the tasks
      for(const keyExpandedTask in issues[key].expandedDataTasks){

        for (const keyComment in comments){
          if(issues[key].expandedDataTasks[keyExpandedTask]._id === comments[keyComment].issuetaskID){
            taskCommentsData.push (comments[keyComment]);
          }
        }

        issues[key].expandedDataTasks[keyExpandedTask].expandedDataTasksComments = taskCommentsData;
        taskCommentsData = [];
      }

      taskData = [];
      commentData = [];
    }
  
    issues.sort(function(a, b) {
      var dateA = new Date(a.creationDate), dateB = new Date(b.creationDate);
      return dateB - dateA;
    });

    return issues;
  };

  return(
    <div className="issues issues--table-wrapper">

        {/* Editissue modal */}
        <EditIssue 
          visible={editIssueModalVisible}
          onCreate={onCreateEditIssue}
          onCancel={() => {setEditIssueModalVisible(false); }}
          data={editData}
        />

        <Table 
            dataSource={getTheCorrectDataToIssue()}
            expandedRowRender={(record) => 
              <ExpandedDataIssue
              record={record}
            />
              }  
            columns={issueColumns}
            rowKey={record => record._id}
            onExpand={(isExpanded, record) =>
              isExpanded ?  expandedKeys.push(record._id) : expandedKeys.splice(expandedKeys.indexOf(record._id),1)
            }
            searchable 
        />
                
    </div> 
  )
}
