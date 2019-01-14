import { Storage } from 'aws-amplify';
import * as R from 'ramda';

import {
  get_s3_list,
  delete_objects
} from './types';

export const getS3List = () => dispatch => {
  const path = '';
  const access = { level: 'private' };

  Storage.list(path, access)
    .then(result => {
      dispatch({
        type: get_s3_list,
        payload: result
      });
    })
    .catch(console.log);
}

export const deleteObjects = paths => dispatch => {
  const access = { level: 'private' };
  const failed = [];

  Promise.all(paths.map(path => {
    Storage.remove(path, access)
      .catch(() => failed.push(path));
  }))
    .then(() => {
      dispatch({
        type: delete_objects,
        payload: paths
      });
    })
    .catch(err => {
      dispatch({
        type: delete_objects,
        payload: R.without(failed, paths)
      });

      console.log(err);
    });
}