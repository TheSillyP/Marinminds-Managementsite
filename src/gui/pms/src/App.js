import React, { useState, useEffect } from "react";
import Tasks from "./Tasks";
import EquipmentButtons from "./EquipmentButtons";
import { Layout, Tabs } from "antd";
import Equipments from "./Equipments";
import { Header } from "../../_partials/header";
import "./pms.less";

const taskUrl = "http://localhost:5000/task";
const equipmentUrl = "http://localhost:5000/equipment";
function PMS({ history, location, match }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [taskItems, setTaskItems] = useState([tasks]);
  const [equipmentItems, setEquipmentItems] = useState([equipments]);

  const fetchTasks = async () => {
    const response = await fetch(taskUrl);
    const newTasks = await response.json();
    setTasks(newTasks);
    setLoading(false);
  };
  const fetchEquipment = async () => {
    const response = await fetch(equipmentUrl);
    const newEquipments = await response.json();
    setEquipments(newEquipments);
    setLoading(false);
  };
  useEffect(() => {
    fetchTasks();
    fetchEquipment();
  }, []);
  if (loading) {
    return (
      <section className="section loading">
        <h1>Loading...</h1>
      </section>
    );
  }

  const allEquipmentCategories = [
    "All",
    ...new Set(equipments.map((equipment) => equipment.equipment_category)),
  ];
  const allEquipmentSubCategories = [
    "All",
    ...new Set(equipments.map((equipment) => equipment.equipment_subcategory)),
  ];

  const filterTasks = (equipment) => {
    if (equipment === "All") {
      setTaskItems(tasks);
      return;
    }
    const newItems = tasks.filter(
      (task) =>
        task.Task_category === equipment || task.Task_subcategory === equipment
    );
    setTaskItems(newItems);
    console.log(newItems);
  };

  const filterEquipments = (equipment) => {
    if (equipment === "All") {
      setEquipmentItems(equipments);
      console.log(equipments);
      return;
    }
    const newItems = equipments.filter(
      (equipmentItem) =>
        equipmentItem.equipment_category === equipment ||
        equipmentItem.equipment_subcategory === equipment
    );
    setEquipmentItems(newItems);
    console.log(newItems);
  };

  return (
    <main>
      <section className="pms">
        <div className="pms pms--container">
          <Layout>
            <Header {...{ history, location, match }} />
            <Layout.Content className="pms pms--content">
              <Tabs>
                <Tabs.TabPane tab={<span>Equipment</span>} key="Equipment">
                  <EquipmentButtons
                    equipmentCategories={allEquipmentCategories}
                    equipmentSubCategories={allEquipmentSubCategories}
                    filterTasks={filterEquipments}
                  ></EquipmentButtons>
                  <Equipments equipments={equipmentItems} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Tasks</span>} key="Tasks">
                  <EquipmentButtons
                    equipmentCategories={allEquipmentCategories}
                    equipmentSubCategories={allEquipmentSubCategories}
                    filterTasks={filterTasks}
                  />
                  <Tasks tasks={taskItems} />
                </Tabs.TabPane>
              </Tabs>
            </Layout.Content>
          </Layout>
        </div>
      </section>
    </main>
  );
}

export default PMS;
