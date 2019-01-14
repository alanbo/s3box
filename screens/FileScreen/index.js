import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Platform, AlertIOS, Animated } from 'react-native';
import { Storage } from 'aws-amplify';
import { ImagePicker, Permissions, GestureHandler } from 'expo';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Buffer } from 'buffer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getS3List } from '../../redux/actions';
import styles from './styles';
import * as R from 'ramda';

class FilesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `files/${navigation.getParam('path') || ''}` || 'files/',
      headerBackTitle: null
    };
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
    const access = { level: "private", contentType: 'image/jpeg' };
    const imageData = await fetch(pickerResult.uri);
    const blobData = await imageData.blob();
    const encoded = URL.createObjectURL(blobData);
    const s3data = new Buffer(encoded, 'base64');
    const path = this.props.navigation.getParam('path') || '';
    const imageName = path + pickerResult.uri.replace(/^.*[\\\/]/, '');

    try {
      await Storage.put(imageName, s3data, access);
      this.props.getS3List();
    } catch (err) {
      console.log('error: ', err)
    }
  }

  renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <View style={styles.editDeleteContainer}>
        <RectButton onPress={this.close} style={[styles.swippedEdit, styles.swippedButtons]}>
          <MaterialCommunityIcons name='square-edit-outline' size={22} color='white' />
        </RectButton>

        <RectButton onPress={this.close} style={[styles.swippedDelete, styles.swippedButtons]}>
          <MaterialCommunityIcons name='delete' size={22} color='white' />
        </RectButton>
      </View>
    );
  };

  renderList() {
    const path = this.props.navigation.getParam('path') || '';

    return this.props.files
      .filter(file => R.startsWith(path, file.key))
      .filter(file => file.key !== path)
      .map(file => {
        const is_folder = R.endsWith('/', file.key);

        const name_arr = file.key.split('/');

        const name = name_arr[is_folder ? name_arr.length - 2 : name_arr.length - 1];

        return (
          <Swipeable
            key={file.key}
            renderRightActions={this.renderRightActions}>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => this.onItemClick(file.key, is_folder)}
            >
              {
                is_folder
                  ? <MaterialCommunityIcons name='folder' size={32} color='grey' />
                  : <MaterialCommunityIcons name='file' size={32} color='grey' />
              }
              <Text style={styles.filename}>{name}</Text>
              <Text>{`${Math.round(file.size / 1000)}kB`}</Text>
            </TouchableOpacity>
          </Swipeable>
        )
      });
  }

  onItemClick(path, is_folder) {
    if (is_folder) {
      this.props.navigation.push('Files', { path });
    } else {
      console.log(path);
    }
  }

  addFolder = async () => {
    const access = { level: "private" };
    const path = this.props.navigation.getParam('path') || '';
    name = 'new_folder';

    if (Platform.OS === 'ios') {
      AlertIOS.prompt(
        'Add Folder',
        'Enter folder name',
        [
          {
            text: 'Cancel',
            // onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async name => {
              await Storage.put(`${path}${name}/`, '', access);
              this.props.getS3List();
            }
          },
        ]
      );

    } else {
      await Storage.put(`${path}${name}/`, '', access);
      this.props.getS3List();
    }


  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.renderList()}
        </ScrollView>
        <View style={styles.toolboxContainer}>
          <TouchableOpacity
            onPress={this._pickImage}
            style={styles.addFileBtn}
          >
            <MaterialCommunityIcons name='file-upload' size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.addFolder}
            style={styles.addFileBtn}
          >
            <MaterialCommunityIcons name='folder-plus' size={32} />
          </TouchableOpacity>
        </View>
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

