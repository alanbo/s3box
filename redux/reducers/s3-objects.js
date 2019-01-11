import * as R from 'ramda';

import {
  get_s3_list,
} from '../actions/types';


function s3List(state = [], action) {

  switch (action.type) {
    case get_s3_list:
      return action.payload
    default:
      return state
  }
}

export default s3List;