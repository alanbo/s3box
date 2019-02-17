import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BorderlessButton } from 'react-native-gesture-handler';
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
				<View style={ styles.modalInner }>
					<View>
						<View style={ styles.buttons }>
							<BorderlessButton
								onPress={ console.log }
								style={ styles.editButton }
							>
								<Text style={ styles.editButtonText }>Rename</Text>
							</BorderlessButton>
							<BorderlessButton
								onPress={ console.log }
								style={ styles.editButton }
							>
								<Text style={ styles.editButtonText }>Transform</Text>
							</BorderlessButton>
							<BorderlessButton
								onPress={ console.log }
								style={ styles.editButton }
							>
								<Text style={ styles.editButtonText }>Transform...</Text>
							</BorderlessButton>
							<BorderlessButton
								onPress={ console.log }
								style={ styles.editButton }
							>
								<Text style={ styles.editButtonText }>Delete</Text>
							</BorderlessButton>
							<BorderlessButton
								onPress={this.props.onHidePress}
								style={ styles.editButton }
							>
								<Text style={[styles.editButtonText, styles.editButtonTextCancel ]}>Cancel</Text>
							</BorderlessButton>
						</View>
					</View>
				</View>
			</Modal>
    );
  }
}

export default EditModal;
