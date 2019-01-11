import { Storage } from 'aws-amplify';
import { get_s3_list } from './types';

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