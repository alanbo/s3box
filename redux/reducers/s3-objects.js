import * as R from 'ramda';

import {
  get_s3_list,
  delete_objects,
  upload_file
} from '../actions/types';


function s3List(state = [], action) {

  switch (action.type) {
    case get_s3_list:
      return action.payload.map(file_object => R.assoc('lastModified', +(new Date(file_object.lastModified)), file_object));
    case delete_objects:
      return R.filter(file => !R.includes(file.key, action.payload), state);
    case upload_file:
      return R.append(action.payload, state);

    default:
      return state;
  }
}

export default s3List;