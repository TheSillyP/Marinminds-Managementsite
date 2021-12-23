import React, { useState, useEffect } from "react";
import Tasks from "./Tasks";
import EquipmentButtons from "./EquipmentButtons";
import { Layout, Tabs, Button } from "antd";
import Equipments from "./Equipments";
import { AddEquipment } from "./AddEquipment";
import { AddTasks } from "./AddTasks";
import { Header } from "../../_partials/header";
import "./pms.less";
import axios from "axios";

const taskUrl = "http://localhost:5000/task";
const equipmentUrl = "http://localhost:5000/equipment";
function PMS({ history, location, match }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [taskItems, setTaskItems] = useState([tasks]);
  const [equipmentItems, setEquipmentItems] = useState([equipments]);
  const [equipmentFormVisible, setEquipmentFormVisible] = useState(false);
  const [taskFormVisible, setTaskFormVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("Equipment");

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

  const changeAddButton = () => {
    if (activeKey === "Equipment") {
      setEquipmentFormVisible(true);
    } else {
      setTaskFormVisible(true);
    }
  };

  const tabbarButtons = {
    right: (
      <Button type="primary" onClick={changeAddButton}>
        Add {activeKey}
      </Button>
    ),
  };

  const onCreateEquipment = (values) => {
    setEquipmentFormVisible(false);
    const newEquipment = {
      equipment_name: values.name,
      equipment_supplier: values.supplier,
      equipment_make: values.make,
      equipment_category: values.category,
      equipment_subcategory: values.subcategory,
      equipment_model: values.model,
      equipment_partnumber: values.partnumber,
      equipment_usage_hrs: values.usage_hrs,
    };

    axios
      .post("http://localhost:5000/equipment/add", newEquipment)
      .then((res) => console.log(res.data));

    window.location.reload();
  };

  const onCreateTask = (values) => {
    setEquipmentFormVisible(false);
    const newTask = {
      Task_title: values.title,
      Task_equipment: values.equipment,
      Task_status: values.status,
      Task_description: values.description,
      Task_supplier: values.supplier,
      Task_type: values.type,
      Task_frequency_type: values.frequency_type,
      Task_interval_usage: values.interval_usage,
      Task_interval_time: values.interval_time,
      Task_due_in_hours: values.due_in_hours,
      Task_due_in_days: values.due_in_days,
      Task_last_done_usage: values.last_done_usage,
      Task_last_done_time: values.last_done_time,
      Task_next_done_usage: values.next_done_usage,
    };

    axios
      .post("http://localhost:5000/task/add", newTask)
      .then((res) => console.log(res.data));

    window.location.reload();
  };

  return (
    <main>
      <section className="pms">
        <div className="pms pms--container">
          <Layout>
            <Header {...{ history, location, match }} />
            <Layout.Content className="pms pms--content">
              <Tabs
                activeKey={activeKey}
                onChange={setActiveKey}
                tabBarExtraContent={tabbarButtons}
              >
                <AddEquipment
                  visible={equipmentFormVisible}
                  onCreate={onCreateEquipment}
                  onCancel={() => {
                    setEquipmentFormVisible(false);
                  }}
                />
                <AddTasks
                  visible={taskFormVisible}
                  onCreate={onCreateTask}
                  onCancel={() => {
                    setTaskFormVisible(false);
                  }}
                ></AddTasks>
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
