import * as api from '../api';

//actions creators
export const getAllIssues = () => async(dispatch) => {
    try {
        const {data} = await api.fetchAllIssues();

        dispatch({ type: 'FETCH_ALLISSUES', payload : data});
    } catch (error) {
        console.log(error);
    }
}

export const getIssueOnID = (id) => async(dispatch) => {
    try {
        const {data} = await api.fetchIssueOnID(id);

        dispatch({ type: 'FETCH_ISSUEONID', payload : data});
    } catch (error) {
        console.log(error);
    }
}

export const updateCommentOnIssue = (id, comment) => async(dispatch) => {
    try {
        const {data} = await api.updateCommentOnIssue(id, comment);

        dispatch({ type: 'UPDATE_COMMENTISSUE', payload : data});
    } catch (error) {
        console.log(error);
    }
}

export const createIssue = (newIssue) => async(dispatch) =>{
    try {
        const {data} = await api.createIssue(newIssue);

        dispatch({ type: 'CREATE_ISSUE', payload : data});

 
    } catch (error) {
        console.log(error);
    }
}

export const deleteIssue = (id) => async(dispatch) => {
    try {
        await api.deleteIssue(id);

        dispatch({ type: 'DELETE_ISSUE', payload : id});
    } catch (error) {
        console.log(error);
    }
}

export const editIssue = (id, issue) => async(dispatch) =>{
    try {
        const {data} = await api.editIssue(id, issue);

        dispatch({ type: 'EDIT_ISSUE', payload : data});
    } catch (error) {
        console.log(error);
    }
}