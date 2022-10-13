import { StyleSheet, Text, TextInput, Modal, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-modern-datepicker';
import React, { useState } from 'react';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { renderers } from 'react-native-popup-menu';
import addItem, { getData, storeData } from './dataHandler';
import SelectDropdown from 'react-native-select-dropdown';
import { useFocusEffect } from '@react-navigation/native';
import OpacityButton from './OpacityButton';
import { theme } from './Styles';
import { Feather } from '@expo/vector-icons';

/**
 * This view is used to add an event to the database
 * @returns A view with 2 text inputs, a button, a modal, a date time picker, and a button.
 */
export default function AddTravel({ navigation, route }) {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [duration, setDuration] = useState('00:30');
  const [startTime, setStartTime] = useState('');
  const [data, setData] = useState([]);

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
   * If the title, description, and duration are not empty, then add the item to the database and go back
   * to the previous screen.
   *
   * If any of the fields are empty, then alert the user to fill out all fields.
   */
  const saveAndExit = () => {
    if (duration !== '' && startTime !== '') {
      addItem(
        'event',
        {
          duration: duration,
          startTime: startTime,
          type: 'travel',
        },
        route.params.trace,
        () => navigation.goBack(null)
      );
    } else {
      alert('Please fill out all fields');
    }
  };
  console.log(route.params.data.dayData.events);
  let events = route.params.data.dayData.events.filter((event) => event.type == 'event');
  console.log(events);
  return (
    <View style={styles.container}>
      <SelectDropdown
        buttonStyle={{ width: '100%', backgroundColor: theme.colors.itemColor }}
        buttonTextStyle={{ color: theme.colors.text, paddingRight: 30 }}
        rowStyle={{
          marginTop: 0,
          backgroundColor: theme.colors.itemColor,
          borderColor: theme.colors.text,
        }}
        rowTextStyle={{ color: theme.colors.text }}
        dropdownStyle={{
          marginTop: -35,
          height: '60%',
          backgroundColor: theme.colors.itemColor,
          borderRadius: theme.sizes.borderRadius,
        }}
        defaultButtonText={'Select event'}
        data={events}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem);
          setStartTime(selectedItem.startTime + '.1');
        }}
        renderDropdownIcon={() => {
          return <Feather name="chevron-down" size={30} style={{ color: theme.colors.text }} />;
        }}
        dropdownOverlayColor={'transparent'}
        dropdownIconPosition={'left'}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem.name;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item.name;
        }}
      />

      {/* This is a button that sets the showPicker state to true when pressed. */}
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDurationPicker(true)}>
        <Text style={styles.dateInputText}>{duration != '' ? duration : 'Duration'}</Text>
      </TouchableOpacity>
      {/* A modal that is used to display the time picker for the event duration. */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDurationPicker}
        onRequestClose={() => {
          setShowDurationPicker(false);
        }}
      >
        <View style={styles.modalContent}>
          <DatePicker
            style={styles.timePicker}
            mode="time"
            options={styles.calender}
            minuteInterval={5}
            onTimeChange={(selectedTime) => handleDurationSelection(selectedTime)}
          />
        </View>
      </Modal>

      {/* A button that calls the done function when pressed. */}
      <OpacityButton
        onPress={saveAndExit}
        text={'Save Travel Time'}
        buttonStyle={theme.style.bottomButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calender: {
    backgroundColor: theme.colors.white,
    mainColor: theme.colors.accent,
    textDefaultColor: theme.colors.text,
    textHeaderColor: theme.colors.text,
  },

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
    backgroundColor: theme.colors.modalBackground,
  },

  timePicker: {
    borderRadius: theme.sizes.borderRadius,
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
    borderRadius: theme.sizes.borderRadius,
    marginVertical: 5,
  },

  dateInput: {
    backgroundColor: theme.colors.itemColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
    marginVertical: 5,
  },

  done: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    marginHorizontal: 20,
    backgroundColor: theme.colors.itemColor,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
    marginVertical: 5,
  },

  dateInputText: {
    fontSize: 16,
    color: theme.colors.text,
    marginVertical: 5,
  },

  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: theme.colors.text,
  },
});
const MenuStyle = {
  optionsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 25,
    width: '100%',
    borderRadius: theme.sizes.borderRadius,
  },

  optionsWrapper: {},
  optionWrapper: {
    margin: 5,
  },
  optionTouchable: {
    activeOpacity: 70,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
};
