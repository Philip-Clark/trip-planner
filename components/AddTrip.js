import { StyleSheet, TextInput, Modal, View, Alert } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import React, { useState } from 'react';
import addItem from './dataHandler';
import OpacityButton from './OpacityButton';
import { theme } from './Styles';

// NOTE Cleaned and added theme styles.
export default function AddTrip({ navigation, route }) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');

  const emptyField = startTime == '' || endTime == '' || title == '';
  const startDateButtonText = startTime != '' ? startTime : 'Start';
  const endDateButtonText = endTime != '' ? endTime : 'End';

  const selectStart = (selectedTime) => {
    setShowStartPicker(false);
    setStartTime(selectedTime);
  };

  const selectEnd = (selectedTime) => {
    setShowEndPicker(false);
    setEndTime(selectedTime);
  };

  const done = () => {
    if (emptyField) {
      Alert.alert('Oops', '\nPlease fill out all fields');
    } else {
      const tripData = { name: title, startDate: startTime, endDate: endTime };
      addItem('trip', tripData, route.params.trace, () => navigation.goBack(null));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        // Title Input
        placeholder={'Title'}
        placeholderTextColor={theme.colors.text}
        style={styles.textInput}
        onChangeText={(input) => setTitle(input)}
      />

      <OpacityButton
        // Start date selector button
        onPress={() => setShowStartPicker(true)}
        text={startDateButtonText}
        textStyle={theme.style.leftButton}
      ></OpacityButton>

      <OpacityButton
        // End date selector button
        onPress={() => setShowEndPicker(true)}
        text={endDateButtonText}
        textStyle={theme.style.leftButton}
      />

      <Modal
        // Start date Selector modal
        animationType="fade"
        transparent={true}
        visible={showStartPicker}
        onRequestClose={() => {
          setShowStartPicker(!showStartPicker);
        }}
      >
        <View style={styles.modalContent}>
          <DatePicker
            // Start date Selector
            style={styles.timePicker}
            options={styles.calender}
            mode="calendar"
            maximumDate={endTime}
            onDateChange={(selectedTime) => selectStart(selectedTime)}
          />
        </View>
      </Modal>

      <Modal
        // End date Selector modal
        animationType="fade"
        transparent={true}
        visible={showEndPicker}
        onRequestClose={() => {
          setShowEndPicker(!showEndPicker);
        }}
      >
        <View style={styles.modalContent}>
          <DatePicker
            // End date Selector
            style={styles.timePicker}
            minimumDate={startTime}
            options={styles.calender}
            current={startTime}
            mode="calendar"
            onDateChange={(selectedTime) => selectEnd(selectedTime)}
          />
        </View>
      </Modal>

      <OpacityButton text={'Add Trip'} onPress={done} buttonStyle={theme.style.bottomButton} />
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
    padding: 20,
  },

  modalContent: {
    width: '100%',
    height: '100%',
    padding: 3,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: theme.colors.modalBackground,
  },

  timePicker: {
    borderRadius: theme.sizes.borderRadius,
    elevation: 10,
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

  done: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    marginHorizontal: 20,
    backgroundColor: theme.colors.itemColor,
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

  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: theme.colors.text,
  },
});
