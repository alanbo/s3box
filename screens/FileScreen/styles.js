import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    paddingRight: 10,
    paddingLeft: 10
  },
  addFileBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  listItem: {
    height: 50,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filename: {
    flex: 4,
    paddingLeft: 20,
    paddingRight: 20
  }
});