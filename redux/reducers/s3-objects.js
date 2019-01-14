import * as R from 'ramda';

import {
  get_s3_list,
  delete_objects
} from '../actions/types';


function s3List(state = [], action) {

  switch (action.type) {
    case get_s3_list:
      return action.payload;
    case delete_objects:
      return R.filter(file => !R.includes(file.key, action.payload), state);

    default:
      return state;
  }
}

export default s3List;