import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, Modal, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import addItem from './dataHandler';

export default function AddTrip({ navigation, route }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [title, setTitle] = useState('');

  const selectStart = (selectedTime) => {
    setShowStartPicker(false);
    setStartTime(selectedTime);
  };

  const selectEnd = (selectedTime) => {
    setShowEndPicker(false);
    setEndTime(selectedTime);
  };

  const done = () => {
    if (startTime !== '' && endTime !== '' && title !== '') {
      addItem(
        'trip',
        { name: title, startDate: startTime, endDate: endTime },
        route.params.trace,
        () => navigation.goBack(null)
      );
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={'Title'}
        onChangeText={(input) => setTitle(input)}
      />

      <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
        <Text style={styles.dateInputText}>{startTime != '' ? startTime : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
        <Text style={styles.dateInputText}>{endTime != '' ? endTime : 'End'}</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={false}
        visible={showStartPicker}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContent}>
          <DatePicker
            style={styles.timePicker}
            mode="calendar"
            maximumDate={endTime}
            onDateChange={(selectedTime) => selectStart(selectedTime)}
          />
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={false}
        visible={showEndPicker}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContent}>
          <DatePicker
            style={styles.timePicker}
            minimumDate={startTime}
            current={startTime}
            mode="calendar"
            onDateChange={(selectedTime) => selectEnd(selectedTime)}
          />
        </View>
      </Modal>

      <TouchableOpacity style={styles.done} onPress={done}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },

  modalContent: {
    width: '100%',
    height: '100%',
    padding: 3,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  timePicker: {
    borderRadius: 30,
    shadowColor: '#000000',
    elevation: 100,
  },

  textInput: {
    fontSize: 16,
    color: '#5c5c5c',
    backgroundColor: '#f5f5f5ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  dateInput: {
    backgroundColor: '#f5f5f5ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  done: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    marginHorizontal: 20,
    backgroundColor: '#f5f5f5ff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  dateInputText: {
    fontSize: 16,
    color: '#5c5c5c',
    marginVertical: 5,
  },

  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#5c5c5c',
  },
});
