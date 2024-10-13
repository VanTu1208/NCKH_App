import React, { useState, useEffect } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import controlRoomStyles from './Components/styleControl'; // Import styles từ file styles.ts
import addRoomStyles from './Components/styleAdd';
import editRoomStyles from './Components/styleEdit';
import AsyncStorage from '@react-native-async-storage/async-storage';

//------------------------------------------------
//------------------------------------------------
//--------------------SWITCH MODE-----------------
interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange,disabled}) => {
  const [animation] = useState(new Animated.Value(value ? 1 : 0));

  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);
  
  const toggleSwitch = () => {
    if (disabled) return;
    Animated.timing(animation, {
      toValue: value ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    onValueChange(!value);
  };

  const trackWidth = 70;
  const thumbSize = 36;

  const interpolateThumbPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-2, trackWidth - thumbSize - 2],
  });

  const interpolateTrackColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['gray', '#14EEBB'],
  });

  const interpolateThumbColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f4f3f4', '#008380'],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <Animated.View style={[controlRoomStyles.track, { width: trackWidth, backgroundColor: interpolateTrackColor }]}>
        <Animated.View style={[controlRoomStyles.thumb, { backgroundColor: interpolateThumbColor, transform: [{ translateX: interpolateThumbPosition }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

//------------------------------------------------
//------------------------------------------------
//---------------DINH DANG BIEN ROOM--------------
type Room = {
  name: string;
  ip: string;
  mode: string;
  temp_value: number;
  light_value: number;
  hum_value: number;
  power_value: number;
  curr_value: number;
  light1: boolean;
  light2: boolean;
  fan1: boolean;
  fan2: boolean;
};


//------------------------------------------------
//------------------------------------------------
//---------------------APP------------------------
const App: React.FC = () => {

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [communityLocked, setCommunityLocked] = useState<boolean>(false);
  const [roomsState, setRoomsState] = useState<Record<string, { 
    light1: boolean, 
    light2: boolean, 
    fan1: boolean, 
    fan2: boolean 
  }>>({});
  const [modeOn, setModeOn] = useState<{ [ip: string]: boolean }>({});
  const [name, setName] = useState('');
  const [ip, setIP] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAddRoomPage, setShowAddRoomPage] = useState(false);
  const [showControlPage, setShowControlPage] = useState(true);
  const [lightValue, setLightValue] = useState<number>(0);
  const [tempValue, setTempValue] = useState<number>(0);
  const [humValue, setHumValue] = useState<number>(0);
  const [powerValue, setPowerValue] = useState<number>(0);
  const [currValue, setCurrValue] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<'light' | 'temperature' | 'humidity' | 'current' | 'power' | null>(null);
  const [selectedData, setSelectedData] = useState<{ [ip: string]: string | null }>({});
  const [communityString, setCommunityString] = useState<string>('Connecting to server...!');
  const [editingRoom, setEditingRoom] = useState<Room | null>(null); // Phòng đang chỉnh sửa
  const [newName, setNewName] = useState(''); // Tên mới đang chỉnh sửa
  const [newIP, setNewIP] = useState(''); // IP mới đang chỉnh sửa
  const [isEditing, setIsEditing] = useState(false); // Trạng thái xem có đang chỉnh sửa không
  const [isSending, setIsSending] = useState(false);


//--------------------------------------------------
//--------------------------------------------------
//----------LAY TRANG THAI TU PHAN CUNG-------------
  useEffect(() => {
    if (selectedRoom) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://${selectedRoom.ip}/deviceState`);
          if (!response.ok) throw new Error('Network response was not ok');
  
          const { light1, light2, fan1, fan2 } = await response.json(); // Chỉ lấy 4 thuộc tính cần thiết
  
          // Cập nhật trạng thái cho phòng hiện tại dựa trên IP
          setRoomsState((prevRoomsState) => ({
            ...prevRoomsState,
            [selectedRoom.ip]: { light1, light2, fan1, fan2 }, // Cập nhật trạng thái riêng cho phòng đó
          }));
  
          if (!communityLocked) {
            setCommunityString('Đã kết nối với thiết bị!');
            setCommunityLocked(true);
            setTimeout(() => setCommunityLocked(false), 3000);
          }
        } catch (error) {
          if (!communityLocked) {
            setCommunityString('Error: ' + String(error));
          }
        }
      };
  
      fetchData();
      const intervalId = setInterval(fetchData, 1000); // Cập nhật mỗi giây
  
      return () => clearInterval(intervalId); // Clear interval khi phòng thay đổi hoặc component unmount
    }
  }, [selectedRoom, communityLocked]);
  

//--------------------------------------------------
//--------------------------------------------------
//---------------DIEU KHIEN PHONG-------------------
  const toggleDevice = async (
    DeviceId: string,
    DeviceState: boolean,
    updateState: (newState: boolean) => void
  ) => {
    try {
      if(selectedRoom){
        const url = `http://${selectedRoom.ip}/${DeviceId}/${DeviceState ? 'off' : 'on'}`;
        console.log(`Request URL: ${url}`);
        const response = await fetch(url);
        if (response.ok) {
          updateState(!DeviceState); // Cập nhật state cho light1
        setRoomsState((prevRoomsState) => ({
          ...prevRoomsState,
          [selectedRoom.ip]: {
            ...prevRoomsState[selectedRoom.ip],
            [DeviceId]: !DeviceState, // Chuyển đổi boolean cho light1
          },
        }));
          setCommunityString('Điều khiển thiết bị thành công!');
        } else {
          setCommunityString('Lỗi! Không thể giao kết nối tới Server');
        }
      }
    }
    catch(error) {  
    setCommunityString('Error:' + String(error));
    }
  };

  const [isSending1, setIsSending1] = useState(false);
  //________________________GIAO TIEP VOI ESP32____________________________
  //_______________________________________________________________________
  //Ham dieu lay du lieu thiet bi 
  
  // Fetch analog values
  useEffect(() => {
    if (selectedRoom) {
      const fetchAnalogData = async () => {
        try {
          const response = await fetch(`http://${selectedRoom.ip}/analogValue`);
          if (!response.ok) throw new Error('Network response was not ok');
  
          const analog = await response.json();
          
          // Cập nhật giá trị nếu có phản hồi hợp lệ
          setLightValue(analog.lightValue ?? NaN);
          setTempValue(analog.temperatureValue ?? NaN);
          setHumValue(analog.humidityValue ?? NaN);
          setCurrValue(analog.currentValue ?? NaN);
          setPowerValue(analog.powerValue ?? NaN);
  
        } catch (error) {
          // Nếu có lỗi, đặt các giá trị thành NaN
          setLightValue(NaN);
          setTempValue(NaN);
          setHumValue(NaN);
          setCurrValue(NaN);
          setPowerValue(NaN);
  
          // Xử lý thông báo lỗi
          if (!communityLocked) {
            setCommunityString('Error: ' + String(error));
          }
        }
      };
  
      fetchAnalogData();
      const intervalId = setInterval(fetchAnalogData, 2000);
  
      return () => clearInterval(intervalId);
    }
  }, [selectedRoom, communityLocked]);

  //Ham dieu khien thiet bi
  

  //Ham dieu khien Mode
  const sendModeToESP32 = async (roomIp: string, mode: boolean) => {
    try {
      if (roomIp) {
        setIsSending(true); // Bắt đầu gửi
        const response = await fetch(`http://${roomIp}/setMode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `mode=${mode ? 'on' : 'off'}`,
        });
        if (response.ok) {
          setCommunityString('Đổi chế độ thành công!');
          setModeOn((prevModes) => ({ ...prevModes, [roomIp]: mode })); // Cập nhật trạng thái thực tế
        } else {
          setCommunityString('Không thể đổi chế độ!');
        }
      }
    } catch (error) {
      setCommunityString('Error:' + String(error));
    } finally {
      setIsSending(false); // Kết thúc gửi
    }
  };

useEffect(() => {
  if (selectedRoom) {
    const fetchMode = async () => {
      try {
        
        const response = await fetch(`http://${selectedRoom.ip}/getMode`);
        if (!response.ok) throw new Error('Network response was not ok');

        const modeData = await response.json();
        const newMode = modeData.mode;
        
        setModeOn((prevModes) => ({
          ...prevModes,
          [selectedRoom.ip]: modeData.mode
        }));
      } catch (error) {
      }
    };

    fetchMode();
  }
}, [selectedRoom]);

  // Hàm điều khiển Switch Mode
  const handleValueChange = (roomIp: string, value: boolean) => {
    if (!isSending) { // Chỉ cho phép thay đổi nếu không đang gửi
        sendModeToESP32(roomIp, value); // Gọi hàm gửi chế độ
    }
  };

  //______________________XU LY APP_____________________________
  //_____________________________________________________________



  //Hai ham chuyen giao dien  Danh sach phong/ Them phong
  const ListRoomPress = () => {
    setShowAddRoomPage(false);
  };
  const AddRoomPress = () => {
    setShowAddRoomPage(true);

  };

  //Ham kiem tra dia chi IP
  const validateIP = (ip: string) => {
    // Kiểm tra địa chỉ IP hợp lệ
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  //Ham nhan nut OK, xac thuc them phong
  const AddRoomOK = () => {
    if (name && ip) {
      if (validateIP(ip)) {
        const newRoom = {name: name,
          ip: ip,
          mode: '', // Giá trị mặc định cho mode
          temp_value: 0, // Giá trị mặc định cho temp_value
          light_value: 0, // Giá trị mặc định cho light_value
          hum_value: 0, // Giá trị mặc định cho hum_value
          power_value: 0, // Giá trị mặc định cho power_value
          curr_value: 0, // Giá trị mặc định cho curr_value
          light1: false, // Giá trị mặc định cho light1
          light2: false, // Giá trị mặc định cho light2
          fan1: false, // Giá trị mặc định cho fan1
          fan2: false, // Giá trị mặc định cho fan2 };
        };
        setRooms([...rooms, newRoom]);
        Alert.alert('Thêm phòng thành công!', `Phòng ${name} với IP ${ip} đã được thêm.`);
        const updatedRooms = [...rooms, newRoom];
        updatedRooms.sort((a, b) => a.name.localeCompare(b.name));
        setRooms(updatedRooms);
        setShowAddRoomPage(false);
        
        setName(''); // Đặt lại giá trị tên phòng
        setIP(''); // Đặt lại giá trị IP phòng
        // storeRoomsAsync(rooms);
      } else {
        Alert.alert('Lỗi', 'Địa chỉ IP không hợp lệ.');
      }
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên phòng và địa chỉ IP.');
    }
    
  };
  useEffect(() => {
    if (rooms.length > 0) {
      storeRoomsAsync(rooms); // Chỉ thực hiện khi rooms đã thay đổi
    }
  }, [rooms]); // useEffect sẽ chạy mỗi khi rooms thay đổi
  
  //Ham huy them phong va Out ve Danh sach phong
  const CancelAddRoom = () => {
    if (!name && !ip) {
      setShowAddRoomPage(false);
    }
    else {
      Alert.alert(
      'Confirm',
      'Bạn có chắc chắn muốn hủy?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: () => {
            setShowAddRoomPage(false);
            setName(''); // Đặt lại giá trị tên phòng
            setIP(''); // Đặt lại giá trị IP phòng
          },
        },
      ],
      { cancelable: true }
      );
  }
  };
  const handlePress = (ip: string, type: 'light' | 'temperature' | 'humidity' | 'power') => {
    let newSelectedData = '';
    setSelectedItem(type);
    switch (type) {
      case 'light':
        newSelectedData = `Light Value: ${lightValue}`;
        break;
      case 'temperature':
        newSelectedData = `Temperature Value: ${tempValue}°C`;
        break;
      case 'humidity':
        newSelectedData = `Humidity Value: ${humValue}%`;
        break;
      case 'power':
        newSelectedData = `Power Value: ${powerValue}W\nCurrent Value: ${currValue}A`;
        break;
    }
  
    // Cập nhật selectedData riêng cho từng phòng bằng IP
    setSelectedData((prevData) => ({
      ...prevData,
      [ip]: newSelectedData,  // Cập nhật dữ liệu của phòng có IP tương ứng
    }));
  };
  const types: Array<'light' | 'temperature' | 'humidity' | 'power'> = ['light', 'temperature', 'humidity', 'power'];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const type = types[currentIndex];
      handlePress(ip, type); // Gọi hàm handlePress với IP và type hiện tại
      setCurrentIndex((prevIndex) => (prevIndex + 1) % types.length); // Cập nhật currentIndex
    }, 2000); // 2000 ms = 2 giây

    return () => clearInterval(intervalId); // Cleanup khi component unmount
  }, [currentIndex, ip]); // Chạy lại khi currentIndex hoặc ip thay đổi

  //Ham chon vao FlatList
  const SelectOneRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity 
      style={addRoomStyles.roomButton} 
      onPress={() => openControlRoom(item)}
      onLongPress={() => openOptionsRoom(item)} // Thêm sự kiện nhấn giữ
    >
      <Text style={addRoomStyles.roomText}>{item.name}</Text>
      <Text style={addRoomStyles.ipText}>{item.ip}</Text>
    </TouchableOpacity>
  );

  //Ham khi nhan vao FlatList Phong de chuyen ve ControlRoom
  const openControlRoom = (room: Room) => {
    setShowControlPage(true);
    setSelectedRoom(room);
  };

  //Nhan vao Home de out
  const outOfControl = () => {
    setShowControlPage(false);
    setShowAddRoomPage(false);
  };


  //Nhan giu de mo ra tuy chon
  const openOptionsRoom = (room: Room) => {
    Alert.alert(
      'Options', // Tiêu đề
      `Bạn muốn làm gì với phòng ${room.name}?`, // Nội dung
      [
        { text: 'Chỉnh sửa', onPress: () => startEditingRoom(room) }, 
        { text: 'Xóa', onPress: () => deleteRoom(room), style: 'destructive' },
        { text: 'Mở', onPress: () => openControlRoom(room) },
        //{ text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Hàm xóa phòng
  const deleteRoom = (room: Room) => {
    Alert.alert(
      'Confirm',
      `Xóa phòng ${room.name}?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            setRooms(rooms.filter(r => r !== room));
            setShowAddRoomPage(false);
            Alert.alert('Thông báo', `Phòng ${room.name} đã được xóa.`);
          },
        },
      ],
      { cancelable: true }
      );
    
  };
  //Các hàm để chỉnh sửa thông tin phòng
  const startEditingRoom = (room: Room) => {
    setEditingRoom(room);
    setNewName(room.name); // Đặt tên ban đầu của phòng
    setNewIP(room.ip); // Đặt IP ban đầu của phòng
    setIsEditing(true); // Bắt đầu trạng thái chỉnh sửa
  };

  const saveRoomChanges = () => {
    if (editingRoom) {
      if (newName && newIP) {
        if (validateIP(newIP)) {
          const updatedRoom = { ...editingRoom, name: newName, ip: newIP};
          const updatedRooms = rooms.map((r) =>
            r.ip === editingRoom.ip ? updatedRoom : r
          );
          setRooms(updatedRooms); // Cập nhật danh sách phòng
          setIsEditing(false); // Kết thúc chỉnh sửa
          setEditingRoom(null); // Xóa phòng đang chỉnh sửa
          Alert.alert('Thông báo', 'Đã chỉnh sửa thông tin phòng!');
        } else {
          Alert.alert('Lỗi', 'Địa chỉ IP không hợp lệ.');
        }
      } else {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên phòng và địa chỉ IP.');
      }
    }
  };

  const cancelEdit = () => {
    Alert.alert(
      'Confirm',
      'Xác nhận hủy chỉnh sửa?',
      [
        {
          text: 'Tiếp tục chỉnh sửa',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            setIsEditing(false);
          },
        },
      ],
      { cancelable: true }
      );
    
  };

  //Cac ham kiem tra thong tin trung lao
  const checkDuplicateRoom = (newRoomName: string, newRoomIP: string) => {
    const duplicateRoom = rooms.find(room => room.name === newRoomName || room.ip === newRoomIP);
  
    if (duplicateRoom) {
      Alert.alert(
        'Lỗi',
        `Tên phòng hoặc địa chỉ IP đã tồn tại: ${duplicateRoom.name} (${duplicateRoom.ip})`
      );
      return true; // Có trùng
    }
  
    return false; // Không trùng
  };

  const checkDuplicateEditRoom = (newRoomName: string, newRoomIP: string) => {
    const otherRooms = rooms.filter(room => !(room.name === editingRoom?.name && room.ip === editingRoom?.ip));
    const duplicateRoom = otherRooms.find(room => room.name === newRoomName || room.ip === newRoomIP);
    if(duplicateRoom)
    {
      Alert.alert(
        'Lỗi',
        `Địa chỉ IP hoặc tên phòng đã tồn tại:  ${duplicateRoom.name}`
      );
      return true; // Có trùng
    }
  
    return false; // Không trùng
  };


  const handleAddRoom = () => {
    if (!checkDuplicateRoom(name, ip)) {
      // Tiến hành thêm phòng nếu không có trùng lặp
      AddRoomOK();
    }
  };
  
  const handleEditRoom = () => {
    if (!checkDuplicateEditRoom(newName, newIP)) {
      // Tiến hành chỉnh sửa phòng nếu không có trùng lặp
      saveRoomChanges();
    }
  };

  const storeRoomsAsync = async (rooms: Room[]) => {
    try {
      const jsonValue = JSON.stringify(rooms);  // Chuyển mảng Room[] thành chuỗi JSON
      await AsyncStorage.setItem('storedRooms', jsonValue);  // Lưu chuỗi JSON vào AsyncStorage

      // Alert.alert('Danh sách phòng đã được lưu!');
    } catch (error) {
      Alert.alert('Lưu dữ liệu thất bại');
    }
  };


  //Luu
  const getRoomsAsync = async (setRooms: (rooms: Room[]) => void) => {
    try {
      const jsonValue = await AsyncStorage.getItem('storedRooms');  // Lấy chuỗi JSON từ AsyncStorage
      if (jsonValue !== null) {
        const storedRooms: Room[] = JSON.parse(jsonValue);  // Chuyển chuỗi JSON thành mảng Room[]
        setRooms(storedRooms);  // Cập nhật state
      }
    } catch (error) {
      Alert.alert('Lấy dữ liệu thất bại');
    }
  };
  //Luu du lieu truoc khi thoat
  
  useEffect(() => {
    getRoomsAsync(setRooms);  // Lấy dữ liệu khi ứng dụng mở lại
  }, []);

  if(showControlPage && selectedRoom){
    return(
      <View style={controlRoomStyles.container}>
          
          {/* _____________________________________________________________________ */}
          {/* DIV logo */}
          <View style={[controlRoomStyles.box, controlRoomStyles.logo]}>
            <TouchableOpacity onPress={() => outOfControl() }>
        <Image 
          source={require('./img/logo1.png')}
          style={controlRoomStyles.imageLogo}
          resizeMode="contain"
        />
      </TouchableOpacity>
          </View>
          
          
          {/* _________________________________________________________________________ */}
      
          {/* DIV Ten phong */}
          <View style={controlRoomStyles.rowContainer}>
            <View style={[controlRoomStyles.box, controlRoomStyles.roomName]}>
              <Text style={controlRoomStyles.text}>{selectedRoom.name}</Text>
            </View>

            <View style={[controlRoomStyles.box, controlRoomStyles.variableView]}>
              <Text style={controlRoomStyles.ipInput}>
                {selectedRoom.ip}
              </Text>
            </View>
          </View>


          {/* _________________________________________________________________________ */}
          {/* __________________________THÔNG SÔ, ĐIỀU KIỆN PHÒNG______________________ */}
          
          <View style={[controlRoomStyles.boxCondition, { backgroundColor: '#008375', height: 190 }]}>
          {/* Row 1 */}
            <View style={controlRoomStyles.iconSelect}>
              <TouchableOpacity
                onPress={() => handlePress(ip,'light')}
                style={[
                  controlRoomStyles.selectButton,
                  selectedItem === 'light' && controlRoomStyles.selectedButton,
                ]}
              >
                <Image
                  source={
                    selectedItem === 'light'
                      ? require('./img/icon-anhsangON.png')
                      : require('./img/icon-anhsangOFF.png')
                  }
                  style={controlRoomStyles.imageSelect}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePress(ip,'temperature')}
                style={[
                  controlRoomStyles.selectButton,
                  selectedItem === 'temperature' && controlRoomStyles.selectedButton,
                ]}
              >
                <Image
                  source={
                    selectedItem === 'temperature'
                      ? require('./img/icon-nhietdoON.png')
                      : require('./img/icon-nhietdoOFF.png')
                  }
                  style={controlRoomStyles.imageSelect}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePress(ip, 'humidity')}
                style={[
                  controlRoomStyles.selectButton,
                  selectedItem === 'humidity' && controlRoomStyles.selectedButton,
                ]}
              >
                <Image
                  source={
                    selectedItem === 'humidity'
                      ? require('./img/icon-doamON.png')
                      : require('./img/icon-doamOFF.png')
                  }
                  style={controlRoomStyles.imageSelect}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePress(ip,'power')}
                style={[
                  controlRoomStyles.selectButton,
                  selectedItem === 'power' && controlRoomStyles.selectedButton,
                ]}
              >
                <Image
                  source={
                    selectedItem === 'power'
                      ? require('./img/icon-dienON.png')
                      : require('./img/icon-dienOFF.png')
                  }
                  style={controlRoomStyles.imageSelect}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

          {/* Row 2 */}
          <View style={controlRoomStyles.iconSelect}>
            {selectedData[ip] && <Text style={controlRoomStyles.dataText}>{selectedData[ip]}</Text>}
          </View>
          </View>
          
          
          {/* _______________________________________________________________________ */}
          {/*_________________________Ô GIAO TIẾP___________________________________  */}
      
          <View style={controlRoomStyles.labelContainer}>
            <Text style={controlRoomStyles.labelText}>{communityString}</Text>
          </View>
        
          {/* _______________________________________________________________________ */}
          {/*________________________ĐIỀU KHIỂN MODE___________________________________  */}
      
          <View style={controlRoomStyles.modeControl}>
            <CustomSwitch value={modeOn[selectedRoom.ip]} // Sử dụng giá trị thực từ modeOn
            onValueChange={(value) => handleValueChange(selectedRoom.ip, value)} // Gọi hàm với giá trị mới
            disabled={isSending} // Vô hiệu hóa Switch nếu đang gửi // Gọi hàm với giá trị mới   
            />
              <Text style={controlRoomStyles.labelModeState}>
                {modeOn[selectedRoom.ip] ? 'Chế độ: Tự động' : 'Chế độ: Thủ công '}
              </Text>
          </View>

          {/* _______________________________________________________________________ */}
          {/*_________________________CONTROL______________________________________  */}
          
          <View style={controlRoomStyles.controlBox}>
            {/* Ba view nằm cùng một hàng */}
            <View style={controlRoomStyles.leftLight}>
            <TouchableOpacity 
              onPress={() => {
                if (selectedRoom) {
                  const currentLight1State = roomsState[selectedRoom.ip]?.light1 || false;
                  toggleDevice('light1', currentLight1State, (newState) => {
                    // Cập nhật state của light1 cho phòng hiện tại
                    setRoomsState((prevRoomsState) => ({
                      ...prevRoomsState,
                      [selectedRoom.ip]: {
                        ...prevRoomsState[selectedRoom.ip],
                        light1: newState, // Cập nhật light1 mới
                      },
                    }));
                  });
                }
              }}
            >
                <Image
                  source={
                    selectedRoom && roomsState[selectedRoom.ip]?.light1 
                      ? require('./img/light_on.png') 
                      : require('./img/light_off.png')
                  }
                  style={controlRoomStyles.imageLight}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={controlRoomStyles.MiddleFan} >
              
            <TouchableOpacity 
              onPress={() => {
                if (selectedRoom) {
                  const currentFan1State = roomsState[selectedRoom.ip]?.fan1 || false;
                  toggleDevice('fan1', currentFan1State, (newState) => {
                    setRoomsState((prevRoomsState) => ({
                      ...prevRoomsState,
                      [selectedRoom.ip]: {
                        ...prevRoomsState[selectedRoom.ip],
                        fan1: newState, // Cập nhật trạng thái fan1
                      },
                    }));
                  });
                }
              }}
            >
              <Image 
                source={
                  selectedRoom && roomsState[selectedRoom.ip]?.fan1 
                    ? require('./img/fan_on.png') 
                    : require('./img/fan_off.png')
                }
                style={controlRoomStyles.imageFan1}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                if (selectedRoom) {
                  const currentFan2State = roomsState[selectedRoom.ip]?.fan2 || false;
                  toggleDevice('fan2', currentFan2State, (newState) => {
                    setRoomsState((prevRoomsState) => ({
                      ...prevRoomsState,
                      [selectedRoom.ip]: {
                        ...prevRoomsState[selectedRoom.ip],
                        fan2: newState, // Cập nhật trạng thái fan2
                      },
                    }));
                  });
                }
              }}
            >
              <Image 
                source={
                  selectedRoom && roomsState[selectedRoom.ip]?.fan2 
                    ? require('./img/fan_on.png') 
                    : require('./img/fan_off.png')
                }
                style={controlRoomStyles.imageFan2}
                resizeMode="contain"
              />
              </TouchableOpacity>
                          </View>
                          
                          <View style={controlRoomStyles.rightLight} >
                          <TouchableOpacity 
                onPress={() => {
                  if (selectedRoom) {
                    const currentLight2State = roomsState[selectedRoom.ip]?.light2 || false;
                    toggleDevice('light2', currentLight2State, (newState) => {
                      setRoomsState((prevRoomsState) => ({
                        ...prevRoomsState,
                        [selectedRoom.ip]: {
                          ...prevRoomsState[selectedRoom.ip],
                          light2: newState, // Cập nhật trạng thái light2
                        },
                      }));
                    });
                  }
                }}
              >
                <Image 
                  source={
                    selectedRoom && roomsState[selectedRoom.ip]?.light2 
                      ? require('./img/light_on.png') 
                      : require('./img/light_off.png')
                  }
                  style={controlRoomStyles.imageLight}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
  }
  else{
    //-----------------------------------------------------------------------
    //-----------------------------------------------------------------------
    //-----------------------------------------------------------------------
    //---------------------------------AddRoom-------------------------------
    return (
      <View style={addRoomStyles.container}>
        {/* _____________________________________________________________________ */}
        {/* DIV logo */}
        <View style={[addRoomStyles.box, addRoomStyles.logo]}>
          <Image 
            source={require('./img/logo1.png')}
            style={addRoomStyles.imageLogo}
            resizeMode="contain"
          />
        </View>

        {/* _____________________________________________________________________ */}
        {/* DIV TopNagivation */}
        <View style={[addRoomStyles.box, addRoomStyles.topNagivation]}>
        <TouchableOpacity
        style={[
          addRoomStyles.box,
          addRoomStyles.roomListBtn,
          { backgroundColor: showAddRoomPage === false ? 'yellow' : 'transparent' } // Màu nền sẽ là vàng nếu nút "Danh sách phòng" được nhấn
        ]}
        onPress={ListRoomPress}
      >
        <Text style={{ color: '#008375', fontWeight: 'bold', fontSize: 19 }}>Danh sách phòng</Text>
      </TouchableOpacity>
      
      {/* Nút Thêm */}
      <TouchableOpacity
        style={[
          addRoomStyles.box,
          addRoomStyles.roomAddBtn,
          { backgroundColor: showAddRoomPage === true ? 'yellow' : 'transparent' } // Màu nền sẽ là vàng nếu nút "Thêm" được nhấn
        ]}
        onPress={AddRoomPress}
      >
        <Text style={{ color: '#008375', fontWeight: 'bold', fontSize: 19 }}>Thêm</Text>
      </TouchableOpacity>
        </View>
        
        {/* _____________________________________________________________________ */}
        {/* DIV Chuyen doi giua 2 trang*/}
          <View style={addRoomStyles.BottomContainer}>
            {showAddRoomPage ? (
              //------------------Them Room Moi------------------------
              <View>
                <Text style={{ color: '#008375', fontWeight:'bold', fontSize: 19, marginTop: 50,}}>Nhập tên phòng</Text>
                <TextInput 
                  style={{
                    height: 40,
                    borderColor: '#008375', borderWidth: 2, borderRadius: 5, marginTop: 20, paddingLeft: 10, fontSize: 16, color: 'black',
                  }}
                  placeholder="Room's Name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={(text) => setName(text)} // Hàm này sẽ cập nhật giá trị của tên phòng
                />

                <Text style={{ color: '#008375', fontWeight:'bold', fontSize: 19, marginTop: 80,}}>Nhập địa chỉ IP phòng</Text>
                <TextInput 
                  style={{
                    height: 40, borderColor: '#008375', borderWidth: 2, borderRadius: 5, marginTop: 20, paddingLeft: 10, fontSize: 16, color: 'black',
                  }}
                  placeholder="Room's IP"
                  placeholderTextColor="#999"
                  value={ip}
                  onChangeText={(text) => setIP(text)} // Hàm này sẽ cập nhật giá trị của tên phòng
                />
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 70,width: 300,}}>
                  <TouchableOpacity style={[addRoomStyles.box, addRoomStyles.AddBtn]} onPress={handleAddRoom}>
                    <Text style={{ color: '#008375', fontWeight:'bold', fontSize: 19}}>OK</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[addRoomStyles.box, addRoomStyles.ExitBtn]} onPress={CancelAddRoom}>
                    <Text style={{ color: '#008375', fontWeight:'bold', fontSize: 19}}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : isEditing ? (
              <View style={editRoomStyles.container}>
                <Text style={editRoomStyles.label}>Chỉnh sửa thông tin phòng</Text>
                <TextInput
                  style={editRoomStyles.input}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Nhập tên phòng"
                />
                <TextInput
                  style={editRoomStyles.input}
                  value={newIP}
                  onChangeText={setNewIP}
                  placeholder="Nhập địa chỉ IP"
                />
                <TouchableOpacity style={editRoomStyles.saveButton} onPress={handleEditRoom}>
                  <Text style={editRoomStyles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={editRoomStyles.cancelButton}
                  onPress={() => cancelEdit()}
                >
                  <Text style={editRoomStyles.saveButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            

            ) : (
              <View>
                <FlatList
                  data={rooms}
                  renderItem={SelectOneRoom}
                  keyExtractor={(item) => item.ip}
                  ListEmptyComponent={() => (
                    <View style={addRoomStyles.roomNotAvaillable}>
                      <Text style={addRoomStyles.emptyText}>Không có phòng được kết nối</Text>
                    </View>
                  )}
                />
              </View>
              )}

          </View>
      </View>
    );
  }
};
export default App;