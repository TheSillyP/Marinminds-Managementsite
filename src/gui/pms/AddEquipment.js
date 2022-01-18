import React from "react";
import moment from "moment";
import { Form, Input, Upload, Button, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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
          rules={[{ required: true, message: "Please fill in a make!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Categorie"
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
          label="Equipment Certificate"
          name="certificate"
          style={{ width: 700 }}
        >
          <Upload>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          ,
        </Form.Item>
      </Form>
    </Modal>
  );
};
