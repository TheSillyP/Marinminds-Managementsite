import React from 'react';
import moment from 'moment';
import {Form, Input, Select, DatePicker, Modal} from 'antd';

import { useMst } from '../../../data'

const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

export const AddTask = ({ visible, onCreate, onCancel, selectIssues}) => {
    const { users } = useMst();

    const technicianSelectInModal =  users.users.map((user) => (
        <Select.Option key={user.id} value={user.email}> {user.email} </Select.Option>
    ))

    const [form] = Form.useForm();
    
    return(
        <Modal 
        title="Add task" 
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
        onCancel={onCancel}
        okText="Create task">

            <Form 
            {...layout} 
            name="addtask"
            form={form}
            initialValues={{
              modifier: 'public',
              'state':"Open",
              'plannedFor': moment()
            }}>

                <Form.Item label="Set related issue" name="issueID"
                rules={[{ required: true, message: 'Please input a title!'}]}>
                    <Select placeholder="Select a issue" >
                        {selectIssues}
                    </Select>
                </Form.Item>

                <Form.Item label="Title" name="title"
                rules={[{ required: true, message: 'Please input a title!'}]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="description"
                rules={[{ required: true, message: 'Please input a description!'}]}>
                    <Input.TextArea />
                </Form.Item>

                <Form.Item  label="Technician" name="technician"
                rules={[{ required: true, message: 'Please input a technician!'}]}>
                    <Select placeholder="Select a technician">
                        {technicianSelectInModal}
                    </Select>
                </Form.Item>

                <Form.Item label="State" name="state"
                rules={[{ required: true, message: 'Please input a state!'}]}>
                  <Select placeholder="Select a state" >
                    <Option value="Open">Open</Option>
                    <Option value="Closed">Closed</Option>
                    <Option value="In progress">In progress</Option>
                    <Option value="Resolved">Resolved</Option>
                    <Option value="In review">In review</Option>
                    <Option value="Postponed">PostPoned</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Category" name="category"
                rules={[{ required: true, message: 'Please input a category!'}]}>
                    <Select placeholder="Select a category">
                        <Option value="Engine">Engine</Option>
                        <Option value="Propeller">Propeller</Option>
                        <Option value="Hull">Hull</Option>
                    </Select>
                </Form.Item>
  

                <Form.Item label="Comment" name="comment">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="Planned" name="plannedFor"
                    rules={[{ required: true, message: 'Please input a date!'}]}>
                    <DatePicker format={'DD/MM/YYYY'}/>
                </Form.Item>

            </Form>
        </Modal>

    );
}