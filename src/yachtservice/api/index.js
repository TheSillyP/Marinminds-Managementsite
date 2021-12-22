import axios from 'axios';

const url = 'http://192.168.0.114:5000/';

//get all issues
export const fetchAllIssues = () => axios.get(url + "issues/");

//get related issue
export const fetchIssueOnID = (id) => axios.get(url + "issues/" + id);

//create new issue
export const createIssue = (newIssue) => axios.post(url + "issues", newIssue);

//delete Task
export const deleteIssue = (id) => axios.delete(url + "issues/" + id);

export const editIssue = (id ,editedIssue) => axios.patch(url + "issues/" + id, editedIssue);


//get all tasks
export const fetchAllTasks = () => axios.get(url + "tasks");

//get related tasks
export const fetchRelatedTasks = (id) => axios.get(url + "tasks/" + id);

//create new task
export const createTask = (newTask) => axios.post(url + "tasks", newTask);

//delete Task
export const deleteTask = (id) => axios.delete(url + "tasks/" + id);

export const editTask = (id ,editedTask) => axios.patch(url + "tasks/" + id, editedTask);


//get all comments
export const fetchAllComments = () => axios.get(url + "comments");

//create new comment
export const createComment = (newComment) => axios.post(url + "comments", newComment);

//get related comments
export const fetchRelatedComments = (id) => axios.get(url + "comments/" + id);

//update comment on issue
export const updateCommentOnIssue = (id, comment) => axios.get(url + "issues/" + id + "/" + comment);

//update comment on task
export const updateCommentOnTask = (id, comment) => axios.get(url + "tasks/" + id + "/" + comment);