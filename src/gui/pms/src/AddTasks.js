import React from "react";
import moment from "moment";
import { Form, Input, Modal } from "antd";

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
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please fill in a description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Supplier"
          name="supplier"
          rules={[{ required: true, message: "Please fill in supllier!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please fill in type!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Frequency type"
          name="frequency_type"
          rules={[
            { required: true, message: "Please fill in frequency type!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Interval usage"
          name="interval_usage"
          rules={[
            { required: true, message: "Please fill in interval usage!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Interval time"
          name="interval_time"
          rules={[
            { required: true, message: "Please fill in a interval time!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Due in hours"
          name="due_in_hours"
          rules={[{ required: true, message: "Please fill in due in hours!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Due in days"
          name="due_in_days"
          rules={[{ required: true, message: "Please fill in due in days!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last done usage"
          name="last_done_usage"
          rules={[
            { required: true, message: "Please fill in last done usage!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last done time"
          name="last_done_time"
          rules={[{ required: true, message: "Please fill in last done time" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Next done usage"
          name="next_done_time"
          rules={[{ required: true, message: "Please fill in usage" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
