import moment from 'moment';
import React, {useEffect} from 'react';
import {Form, Input, Select, DatePicker, Modal} from 'antd';

import { useMst } from '../../../data'

const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

var deadlineDate = "";

export const EditTask = ({ visible, onCreate, onCancel, data }) => {
  const { users } = useMst();

  const technicianSelectInModal =  users.users.map((user) => (
      <Select.Option key={user.id} value={user.email}> {user.email} </Select.Option>
  ))

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [data]);

  if(data === null)
    return(null);

  if(data.plannedFor != null){
  deadlineDate = moment(data.plannedFor);
  }

  return(
    <Modal 
      title={'Edit task (' + data.title + ')'}  
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
        okText="Edit task">

        <Form 
          {...layout} 
          name="addtask"
          form={form}
          initialValues={{
            modifier: 'public',
            'issueID': data.issueTitle,
            'title': data.title,
            'description': data.description,
            'technician': data.technician,
            'state': data.state,
            'category': data.category,
            'plannedFor': deadlineDate
          }}>

          <Form.Item label="Related issue" name="issueID">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea/>
          </Form.Item>

          <Form.Item  label="Technician" name="technician">
            <Select placeholder="Select a technician">
                {technicianSelectInModal}
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

          <Form.Item label="Category" name="category">
              <Select>
                <Option value="Engine">Engine</Option>
                <Option value="Propeller">Propeller</Option>
                <Option value="Hull">Hull</Option>
              </Select>
          </Form.Item>

            <Form.Item label="Planned" name="plannedFor">
              <DatePicker format={'DD/MM/YYYY'}/>
          </Form.Item>

        </Form>
    </Modal>
  );
}
