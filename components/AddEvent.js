import { StyleSheet, Text, TextInput, Modal, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-modern-datepicker';
import React, { useState } from 'react';
import addItem from './dataHandler';

/**
 * This view is used to add an event to the database
 * @returns A view with 2 text inputs, a button, a modal, a date time picker, and a button.
 */
export default function AddEvent({ navigation, route }) {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('00:30');
  const [startTime, setStartTime] = useState('');
  const [title, setTitle] = useState('');

  /**
   * When the user selects a duration, hide the duration picker and set the duration to the selected
   * time.
   * @param selectedTime - The time that was selected by the user.
   */
  const handleDurationSelection = (selectedTime) => {
    setShowDurationPicker(false);
    setDuration(selectedTime);
  };

  /**
   * Takes a selectedDate as an argument; sets the
   * startTime state to the selectedDate's hours and minutes, and then sets the showStartTimePicker state
   * to false.
   * @param selectedDate - The date that was selected by the user.
   */
  const onStartTimeChange = (event, selectedDate) => {
    const date = new Date(selectedDate);
    console.log(selectedDate);

    setStartTime(`${date.getHours()}:${date.getMinutes()}`);
    setShowStartTimePicker(false);
  };

  /**
   * If the hour is less than 12 and greater than 0, it's AM. If the hour is 0, it's 12 AM. If the hour
   * is greater than 12, it's PM. If the hour is 12, it's 12 PM.
   * @param time - The time in 24 hour format.
   * @returns A string with the hour, minutes, and AM/PM.
   */
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
    /* Returning a string with the hour, minutes, and AM/PM. */
    return `${hour}:${time.split(':')[1]} ${am}`;
  };

  /**
   * If the title, description, and duration are not empty, then add the item to the database and go back
   * to the previous screen.
   *
   * If any of the fields are empty, then alert the user to fill out all fields.
   */
  const saveAndExit = () => {
    if (title !== '' && description !== '' && duration !== '') {
      addItem(
        'event',
        { title: title, description: description, time: duration, startTime: startTime },
        route.params.trace,
        () => navigation.goBack(null)
      );
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <View style={styles.container}>
      {/* This is a TextInput component that is used to get the title of the event. */}
      <TextInput
        style={styles.textInput}
        placeholder={'Title'}
        onChangeText={(input) => setTitle(input)}
      />
      {/* This is a TextInput component that is used to get the description of the event. */}
      <TextInput
        style={styles.textInput}
        placeholder={'Description'}
        multiline={true}
        onChangeText={(input) => {
          setDescription(input);
          console.log(input);
        }}
      />
      {/* This is a button that sets the showPicker state to true when pressed. */}
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDurationPicker(true)}>
        <Text style={styles.dateInputText}>{duration != '' ? duration : 'Duration'}</Text>
      </TouchableOpacity>
      {/* A modal that is used to display the time picker for the event duration. */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={showDurationPicker}
        onRequestClose={() => {
          setShowDurationPicker(false);
        }}
      >
        <View style={styles.modalContent}>
          <DatePicker
            style={styles.timePicker}
            mode="time"
            minuteInterval={5}
            onTimeChange={(selectedTime) => handleDurationSelection(selectedTime)}
          />
        </View>
      </Modal>
      {/* A button that sets the showStartTimePicker state to true when pressed. */}
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
      {/* A conditional statement that renders the DateTimePicker component if the
      showStartTimePicker state is true. */}
      {showStartTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date('2000', '0', '01', '12', '00', '00', '00')}
          mode={'time'}
          is24Hour={false}
          onChange={onStartTimeChange}
        />
      )}
      {/* A button that calls the done function when pressed. */}
      <TouchableOpacity style={styles.done} onPress={saveAndExit}>
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
