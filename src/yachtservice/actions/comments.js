import * as api from '../api';

//actions creators
export const getRelatedComments = (id) => async(dispatch) => {
    try {
        const {data} = await api.fetchRelatedComments(id);

        dispatch({ type: 'FETCH_RELATEDCOMMENTS', payload : data});
    } catch (error) {
        console.log(error.message);
    }
}

export const getAllComments = () => async(dispatch) => {
    try {
        const {data} = await api.fetchAllComments();

        dispatch({ type: 'FETCH_COMMENTS', payload : data});
    } catch (error) {
        console.log(error.message);
    }
}

export const createComment = (newComment) => async(dispatch) =>{
    try {
        const {data} = await api.createComment(newComment);

        dispatch({ type: 'CREATE_COMMENT', payload : data});
    } catch (error) {
        console.log(error.message);
    }
}