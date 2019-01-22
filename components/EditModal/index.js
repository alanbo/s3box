import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';

class EditModal extends Component {
  state = {
  };

  render() {
    return (
      <Modal
        animationType='fade'
        transparent={false}
        presentationStyle='formSheet'
        visible={!!this.props.modalVisible}
        onRequestClose={this.props.onHidePress}
      >
        <View style={{ marginTop: 22 }}>
          <View>
            <Text>Sample text</Text>

            <TouchableHighlight
              onPress={this.props.onHidePress}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
}

export default EditModal;