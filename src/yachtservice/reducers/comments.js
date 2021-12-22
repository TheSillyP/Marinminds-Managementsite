export default (state = [], action) => { 
    switch (action.type) {
        case 'FETCH_RELATEDCOMMENTS':
            return action.payload;

        case 'FETCH_COMMENTS':
            return action.payload;

        case 'CREATE_COMMENT':
            return [...state, action.payload];
    
        default:
            return state;
    }
}