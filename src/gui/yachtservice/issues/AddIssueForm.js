import React from 'react';
import moment from 'moment';
import {Form, Input, Select, DatePicker, Modal} from 'antd';

import { useMst } from '../../../data'

const { Option } = Select;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 22 },
  };


export const AddIssue = ({ visible, onCreate, onCancel }) => {
  const { yachts } = useMst();

  const yachtSelectInModal =  yachts.yachts.map((yacht) => (
    <Select.Option key={yacht.id} value={yacht.name}> {yacht.name} </Select.Option>
  ))

  const [form] = Form.useForm();

    return(
      <Modal 
      title="Add issue" 
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
      okText="Create issue">

            <Form 
            {...layout} 
            name="addissue" 
            form={form}
            initialValues={{
              modifier: 'public',
              'state':"Open",
              'deadline': moment()
            }}>

              <Form.Item label="Title" name="title" 
              rules={[{ required: true, message: 'Please input a title!'}]}>
                <Input />
              </Form.Item>

              <Form.Item label="Description" name="description"
              rules={[{ required: true, message: 'Please input a description!'}]}>
              <Input.TextArea />
              </Form.Item>

              <Form.Item label="Comment" name="comment">
              <Input.TextArea />
              </Form.Item>

              <Form.Item label="Category" name="category"
              rules={[{ required: true, message: 'Please input a category!'}]}>
                  <Select placeholder="Select a category">
                    <Option value="Engine">Engine</Option>
                    <Option value="Propeller">Propeller</Option>
                    <Option value="Hull">Hull</Option>
                  </Select>
                </Form.Item>
                

                <Form.Item label="Yacht" name="yacht"
                rules={[{ required: true, message: 'Please input a yacht!'}]}>
                  <Select placeholder="Select a yacht">
                    {yachtSelectInModal}
                  </Select>
                </Form.Item>

                <Form.Item label="Priority" name="priority"
                rules={[{ required: true, message: 'Please input a priority!'}]}>
                  <Select placeholder="Select a priority">
                    <Option value="Urgent">Urgent</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
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

                <Form.Item  label="Deadline" name="deadline"
                rules={[{ required: true, message: 'Please input a deadline!'}]}>
                <DatePicker format={'DD/MM/YYYY'}/>
              </Form.Item>
              

            </Form>
          </Modal>

    );
}
