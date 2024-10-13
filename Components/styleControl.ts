import { StyleSheet } from 'react-native';

const controlRoomStyles = StyleSheet.create({
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
  
    //___________________________________________________________
    //__________________ĐIỀU KIỆN PHÒNG_______________________
  
    boxCondition: {
      padding: 10,
    },
    iconSelect: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    imageSelect: {
      width: 50,
      height: 50,
      // You can adjust the width and height based on your needs
    },
    dataText: {
      paddingTop: 40,
      fontSize: 20,
      color: 'white',
    },
    selectButton: {
    },
    selectedButton: {
      paddingTop:5,
      width: 55,
      height: 55,
  
    },
    // CSS LOGO____________________________________________________
    //____________________________________________________________
    // CSS TEN PHONG
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
      position: 'relative',
    },
    roomName: {
      width: 130, // Đã tăng chiều rộng để chứa danh sách
      backgroundColor: 'lightgray',
      padding: 10,
      position: 'relative',
      marginRight: 20,
      marginHorizontal: 10,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center', // Căn giữa theo chiều dọc
      alignItems: 'center', // Căn giữa theo chiều ngang
    },
    clickableView: {
      padding: 10,
      alignItems: 'center',
    },
    listContainer: {
      position: 'absolute',
      top: 50, // Điều chỉnh khoảng cách từ trên xuống để danh sách không bị che khuất
      left: 0,
      right: 0,
      zIndex: 10, // Đảm bảo danh sách nằm trên các phần tử khác
      backgroundColor: 'white',
      maxHeight: 150, // Giới hạn chiều cao của danh sách
      borderWidth: 1, // Thêm viền để thấy danh sách
      borderColor: 'gray',
    },
    variableView: {
      flex: 1,
      backgroundColor: '#008375',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    ipInput: {
      width: '100%',
      height: 40,
      backgroundColor: '#005C53',
      paddingHorizontal: 10,
      paddingTop: 10,
      borderRadius: 10,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    text: {
      fontSize: 17,
      color: 'black', // Đặt màu chữ cho các phần tử Text
      fontWeight: 'bold',
    },
  
    //_________________________CONTROL______________________
    controlBox: {
      backgroundColor: 'lightgray',
      flexDirection: 'row', // Sắp xếp các phần tử con theo hàng ngang
      width: '100%',
      height: 200, // Đặt chiều cao cho phần tử màu vàng
      flex: 2
    },
    leftLight: {
      flex: 1, // Chiếm 1 phần không gian theo tỷ lệ
      justifyContent: 'center',
      alignItems: 'center',
      width: 70, // Điều chỉnh kích thước của hình ảnh
    },
    MiddleFan: {
      flex: 2, // Chiếm 2 phần không gian theo tỷ lệ
      justifyContent: 'center',
      alignItems: 'center',
      width: 70, 
    },
    rightLight: {
      flex: 1, // Chiếm 1 phần không gian theo tỷ lệ
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageLight: {
      height: 150,
      width: 70,
    },
    imageFan1: {
      height: 150,
      marginVertical: 30,
      width: 80, 
    },
    imageFan2: {
      height: 120,
      marginVertical: 30,
      width: 80, 
    },
    //____________________________O ĐIỀU KHIỂN MODE__________________________
    //_________________________________________________________________
    modeControl: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop:8,
      justifyContent: 'center',
      paddingBottom: 5,
      backgroundColor: 'lightgray'
    },
    switchModeContainer: {
      transform: [{ scaleX:1 }, { scaleY: 1 }],
    },
    track: {
  
      height: 35,
      borderRadius: 20,
      justifyContent: 'center',
      padding: 2,
    },
    thumb: {
      width: 36,
      height: 36,
      borderRadius: 20,
      backgroundColor: 'white',
    },
    labelModeState: {
      marginLeft: 10,
      fontSize: 18,
      color: 'black',
    },
    //____________________________O GIAO TIEP__________________________
    //_________________________________________________________________
    labelContainer: {
      marginTop: 10,
      padding: 10,
      backgroundColor: 'gray',
      alignItems: 'center',
    },
    labelText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
  });
  export default controlRoomStyles;