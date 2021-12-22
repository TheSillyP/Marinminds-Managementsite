export default (state = [], action) => { 
    switch (action.type) {
        case 'FETCH_TASKS':
            return action.payload;

        case 'FETCH_RELATEDTASKS':
            return action.payload;

        case 'UPDATE_COMMENTTASK':
            return action.payload;

        case 'CREATE_TASK':
            return [...state, action.payload];

        case 'DELETE_TASK':
            return state.filter((task) => task._id !== action.payload).reverse();

        case 'EDIT_TASK':
            return state.map((task) => task._id === action.payload._id ? action.payload : task);
    
        default:
            return state;
    }
}