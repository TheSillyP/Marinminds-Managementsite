import React from "react";
import { Table } from "ant-table-extensions";

const Tasks = ({ tasks }) => {
  return (
    <div>
      <Table
        columns={[
          { dataIndex: "Task_title", title: "Title" },
          { dataIndex: "Task_equipment", title: "Equipment" },
          { dataIndex: "Task_status", title: "Status" },
          { dataIndex: "Task_description", title: "Description" },
          { dataIndex: "Task_supplier", title: "Supplier" },
          { dataIndex: "Task_type", title: "Type" },
          { dataIndex: "Task_frequency_type", title: "Frequency Type" },
          { dataIndex: "Task_interval_usage", title: "Interval Usage" },
          { dataIndex: "Task_interval_time", title: "Interval Time" },
          { dataIndex: "Task_due_in_hours", title: "Due in Hours" },
          {
            dataIndex: "Task_last_done_usage",
            title: "Usage hours at last maintenance",
          },
          {
            dataIndex: "Task_last_done_time",
            title: "Date at last maintenance",
          },
          {
            dataIndex: "Task_next_done_usage",
            title:
              "On which amount of usage hours next maintenance is required",
          },
        ]}
        dataSource={tasks}
      ></Table>
    </div>
  );
};

export default Tasks;
