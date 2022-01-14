import React, { useState, useEffect } from "react";
import EditableTaskTable from "./Tasks";
import EquipmentButtons from "./EquipmentButtons";
import { Layout, Tabs, Button } from "antd";
import EditableEquipmentTable from "./Equipments";
import { AddEquipment } from "./AddEquipment";
import { AddTasks } from "./AddTasks";
import { Header } from "../_partials/header";
import "./pms.less";
import axios from "axios";

const taskUrl = "http://localhost:5000/task";
const equipmentUrl = "http://localhost:5000/equipment";
function PMS({ history, location, match }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [taskItems, setTaskItems] = useState(tasks);
  const [equipmentItems, setEquipmentItems] = useState(equipments);
  const [equipmentFormVisible, setEquipmentFormVisible] = useState(false);
  const [taskFormVisible, setTaskFormVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("Equipment");

  const fetchTasks = async () => {
    //deze functie vraagt de taken op van de API
    const response = await fetch(taskUrl);
    const newTasks = await response.json();
    setTasks(newTasks);
    setTaskItems(newTasks);
    setLoading(false);
  };
  const fetchEquipment = async () => {
    //deze functie vraagt al de equipment op van de API
    const response = await fetch(equipmentUrl);
    const newEquipments = await response.json();
    setEquipments(newEquipments);
    setEquipmentItems(newEquipments);
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

  const allCategoriesEquipment = [
    //Maakt knoppen van alle subcategorieeën, zowel bij Tasks als Equipment
    "All",
    ...new Set(equipments.map((equipment) => equipment.equipment_category)),
  ];
  const allSubCategoriesEquipment = [
    "All",
    ...new Set(equipments.map((equipment) => equipment.equipment_subcategory)),
  ];
  const allCategoriesTask = [
    "All",
    ...new Set(tasks.map((task) => task.Task_category)),
  ];
  const allSubCategoriesTask = [
    "All",
    ...new Set(tasks.map((task) => task.Task_subcategory)),
  ];

  const filterTasks = (equipment) => {
    //Deze functie zorgt ervoor dat alleen de taken worden weergegeven van de category of subcategory die is geselecteerd
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

  const removeItem = (id) => {
    //functie die het verwijderen regelt van zowel equipment als task
    if (activeKey === "Equipment") {
      axios
        .delete("http://localhost:5000/equipment/" + id)
        .then((res) => console.log(res.data));
      setEquipmentItems(equipmentItems.filter((item) => item._id !== id));
      setEquipments(equipments.filter((item) => item._id !== id));
    } else {
      axios
        .delete("http://localhost:5000/task/" + id)
        .then((res) => console.log(res.data));
      setTaskItems(taskItems.filter((item) => item._id !== id));
      setTasks(tasks.filter((item) => item._id !== id));
    }
  };

  const filterEquipments = (equipment) => {
    //Deze functie zorgt ervoor dat alleen de equipments worden weergegeven van de category of subcategory die is geselecteerd
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

  //Functie die ervoor zorgt dat als je op de Add knop drukt, je een formulier krijgt om de task of equipment toe te voegen
  const changeAddButton = () => {
    if (activeKey === "Equipment") {
      setEquipmentFormVisible(true);
    } else {
      setTaskFormVisible(true);
    }
  };

  // Functie die ervoor zorgt dat als je switcht van Tasks naar Equipment of andersom, dat de tekst op de Addknop meeveranderd.
  const tabbarButtons = {
    right: (
      <Button type="primary" onClick={changeAddButton}>
        Add {activeKey}
      </Button>
    ),
  };

  //Functie word uitgevoerd als op de knop word gedrukt aan het einde van het add equipment formulier. Equipmentformulier verdwijnt, en data word toegevoegd aan de database met behulp van de API
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
      equipment_certificate: values.certificate,
    };
    axios
      .post("http://localhost:5000/equipment/add", newEquipment)
      .then((res) => console.log(res.data));

    setEquipmentItems([...equipmentItems, newEquipment]);
    setEquipments([...equipments, newEquipment]);
  };

  //Functie word uitgevoerd als op de knop word gedrukt aan het einde van het add task formulier. Equipmentformulier verdwijnt, en data word toegevoegd aan de database met behulp van de API
  const onCreateTask = (values) => {
    setTaskFormVisible(false);
    const newTask = {
      Task_title: values.title,
      Task_equipment: values.equipment,
      Task_status: values.status,
      Task_description: values.description,
      Task_supplier: values.supplier,
      Task_category: values.category,
      Task_subcategory: values.subcategory,
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

    setTaskItems([...taskItems, newTask]);
    setTasks([...tasks, newTask]);
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
                    Categories={allCategoriesEquipment}
                    SubCategories={allSubCategoriesEquipment}
                    filterTasks={filterEquipments}
                  ></EquipmentButtons>
                  <EditableEquipmentTable
                    equipmentItems={equipmentItems}
                    removeItem={removeItem}
                    setEquipmentItems={setEquipmentItems}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Tasks</span>} key="Tasks">
                  <EquipmentButtons
                    Categories={allCategoriesTask}
                    SubCategories={allSubCategoriesTask}
                    filterTasks={filterTasks}
                  />
                  <EditableTaskTable
                    tasks={taskItems}
                    removeItem={removeItem}
                    setTaskItems={setTaskItems}
                  />
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
