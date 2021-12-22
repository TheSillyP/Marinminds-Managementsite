import { combineReducers } from 'redux';

import issues from './issues.js';
import comments from './comments';
import tasks from './tasks';

export default combineReducers({ issues , comments, tasks});