import { StyleSheet } from 'react-native';

const editRoomStyles = StyleSheet.create({
    container: {
      // flex: 1,
      padding: 40,
      backgroundColor: 'white',
      alignItems:'center',
    },
    label: {
      fontSize: 25,
      marginBottom: 30,
      color: '#008375',
      textAlign: 'center',
      fontWeight: 'bold',
      width:300,
    },
    input: {
      height: 50,
      width: 250,
      borderColor: 'gray',
      borderWidth: 2,
      marginBottom: 30,
      paddingHorizontal: 10,
      color: 'black',
      backgroundColor: 'white',
      textAlign: 'center',
    },
    saveButton: {
      backgroundColor: '#008375',
      padding: 12,
      borderRadius: 5,
      marginTop: 30,
      width: 250,
      height: 50,
  
    },
    saveButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      
    },
    cancelButton: {
      backgroundColor: 'red',
      padding: 12,
      borderRadius: 5,
      marginTop: 30,
      width: 250,
      height: 50,
    },
  });
  export default editRoomStyles;