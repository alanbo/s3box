import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Platform, Alert, AlertIOS, Animated } from 'react-native';
import { Storage } from 'aws-amplify';
import { ImagePicker, Permissions, GestureHandler } from 'expo';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getS3List, deleteObjects, uploadFile } from '../../redux/actions';
import EditModal from '../../components/EditModal';
import styles from './styles';
import * as R from 'ramda';


class FilesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `files/${navigation.getParam('path') || ''}` || 'files/',
      headerBackTitle: null
    };
  };

  state = {
    highlighted: {},
    modalVisible: false,
  }

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
  _handleImagePicked = ({ uri }) => {
    const path = this.props.navigation.getParam('path') || '';

    this.props.uploadFile(uri, path);
  }

  clearSelection = () => {
    this.setState({
      highlighted: {}
    });
  }

  renderRightActions = key => {
    return (
      <View style={styles.editDeleteContainer}>
        <RectButton
          onPress={() => this.setState({ modalVisible: key })}
          style={[styles.swippedEdit, styles.swippedButtons]}
        >
          <MaterialCommunityIcons name='square-edit-outline' size={22} color='white' />
        </RectButton>

        <RectButton
          onPress={() => this.props.deleteObjects([key])}
          style={[styles.swippedDelete, styles.swippedButtons]}
        >
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

        let size_string = '';

        if (file.size >= 1048576) {
          size_string = `${Math.round(file.size / 1048576)}MB`;
        } else if (file.size >= 1024) {
          size_string = `${Math.round(file.size / 1024)}kB`;
        } else if (!is_folder) {
          size_string = `${file.size}B`;
        }

        const longPressRef = React.createRef();
        const swipeRef = React.createRef();
        const is_highlighted = !!this.state.highlighted[file.key];

        return (
          <GestureHandler.LongPressGestureHandler
            key={file.key}
            ref={longPressRef}
            simultaneousHandlers={swipeRef}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.oldState) {
                return;
              }

              if (is_highlighted) {
                this.setState({
                  highlighted: R.dissoc(file.key, this.state.highlighted)
                })
              } else {
                this.setState({
                  highlighted: R.assoc(file.key, true, this.state.highlighted)
                })
              }
            }}
            minDurationMs={800}>
            <View>
              <Swipeable
                ref={swipeRef}
                simultaneousHandlers={longPressRef}
                renderRightActions={() => this.renderRightActions(file.key)}
                onSwipeableRightOpen={this.clearSelection}
              >
                <TouchableOpacity
                  style={[styles.listItem, is_highlighted && styles.listItemHighlighted]}
                  onPress={() => this.onItemClick(file.key, is_folder)}
                >
                  {
                    is_folder
                      ? <MaterialCommunityIcons name='folder' size={32} color='grey' />
                      : <MaterialCommunityIcons name='file' size={32} color='grey' />
                  }
                  <Text style={styles.filename}>{name}</Text>
                  <Text>{size_string}</Text>
                </TouchableOpacity>
              </Swipeable>
            </View>
          </ GestureHandler.LongPressGestureHandler>
        )
      });
  }

  onItemClick(path, is_folder) {
    this.clearSelection();

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
        <EditModal
          modalVisible={this.state.modalVisible}
          onHidePress={() => this.setState({ modalVisible: false })}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    files: state.s3_objects
  }
}

export default connect(mapStateToProps, { getS3List, deleteObjects, uploadFile })(FilesScreen);

