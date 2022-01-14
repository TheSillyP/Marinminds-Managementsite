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

const EditableTaskTable = ({ tasks, removeItem, setTaskItems }) => {
  const [form] = Form.useForm();
  const [editingID, setEditingID] = useState("");

  const isEditing = (record) => record._id === editingID;

  const edit = (record) => {
    form.setFieldsValue({
      Task_title: "Task_title",
      Task_equipment: "Task_equipment",
      Task_status: "Task_status",
      Task_category: "Task_category",
      Task_subcategory: "Task_subcategory",
      Task_description: "Task_description",
      Task_supplier: "Task_supplier",
      Task_type: "Task_type",
      Task_frequency_type: "Task_frequency_type",
      Task_interval_usage: "Task_interval_usage",
      Task_interval_time: "Task_interval_time",
      Task_due_in_hours: "Task_due_in_hours",
      Task_last_done_usage: "Task_last_done_usage",
      Task_last_done_time: "Task_last_done_time",
      Task_next_done_usage: "Task_next_done_usage",
      ...record,
    });
    setEditingID(record._id);
  };

  const cancel = () => {
    setEditingID("");
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const index = tasks.findIndex((item) => id === item._id);
      console.log(row);

      if (index > -1) {
        const item = tasks[index];
        tasks.splice(index, 1, { ...item, ...row });
        setTaskItems([...tasks]);
        setEditingID("");
      } else {
        tasks.push(row);
        setTaskItems([...tasks]);
        setEditingID("");
      }
      axios
        .post("http://localhost:5000/task/update/" + id, row)
        .then((res) => console.log(res.data));
    } catch (errInfo) {
      console.log("Validate Failes:", errInfo);
    }
  };

  const columns = [
    {
      title: "Title",
      width: 100,
      dataIndex: "Task_title",
      sorter: (a, b) => a.Task_title.localeCompare(b.Task_title),
      editable: true,
    },
    {
      title: "Equipment",
      width: 100,
      dataIndex: "Task_equipment",
      sorter: (a, b) => a.Task_equipment.localeCompare(b.Task_equipment),
      editable: true,
    },
    {
      title: "Status",
      width: 100,
      dataIndex: "Task_status",
      sorter: (a, b) => a.Task_status.localeCompare(b.Task_status),
      editable: true,
    },
    {
      title: "Category",
      width: 100,
      dataIndex: "Task_category",
      sorter: (a, b) => a.Task_category.localeCompare(b.Task_category),
      editable: true,
    },
    {
      title: "Subcategory",
      width: 100,
      dataIndex: "Task_subcategory",
      sorter: (a, b) => a.Task_subcategory.localeCompare(b.Task_subcategory),
      editable: true,
    },
    {
      title: "Type",
      width: 100,
      dataIndex: "Task_type",
      sorter: (a, b) => a.Task_type.localeCompare(b.Task_type),
      editable: true,
    },
    {
      title: "Frequency type",
      width: 100,
      dataIndex: "Task_frequency_type",
      sorter: (a, b) =>
        a.Task_frequency_type.localeCompare(b.Task_frequency_type),
      editable: true,
    },
    {
      title: "Interval usage in hours",
      width: 100,
      dataIndex: "Task_interval_usage",
      sorter: (a, b) => a.Task_interval_usage - b.Task_interval_usage,
      editable: true,
    },
    {
      title: "Interval time in days",
      width: 100,
      dataIndex: "Task_interval_time",
      sorter: (a, b) => a.Task_interval_time - b.Task_interval_time,
      editable: true,
    },
    {
      title: "Edit",
      width: 100,
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
      width: 100,
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
        dataSource={tasks}
        columns={mergedColumns}
        scroll={{ x: 1400 }}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTaskTable;
