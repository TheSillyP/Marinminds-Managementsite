import React from "react";
import { Table } from "ant-table-extensions";

const Equipments = ({ equipments }) => {
  return (
    <div>
      <Table
        columns={[
          { dataIndex: "equipment_name", title: "Equipment Name" },
          { dataIndex: "equipment_supplier", title: "Supplier" },
          { dataIndex: "equipment_make", title: "Make" },
          { dataIndex: "equipment_category", title: "Category" },
          { dataIndex: "equipment_subcategory", title: "Subcategory" },
          { dataIndex: "equipment_model", title: "Model" },
          { dataIndex: "equipment_partnumber", title: "Part Number" },
          { dataIndex: "equipment_usage_hrs", title: "Usage Hours" },
        ]}
        dataSource={equipments}
      ></Table>
    </div>
  );
};

export default Equipments;
