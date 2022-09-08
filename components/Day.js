import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import EventTimeLine from './EventTimeLine';
import { getData } from './dataHandler';
import SlideInView from './slideView';
import Header from './Header';

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
  const trace = route.params.trace;

  /**
   * Gets the data from the data handler, then sets the "dayData", "tripName", and "events" state variables
   */
  const updateData = () => {
    console.log('update Data in Day');

    getData().then((response) => {
      setDayData(response[trace.tripID - 1].days[trace.dayID - 1]);
      setTripName(response[trace.tripID - 1].name);

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
    });
  };

  return (
    <View style={styles.container}>
      {/* A custom component that is used to display the header. */}
      <Header
        title={`Day ${dayData.id}`}
        backTo={'Trip'}
        navigation={navigation}
        subtitle={tripName}
      />
      {/*A list of events for the day. */}
      <FlatList
        style={styles.days}
        data={events}
        contentContainerStyle={{ paddingBottom: 300, paddingTop: 10 }}
        renderItem={({ item }) => (
          /* A custom component that is used to animate the events. */
          <SlideInView offset={events.indexOf(item)}>
            {/* EVENT */}
            <EventTimeLine item={item} events={events} date={route.params.date}>
              {/* EVENT CARD */}
              <TouchableOpacity style={styles.dayCard} onPress={() => navigateTo('Event', item)}>
                <View style={styles.dayItem}>
                  {/* The name of the event. */}
                  <Text style={styles.dayText}>{item.name}</Text>
                  {/*  The duration of the event. */}
                  <Text style={styles.dayText}>
                    {item.duration.split(':')[0] > 0
                      ? item.duration.split(':')[0].replace(/\b0+/g, '') + 'h'
                      : ''}{' '}
                    {item.duration.split(':')[1] > 0 ? item.duration.split(':')[1] + 'm' : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            </EventTimeLine>
          </SlideInView>
        )}
      ></FlatList>

      {/* Fade out list view */}
      <LinearGradient colors={['rgba(255, 255, 255, 0)', '#ffffff']} style={styles.gradient} />

      {/* Add event Button */}
      <TouchableOpacity onPress={() => navigateTo('AddEvent', { dayData: dayData })}>
        <View style={styles.addEvent}>
          <Text style={styles.add}>Add Event</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

/* A style sheet. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 50,
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

  dayItem: {
    backgroundColor: '#f5f5f5ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

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

  add: {
    flex: 1,
    textAlign: 'center',
  },
});
