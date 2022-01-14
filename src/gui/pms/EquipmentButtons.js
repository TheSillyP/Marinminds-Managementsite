import React from "react";
import { Button } from "antd";

const EquipmentButtons = ({ Categories, SubCategories, filterTasks }) => {
  return (
    <div>
      <h2>Filter on category</h2>
      {Categories.map((category, index) => {
        return (
          <Button
            className="button-42"
            type="button"
            key={index}
            onClick={() => filterTasks(category)}
          >
            {category}
          </Button>
        );
      })}
      <h2>Filter on subcategory</h2>
      {SubCategories.map((subcategory, index) => {
        return (
          <Button
            className="button-42"
            type="button"
            key={index}
            onClick={() => filterTasks(subcategory)}
          >
            {subcategory}
          </Button>
        );
      })}
    </div>
  );
};

export default EquipmentButtons;
