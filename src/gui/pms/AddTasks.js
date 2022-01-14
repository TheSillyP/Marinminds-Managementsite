import React from "react";
import moment from "moment";
import { Form, Input, Modal, Select, InputNumber } from "antd";
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 28 },
};

export const AddTasks = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
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
            console.log("Validate Failed:", info);
          });
      }}
      onCancel={onCancel}
      okText="Create task"
    >
      <Form
        {...layout}
        name="addtask"
        form={form}
        initialValues={{
          modifier: "public",
          state: "Open",
          deadline: moment(),
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please fill in a title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Equipment"
          name="equipment"
          rules={[
            {
              required: true,
              message: "Please fill in the equipment where this task is for!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please fill in a status!" }]}
        >
          <Select>
            <Option value="Upcoming">Upcoming</Option>
            <Option value="Near Due">Near Due</Option>
            <Option value="Overdue">Overdue</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please fill in category!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Subcategory"
          name="subcategory"
          rules={[{ required: true, message: "Please fill in subcategory!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please fill in type!" }]}
        >
          <Select>
            <Option value="Maintenance">Maintenance</Option>
            <Option value="Inspection">Inspection</Option>
            <Option value="Refit">Refit</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Frequency type"
          name="frequency_type"
          rules={[
            { required: true, message: "Please fill in frequency type!" },
          ]}
        >
          <Select>
            <Option value="Time">Time</Option>
            <Option value="Usage">Usage</Option>
            <Option value="Time and usage">Time and usage</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Interval usage in hours"
          name="interval_usage"
          rules={[
            { required: true, message: "Please fill in interval usage!" },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Interval time in days"
          name="interval_time"
          rules={[
            { required: true, message: "Please fill in a interval time!" },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};
