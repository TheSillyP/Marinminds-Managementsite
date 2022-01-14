import React, { useState } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Space,
  Button,
} from "antd";
import axios from "axios";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableEquipmentTable = ({
  equipmentItems,
  removeItem,
  setEquipmentItems,
}) => {
  const [form] = Form.useForm();
  const [editingID, setEditingID] = useState("");

  const isEditing = (record) => record._id === editingID;

  const edit = (record) => {
    form.setFieldsValue({
      equipment_name: "",
      equipment_supplier: "",
      equipment_make: "",
      equipment_model: "",
      equipment_partnumber: "",
      equipment_usagehours: "",
      ...record,
    });
    setEditingID(record._id);
  };

  const cancel = () => {
    setEditingID("");
  };

  const save = async (id) => {
    const row = await form.validateFields();
    const index = equipmentItems.findIndex((item) => id === item._id);
    if (index > -1) {
      const item = equipmentItems[index];
      equipmentItems.splice(index, 1, { ...item, ...row });
      setEquipmentItems([...equipmentItems]);
      setEditingID("");
    } else {
      equipmentItems.push(row);
      equipmentItems([...equipmentItems]);
      setEditingID("");
    }
    axios
      .post("http://localhost:5000/equipment/update/" + id, row)
      .then((res) => console.log(res.data));
    setEditingID("");
    setEquipmentItems([...equipmentItems]);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "equipment_name",
      sorter: (a, b) => a.equipment_name.localeCompare(b.equipment_name),
      editable: true,
    },
    {
      title: "Supplier",
      dataIndex: "equipment_supplier",
      sorter: (a, b) =>
        a.equipment_supplier.localeCompare(b.equipment_supplier),
      editable: true,
    },
    {
      title: "Make",
      dataIndex: "equipment_make",
      sorter: (a, b) => a.equipment_make.localeCompare(b.equipment_make),
      editable: true,
    },
    {
      title: "Category",
      dataIndex: "equipment_category",
      sorter: (a, b) =>
        a.equipment_category.localeCompare(b.equipment_category),
      editable: true,
    },
    {
      title: "Subcategory",
      dataIndex: "equipment_subcategory",
      sorter: (a, b) =>
        a.equipment_subcategory.localeCompare(b.equipment_subcategory),
      editable: true,
    },
    {
      title: "Model",
      dataIndex: "equipment_model",
      sorter: (a, b) => a.equipment_model.localeCompare(b.equipment_model),
      editable: true,
    },
    {
      title: "Partnumber",
      dataIndex: "equipment_partnumber",
      sorter: (a, b) =>
        a.equipment_partnumber.localeCompare(b.equipment_partnumber),
      editable: true,
    },
    {
      title: "Usage hours",
      dataIndex: "equipment_usage_hrs",
      sorter: (a, b) => a.equipment_usage_hrs - b.equipment_usage_hrs,
      editable: true,
    },
    {
      title: "Edit",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingID !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: "Delete",
      render: (record) => (
        <Space size="middle">
          <Button onClick={() => removeItem(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={equipmentItems}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableEquipmentTable;
