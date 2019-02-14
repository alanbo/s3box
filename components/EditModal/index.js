import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';
import styles from './styles';


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
				<View
					style={ styles.modalInner }
				>
					<View>
						<View style={ styles.buttons }>
						</View>

						<View style={ styles.hide }>
							<TouchableHighlight
								onPress={this.props.onHidePress}>
								<Text>Hide Modal</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
			</Modal>
    );
  }
}

export default EditModal;
