import React from "react";
import moment from "moment";
import { Form, Input, Modal } from "antd";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 22 },
};

export const AddEquipment = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add equipment"
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
      okText="Create equipment"
    >
      <Form
        {...layout}
        name="addequipment"
        form={form}
        initialValues={{
          modifier: "public",
          state: "Open",
          deadline: moment(),
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please fill in a title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Supplier"
          name="supplier"
          rules={[{ required: true, message: "Please fill in a supplier!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Make"
          name="make"
          rules={[{ required: true, message: "Please fill in a title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please fill in a category!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Subcategory"
          name="subcategory"
          rules={[{ required: true, message: "Please fill in a subcategory!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Model"
          name="model"
          rules={[{ required: true, message: "Please fill in a model!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Partnumber"
          name="partnumber"
          rules={[{ required: true, message: "Please fill in a partnumber!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Usage Hours"
          name="usage_hrs"
          rules={[
            {
              required: true,
              message: "Please fill in the amount of usage hours!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
