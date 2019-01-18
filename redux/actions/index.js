import { Storage } from 'aws-amplify';
import * as R from 'ramda';

import {
  get_s3_list,
  delete_objects,
  upload_file
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

export const uploadFile = (uri, path) => async dispatch => {
  const access = { level: "private", contentType: 'image/jpeg' };

  // https://github.com/expo/expo/issues/2402
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed')); // error occurred, rejecting
    };
    xhr.responseType = 'blob'; // use BlobModule's UriHandler
    xhr.open('GET', uri, true); // fetch the blob from uri in async mode
    xhr.send(null); // no initial data
  });

  const imageName = path + uri.replace(/^.*[\\\/]/, '');

  try {
    let uploaded = await Storage.put(imageName, blob, access);
    uploaded = R.assoc('size', blob.size, uploaded);
    blob.close();

    dispatch({
      type: upload_file,
      payload: R.assoc('lastModified', +(new Date()), uploaded)
    })
  } catch (err) {
    console.log('error: ', err)
  }
}