import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import EventTimeLine from './EventTimeLine';
import { getData, removeItem } from './dataHandler';
import SlideInView from './slideView';
import Header from './Header';

import { Feather, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { renderers } from 'react-native-popup-menu';

/**
------------------------------------------------------------------------------------------------
DESCRIPTION:
- Day view that displays the events for the day
------------------------------------------------------------------------------------------------
INPUT PARAMETERS:
- Route > to access the params passed with navigation
- Navigation > to pass to navigation events.
------------------------------------------------------------------------------------------------
*/
export default function Day({ route, navigation }) {
  const [tripName, setTripName] = useState('');
  const [dayData, setDayData] = useState({});
  const [events, setEvents] = useState([]);
  const [time, setTime] = useState();
  const [editMode, setEditMode] = useState(false);
  const [expandAddMenu, setExpandAddMenu] = useState(false);
  const trace = route.params.trace;
  const [refresh, setRefresh] = useState(0);

  /**
   * Gets the data from the data handler, then sets the "dayData", "tripName", and "events" state variables
   */
  const updateData = () => {
    console.log('update Data in Day');

    getData().then((response) => {
      setDayData(response[trace.tripID - 1].days[trace.dayID - 1]);
      setTripName(response[trace.tripID - 1].name);
      console.log(response[trace.tripID - 1].days[trace.dayID - 1].events);
      /**
       * Slightly messy way of doing this, but it works.
       * Set the events to the sorted by startTime list of events.
       */
      setEvents(
        /* Sorting the events by start time. */
        response[trace.tripID - 1].days[trace.dayID - 1].events.sort(
          (a, b) =>
            parseFloat(a.startTime.split(/[: ]+/)[0]) +
              parseFloat(a.startTime.split(/[: ]+/)[1] / 100) +
              (a.startTime.split(/[: ]+/)[2] == 'AM' ? 0 : 1000) >
            parseFloat(b.startTime.split(/[: ]+/)[0]) +
              parseFloat(b.startTime.split(/[: ]+/)[1] / 100) +
              (b.startTime.split(/[: ]+/)[2] == 'AM' ? 0 : 1000)
        )
      );
    });
  };

  /* A hook that is called when the screen is focused. */
  useFocusEffect(
    React.useCallback(() => {
      updateData();
    }, [])
  );

  /* Setting an interval to update the time every 15 seconds. */
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 15000);

    /* A cleanup function that is called when the component is unmounted. */
    return () => {
      clearInterval(interval);
    };
  }, [15000]);

  /**
   * "navigateTo" is a function that takes two parameters, "location" and "eventData", and then
   * navigates to the location with the eventData.
   * @param location - the name of the screen you want to navigate to
   * @param eventData - this is the data that is passed to the function.
   */
  const navigateTo = async (location, eventData) => {
    route.params.trace.eventID = eventData.id;
    navigation.navigate(location, {
      data: eventData,
      trace: route.params.trace,
      date: route.params.date,
      editMode: editMode,
    });
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
    /* Returning a string with the hour, minutes, and AM/PM. */
    return `${hour}:${time.split(':')[1]} ${am}`;
  };

  return (
    <View style={[styles.container, editMode && styles.editModeContainer]}>
      {/* A custom component that is used to display the header. */}
      <Header
        title={`Day ${dayData.id}`}
        backTo={'Trip'}
        navigation={navigation}
        subtitle={tripName}
      >
        {editMode ? (
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <View style={styles.saveButton}>
              <MaterialCommunityIcons name="lock-outline" size={26} color={'white'} />
              <Text style={styles.saveText}> Save</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Menu renderer={renderers.ContextMenu}>
            <MenuTrigger>
              <Feather name="more-horizontal" size={30} style={styles.options} />
            </MenuTrigger>
            <MenuOptions customStyles={MenuStyle}>
              <MenuOption
                onSelect={() => {
                  setEditMode(!editMode);
                }}
                text="Edit Mode"
              />
            </MenuOptions>
          </Menu>
        )}
      </Header>
      {/*A list of events for the day. */}
      <FlatList
        style={styles.days}
        data={events}
        contentContainerStyle={{ paddingBottom: 300, paddingTop: 10 }}
        renderItem={({ item }) =>
          /* A custom component that is used to animate the events. */
          item.type != 'travel' &&
          item.name != '' && (
            <SlideInView offset={events.indexOf(item)}>
              {/* EVENT */}

              <EventTimeLine item={item} eventUnsorted={events} date={route.params.date}>
                {/* EVENT CARD */}
                <View style={styles.locationAndTravel}>
                  <TouchableOpacity
                    style={styles.dayCard}
                    onPress={() => navigateTo('Event', item)}
                  >
                    <View style={styles.dayItem}>
                      {/* The name of the event. */}
                      <Text style={styles.dayText}>{item.name}</Text>
                      {/*  The departure time of the event. */}
                      <Text style={styles.departure}>
                        {item.departure != '' && (
                          <MaterialCommunityIcons name="clock" size={12} color="#5c5c5c" />
                        )}
                        {item.departure != '' && get12HourTime(item.departure)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {events.indexOf(item) < events.length - 1 &&
                  (events[events.indexOf(item) + 1].type === 'travel' ||
                    events[events.indexOf(item) + 1].type === 'drive') ? (
                    editMode ? (
                      <Menu renderer={renderers.ContextMenu}>
                        <MenuTrigger>
                          <Text style={styles.travel}>
                            <MaterialCommunityIcons name="car" size={16} color="#5c5c5c" />
                            {events[events.indexOf(item) + 1].duration}
                          </Text>
                        </MenuTrigger>
                        <MenuOptions customStyles={MenuStyle}>
                          <MenuOption
                            onSelect={() => {
                              let newTrace = trace;
                              newTrace.eventID = parseFloat(item.startTime.replace(':', '')) + 0.1;
                              console.log(newTrace);
                              removeItem('event', trace, events[events.indexOf(item) + 1], () => {
                                updateData();
                                setRefresh((refresh) => refresh + 1);
                              });
                            }}
                            text="Remove Travel Time"
                          />
                        </MenuOptions>
                      </Menu>
                    ) : (
                      <Text style={styles.travel}>
                        <MaterialCommunityIcons name="car" size={16} color="#5c5c5c" />
                        {events[events.indexOf(item) + 1].duration}
                      </Text>
                    )
                  ) : (
                    <View style={{ height: 16 }}></View>
                  )}
                </View>
              </EventTimeLine>
            </SlideInView>
          )
        }
      ></FlatList>

      {/* Fade out list view */}
      <LinearGradient colors={['rgba(255, 255, 255, 0)', '#ffffff']} style={styles.gradient} />

      {/* Add event Button */}
      {editMode && (
        <View style={styles.addList}>
          {expandAddMenu && (
            <View>
              <TouchableOpacity
                onPress={() => navigateTo('AddEvent', { dayData: dayData })}
                style={styles.addOption}
              >
                <SimpleLineIcons
                  name="location-pin"
                  size={16}
                  style={{ color: '#5c5c5c', marginRight: 10 }}
                />
                <Text style={styles.addOptionText}>Location</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo('AddTravel', { dayData: dayData })}
                style={styles.addOption}
              >
                <Ionicons name="car" size={16} style={{ color: '#5c5c5c', marginRight: 10 }} />
                <Text style={styles.addOptionText}>Travel Time</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            // onPress={() => navigateTo('AddEvent', { dayData: dayData })}
            onPress={() => setExpandAddMenu(!expandAddMenu)}
            style={styles.add}
          >
            <View>
              <Feather name="plus" size={30} style={{ color: 'white' }} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* A style sheet. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  locationAndTravel: {
    flex: 1,
    transform: [{ translateY: 8 }],
    alignContent: 'flex-start',
    justifyContent: 'center',
  },

  editModeContainer: {
    borderColor: '#67dfe8',
    borderWidth: 5,
    padding: 15,
  },

  days: {
    paddingTop: 20,
  },

  currentTimeLine: {
    position: 'absolute',

    marginTop: 23,
    marginLeft: 75,
    transform: [
      { translateX: -10 },
      {
        translateY: 57.5 * 6.88,
      },
    ],

    zIndex: 10,
    width: 20,
    height: 2,
    backgroundColor: '#67dfe8',
  },

  menu: {
    borderRadius: 500,
    marginTop: 10,
  },

  saveButton: {
    padding: 5,
    paddingHorizontal: 15,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#67dfe8',
    borderRadius: 500,
  },

  addList: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 20,
  },

  addOption: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 500,
    padding: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    alignSelf: 'flex-end',
    backgroundColor: '#f5f5f5ff',
  },

  addOptionText: {
    fontSize: 16,
    color: '#5c5c5c',
  },
  saveText: {
    color: 'white',
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },

  dayItem: {
    backgroundColor: '#f5f5f5ff',
    display: 'flex',
    // flexDirection: '',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  departure: { fontSize: 12 },

  addEvent: {
    backgroundColor: '#f5f5f5ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  gradient: {
    marginBottom: 0,
    height: 1,
    width: '100%',
    transform: [{ scaleY: 100 }, { translateY: -0.5 }],
  },

  dayText: {
    fontSize: 16,
    color: '#5c5c5c',
  },

  dayCard: {
    flex: 1,
  },

  day: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
  },
  travel: {
    marginLeft: 10,
  },

  add: {
    backgroundColor: '#7ff8f8',
    borderRadius: 5000,
    padding: 20,
    color: '#5c5c5c',
    alignSelf: 'flex-end',
  },
});

const MenuStyle = {
  optionsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 25,
    width: 150,
    borderRadius: 5,
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
    color: '#5c5c5c',
  },
};
