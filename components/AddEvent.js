import { StyleSheet, TextInput, View, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import addItem from './dataHandler';
import RichTextEditor from './RichTextEditor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { get12HourTime } from './timeConvert';
import OpacityButton from './OpacityButton';
import { theme } from './Styles';

/**
 * This view is used to add an event to the database
 * @returns A view with 2 text inputs, a button, a modal, a date time picker, and a button.
 */
export default function AddEvent({ navigation, route }) {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [departure, setDeparture] = useState('');
  const [startTime, setStartTime] = useState('');
  const [title, setTitle] = useState('');

  const departureButtonText = departure != '' ? get12HourTime(departure) : 'Departure Time';
  const startTimeButtonText = startTime != '' ? get12HourTime(startTime) : 'Start Time';
  const emptyFields = title == '' || description == '' || startTime == '';

  const onDepartureTimeChange = (event, selectedDate) => {
    setShowDeparturePicker(false);
    const date = new Date(selectedDate);
    setDeparture(`${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`);
  };

  const onStartTimeChange = (event, selectedDate) => {
    setShowStartTimePicker(false);
    const date = new Date(selectedDate);
    setStartTime(`${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`);
  };

  const saveAndExit = () => {
    if (emptyFields) {
      Alert.alert('Oops', '\nPlease fill out all fields');
    } else {
      addItem(
        'event',
        {
          title: title,
          description: description,
          time: departure,
          startTime: startTime,
          type: 'event',
        },
        route.params.trace,
        () => navigation.goBack(null)
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={'Title'}
        placeholderTextColor={theme.colors.text}
        style={styles.textInput}
        onChangeText={(input) => setTitle(input)}
      />

      <OpacityButton
        textStyle={theme.style.leftButton}
        text={startTimeButtonText}
        onPress={() => {
          setShowStartTimePicker(true);
        }}
      >
        <MaterialCommunityIcons
          style={{ marginRight: 5 }}
          color={theme.colors.text}
          name="clock"
          size={16}
        />
      </OpacityButton>

      {showStartTimePicker && (
        <DateTimePicker
          value={new Date('2000', '0', '01', '12', '00', '00', '00')}
          onChange={onStartTimeChange}
          testID="dateTimePicker"
          is24Hour={false}
          mode={'time'}
        />
      )}

      <OpacityButton
        textStyle={theme.style.leftButton}
        text={departureButtonText}
        onPress={() => {
          setShowDeparturePicker(true);
        }}
      >
        <MaterialCommunityIcons
          style={{ marginRight: 5 }}
          color={theme.colors.text}
          name="clock"
          size={16}
        />
      </OpacityButton>

      {showDeparturePicker && (
        <DateTimePicker
          value={new Date('2000', '0', '01', '12', '00', '00', '00')}
          onChange={onDepartureTimeChange}
          testID="dateTimePicker"
          is24Hour={false}
          mode={'time'}
        />
      )}

      <RichTextEditor
        placeholder={'Description'}
        callback={(response) => {
          setDescription(response);
        }}
      />

      <OpacityButton
        buttonStyle={theme.style.bottomButton}
        onPress={saveAndExit}
        text={'Save Event'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.accent,
    borderWidth: 5,
    padding: 15,
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
    color: theme.colors.text,
    backgroundColor: theme.colors.itemColor,
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
    backgroundColor: theme.colors.itemColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  dateInputText: {
    fontSize: 16,
    color: theme.colors.text,
    marginVertical: 5,
  },
});
