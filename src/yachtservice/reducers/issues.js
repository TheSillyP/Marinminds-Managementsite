export default (state = [], action) => { 
    switch (action.type) {
        case 'FETCH_ALLISSUES':
            return action.payload;

        case 'FETCH_ISSUEONID':
            return action.payload;

        case 'UPDATE_COMMENTISSSUE':
            return action.payload;

        case 'CREATE_ISSUE':
            return [...state, action.payload];

        case 'DELETE_ISSUE':
            return state.filter((issue) => issue._id !== action.payload).reverse();

        case 'EDIT_ISSUE':
            return state.map((issue) => issue._id === action.payload._id ? action.payload : issue);
    
        default:
            return state;
    }
}