import { StyleSheet } from 'react-native';

const addRoomStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: 'white',
    },
    BottomContainer: {
      flex: 1,
      padding: 10,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    box: {
      width: '100%',
    },
    //Logo----------------------------------------------
    logo: {
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageLogo: {
      width: 170,
      height: 70,
    },
    //Thanh chọn phía trên------------------------------
    topNagivation: {
      marginTop: 10,
      height:50,
      // backgroundColor:'red',
      borderRadius:5,
      borderColor:'#008375',
      borderWidth: 3,
      display: 'flex',
      flexDirection: 'row', // Đặt các ô nằm ngang
    },
    roomListBtn: {
      flex: 7, // 70% của topNavigation
      justifyContent: 'center',
      alignItems: 'center', 
      borderRightColor:'#008375',
      borderRightWidth: 3,
    },
    roomAddBtn: {
      flex: 3, // 30% của topNavigation
      justifyContent: 'center',
      alignItems: 'center',
    },
    AddBtn: {
      flex: 3, // 30% của topNavigation
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:5,
      borderColor:'#008375',
      borderWidth: 2,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginRight: 40,
    },
    ExitBtn: {
      flex: 3, // 30% của topNavigation
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:5,
      borderColor:'#008375',
      borderWidth: 2,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginLeft: 40,
    },
    roomText: {
      fontSize: 25,
      fontWeight:'bold',
      color: '#008375',
      borderColor:'#008375',
    },
    ipText: {
      fontSize: 17,
      color: 'gray',
      fontWeight:'bold',
    },
    roomButton: {
      marginTop: 10,
      paddingVertical: 20,
      paddingHorizontal: 90,
      borderWidth: 2,
      borderColor: '#008375',
      backgroundColor: 'white',
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
  
    roomNotAvaillable: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 250,
    },
    emptyText: {
      fontSize: 23,
      color: 'gray',
    },
  });

  export default addRoomStyles;