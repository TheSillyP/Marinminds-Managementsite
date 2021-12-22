import moment from 'moment';
import React, {useEffect} from 'react';
import {Form, Input, Select, DatePicker, Modal} from 'antd';

import { useMst } from '../../../data'

const { Option } = Select;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

var deadlineDate = moment();

export const EditIssue = ({ visible, onCreate, onCancel, data}) => {
  const { yachts } = useMst();

  const yachtSelectInModal =  yachts.yachts.map((yacht) => (
    <Select.Option key={yacht.id} value={yacht.name}> {yacht.name} </Select.Option>
  ))

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [data]);

  if(data === null)
    return(null);

  if(data.deadline != null){
    deadlineDate = moment(data.deadline);
  }

  return(
    <Modal 
      title={ 'Edit issue (' + data.title + ')'} 
      visible={visible} 
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }} 
      onCancel={() => {
        form.resetFields(); 
        onCancel();
      }} 
      okText="Edit issue"
      >

        <Form 
          {...layout} 
          name="addissue" 
          form={form}
          initialValues={{
            'title': data.title,
            'description': data.description,
            'state': data.state,
            'category': data.category,
            'yacht': data.yacht,
            'priority': data.priority,
            'deadline': deadlineDate
          }}>

          <Form.Item label="Title" name="title" >
            <Input/>
          </Form.Item>

          <Form.Item label="Description" name="description">
          <Input.TextArea/>
          </Form.Item>

          <Form.Item label="Category" name="category">
              <Select>
                <Option value="Engine">Engine</Option>
                <Option value="Propeller">Propeller</Option>
                <Option value="Hull">Hull</Option>
              </Select>
            </Form.Item>
            

            <Form.Item label="Yacht" name="yacht">
              <Select>
                {yachtSelectInModal}
              </Select>
            </Form.Item>

            <Form.Item label="Priority" name="priority">
              <Select>
                <Option value="Urgent">Urgent</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Status" name="state">
              <Select>
                <Option value="Open">Open</Option>
                <Option value="Closed">Closed</Option>
                <Option value="In progress">In progress</Option>
                <Option value="Resolved">Resolved</Option>
                <Option value="In review">In review</Option>
                <Option value="Postponed">PostPoned</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Deadline" name="deadline">
            <DatePicker format={'DD/MM/YYYY'} />
          </Form.Item>
            
        </Form>
    </Modal>
  );  
}

