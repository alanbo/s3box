import { combineReducers } from 'redux';
import s3_objects from './s3-objects.js';

const root_reducer = combineReducers({
  s3_objects
});

export default root_reducer;