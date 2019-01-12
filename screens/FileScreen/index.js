import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Storage } from 'aws-amplify';
import { ImagePicker, Permissions } from 'expo';
import { Buffer } from 'buffer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getS3List } from '../../redux/actions';
import styles from './styles';

class FilesScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  async componentDidMount() {
    this.props.getS3List();
  }

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      this._handleImagePicked(pickerResult);
    }
  };

  // this handles the image upload to S3
  _handleImagePicked = async (pickerResult) => {
    const imageName = pickerResult.uri.replace(/^.*[\\\/]/, '');
    const access = { level: "private", contentType: 'image/jpeg' };
    const imageData = await fetch(pickerResult.uri);
    const blobData = await imageData.blob();
    const encoded = URL.createObjectURL(blobData);
    const s3data = new Buffer(encoded, 'base64');

    try {
      await Storage.put(imageName, s3data, access);
      this.props.getS3List();
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async addFile() {
    const options = {
      mediaTypes: 'All',
      allowsEditing: true
    };

    const { uri } = await ImagePicker.launchImageLibraryAsync(options);
  }

  renderList() {
    return this.props.files.map(file => (
      <View key={file.key} style={styles.listItem}>
        <MaterialCommunityIcons name='file' size={32} color='grey' />
        <Text style={styles.filename}>{file.key}</Text>
        <Text>{`${Math.round(file.size / 1000)}kB`}</Text>
      </View>
    ));
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.renderList()}
        </ScrollView>
        <TouchableOpacity
          onPress={this._pickImage}
          style={styles.addFileBtn}
        >
          <MaterialCommunityIcons name='file-upload' size={32} color='blue' />
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    files: state.s3_objects
  }
}

export default connect(mapStateToProps, { getS3List })(FilesScreen);

