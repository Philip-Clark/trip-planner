import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { editItem, removeItem } from './dataHandler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from './Header';
import { useState } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import RichTextEditor from './RichTextEditor';
import RenderHtml from 'react-native-render-html';
import { AnchorRenderer, customHTMLElementModels } from './customLinkRenderer';

/**
 * Displays the details of the event.
 */
export default function Event({ route, navigation }) {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [departure, setDeparture] = useState(route.params.data.departure);
  const [startTime, setStartTime] = useState(route.params.data.startTime);

  /**
   * When the user selects a departure, hide the departure picker and set the departure to the selected
   * time.
   * @param selectedTime - The time that was selected by the user.
   */
  const onDepartureTimeChange = (event, selectedDate) => {
    const date = new Date(selectedDate);
    setShowDeparturePicker(false);
    console.log(selectedDate);
    setDeparture(`${date.getHours()}:${date.getMinutes()}`);
    let dat = route.params.data;
    dat.departure = `${date.getHours()}:${date.getMinutes()}`;
    editItem('event', route.params.trace, dat, () => {});
  };

  /**
   * Takes a selectedDate as an argument; sets the
   * startTime state to the selectedDate's hours and minutes, and then sets the showStartTimePicker state
   * to false.
   * @param selectedDate - The date that was selected by the user.
   */
  const onStartTimeChange = async (event, selectedDate) => {
    setShowStartTimePicker(false);
    const date = new Date(selectedDate);
    setStartTime(`${date.getHours()}:${date.getMinutes().toString().padEnd(2, '0')}`);
    let dat = route.params.data;
    dat.startTime = `${date.getHours()}:${date.getMinutes().toString().padEnd(2, '0')}`;
    dat.id = `${date.getHours()}${date.getMinutes().toString().padEnd(2, '0')}`;
    await editItem('event', route.params.trace, dat, () => {});
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
   * When the delete button is pressed, the event is removed from the database and the user is returned
   * to the previous screen.
   */
  const deleteEvent = () => {
    removeItem('event', route.params.trace, route.params.data, () => navigation.goBack(null));
  };
  return (
    <View style={[styles.container, route.params.editMode && styles.editModeContainer]}>
      <Header
        title={route.params.data.name}
        navigation={navigation}
        deleteHandler={route.params.editMode ? deleteEvent : undefined}
        editable={route.params.editMode}
        route={route.params}
      />
      {route.params.editMode ? (
        <View>
          <View style={styles.timeRow}>
            {/* A button that sets the showStartTimePicker state to true when pressed. */}
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                if (showStartTimePicker == false) {
                  setShowStartTimePicker(true);
                }
              }}
            >
              {/* <MaterialCommunityIcons
                name="clock"
                size={32}
                color="#5c5c5c"
                style={{ transform: [{ rotate: `${Math.random() * 360}deg` }] }}
              /> */}
              <Text style={styles.dateInputText}>
                Arrival : {startTime != '' ? get12HourTime(startTime) : ' Start Time'}
              </Text>
            </TouchableOpacity>
            {/* A conditional statement that renders the DateTimePicker component if the
      showStartTimePicker state is true. */}
            {showStartTimePicker && (
              <DateTimePicker
                value={new Date('2000', '0', '01', '12', '00', '00', '00')}
                mode={'time'}
                is24Hour={false}
                onChange={onStartTimeChange}
              />
            )}

            {/* This is a button that sets the showPicker state to true when pressed. */}
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDeparturePicker(true)}>
              <Text style={styles.dateInputText}>
                Departure : {departure != '' ? get12HourTime(departure) : ' Departure Time'}{' '}
              </Text>
            </TouchableOpacity>
            {showDeparturePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date('2000', '0', '01', '12', '00', '00', '00')}
                mode={'time'}
                is24Hour={false}
                onChange={onDepartureTimeChange}
              />
            )}
          </View>
          <RichTextEditor
            defaultValue={route.params.data.data}
            callback={(response) => {
              let dat = route.params.data;
              dat.data = response;
              editItem('event', route.params.trace, dat, () => {});
            }}
          />
          {/* <TextInput
            style={[styles.text, styles.editable]}
            multiline={true}
            defaultValue={route.params.data.data}
            onChangeText={(Text) => {
              let dat = route.params.data;
              dat.data = Text;
              editItem('event', route.params.trace, dat, () => {});
            }}
          /> */}
        </View>
      ) : (
        <View>
          <View style={styles.timeRow}>
            <View style={styles.dateInput}>
              {/* <MaterialCommunityIcons
                name="clock"
                size={32}
                color="#67dfe8"
                style={{ transform: [{ rotate: `${Math.random() * 360}deg` }] }}
              /> */}
              <Text style={styles.dateInputText}>
                Arrival: {startTime != '' ? get12HourTime(startTime) : ' Start Time'}
              </Text>
            </View>
            {departure != '' && (
              <View style={styles.dateInput}>
                {/* <MaterialCommunityIcons
                  name="clock"
                  size={32}
                  color="#5c5c5c"
                  style={{ transform: [{ rotate: `${Math.random() * 360}deg` }] }}
                /> */}
                <Text style={styles.dateInputText}>Departure: {get12HourTime(departure)}</Text>
              </View>
            )}
          </View>
          <ScrollView>
            <View style={{ marginBottom: 300 }}>
              <RenderHtml
                source={{ html: route.params.data.data }}
                style={styles.text}
                renderers={AnchorRenderer}
                customHTMLElementModels={customHTMLElementModels}
              />
            </View>
          </ScrollView>
          {/* Fade out list view */}
          <LinearGradient colors={['rgba(255, 255, 255, 0)', '#ffffff']} style={styles.gradient} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
  },

  editModeContainer: {
    borderColor: '#67dfe8',
    borderWidth: 5,
    padding: 15,
  },
  text: {
    padding: 30,
    fontSize: 20,
    color: '#5c5c5c',
  },

  dateInput: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
  },

  color: '#828282',
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5ff',
  },

  dateInputText: {
    fontSize: 16,
    padding: 8,
  },

  gradient: {
    position: 'absolute',
    marginBottom: 0,
    bottom: 80,
    height: 1,
    width: '100%',
    transform: [{ scaleY: 100 }, { translateY: -0.5 }],
  },

  editable: {
    height: 500,
    borderColor: '#969696',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
});
