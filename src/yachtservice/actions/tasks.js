import * as api from '../api';

//actions creators
export const getAllTasks = () => async(dispatch) => {
    try {
        const {data} = await api.fetchAllTasks();

        dispatch({ type: 'FETCH_TASKS', payload : data});
    } catch (error) {
        console.log(error.message);
    }
}

export const getRelatedTasks = (id) => async(dispatch) => {
    try {
        const {data} = await api.fetchRelatedTasks(id);

        dispatch({ type: 'FETCH_RELATEDTASKS', payload : data});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateCommentOnTask = (id, comment) => async(dispatch) => {
    try {
        const {data} = await api.updateCommentOnTask(id, comment);

        dispatch({ type: 'UPDATE_COMMENTTASK', payload : data});
    } catch (error) {
        console.log(error.message);
    }
}

export const createTask = (newTask) => async(dispatch) =>{
    try {
        const {data} = await api.createTask(newTask);

        dispatch({ type: 'CREATE_TASK', payload : data});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteTask = (id) => async(dispatch) => {
    try {
        await api.deleteTask(id);

        dispatch({ type: 'DELETE_TASK', payload : id});
    } catch (error) {
        console.log(error.message);
    }
}

export const editTask = (id, task) => async(dispatch) =>{
    try {
        const {data} = await api.editTask(id, task);

        dispatch({ type: 'EDIT_TASK', payload : data});

 
    } catch (error) {
        console.log(error);
    }
}