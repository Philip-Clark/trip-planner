import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, Input, Modal, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import addItem from './dataHandler';

export default function AddEvent({ navigation, route }) {
  const [time, setTime] = useState('00:30');
  const [startTime, setStartTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const selectTime = (selectedTime) => {
    setShowPicker(false);
    setTime(selectedTime);
  };

  const onChange = (event, selectedDate) => {
    const date = new Date(selectedDate);

    setStartTime(date);
    setShowStartTimePicker(false);
  };

  const get12HourTime = (time) => {
    let hour = time.split(':')[0];
    let am = 'AM';
    if (hour < 12 && hour > 0) {
      am = 'AM';
    } else {
      if (hour == 0) {
        hour = 12;
      } else {
        hour = hour - 12;
        if (hour == 0) {
          hour = 12;
        }
        am = 'PM';
      }
    }
    return `${hour}:${time.split(':')[1]} ${am}`;
  };

  const done = () => {
    if (title !== '' && description !== '' && time !== '') {
      addItem(
        'event',
        { title: title, description: description, time: time, startTime: startTime },
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
      <TextInput
        style={styles.textInput}
        placeholder={'Description'}
        multiline={true}
        onChangeText={(input) => {
          setDescription(input);
          console.log(input);
        }}
      />
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateInputText}>{time != '' ? time : 'Duration'}</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={false}
        visible={showPicker}
        onRequestClose={() => {
          setShowPicker(false);
        }}
      >
        <View style={styles.modalContent}>
          <DatePicker
            style={styles.timePicker}
            mode="time"
            minuteInterval={5}
            onTimeChange={(selectedTime) => selectTime(selectedTime)}
          />
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => {
          setShowStartTimePicker(true);
        }}
      >
        <Text style={styles.dateInputText}>
          {startTime != '' ? get12HourTime(startTime) : 'Start Time'}
        </Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date('2000', '0', '01', '12', '00', '00', '00')}
          mode={'time'}
          is24Hour={false}
          onChange={onChange}
        />
      )}

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
    paddingTop: 50,
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
    maxHeight: 200,
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
