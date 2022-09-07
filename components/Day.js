import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from './Header';

import React, { useEffect, useState } from 'react';
import { getData } from './dataHandler';
import { useFocusEffect } from '@react-navigation/native';
import SlideInView from './slideView';
import { LinearGradient } from 'expo-linear-gradient';
import EventTimeLine from './EventTimeLine';

export default function Day({ route, navigation }) {
  const [dayData, setDayData] = useState({});
  const [tripName, setTripName] = useState('');
  const [events, setEvents] = useState([]);
  const [color, setColor] = useState('#000000');
  const [time, setTime] = useState();
  const trace = route.params.trace;

  const updateData = () => {
    console.log('update Data in Day');

    getData().then((response) => {
      setDayData(response[trace.tripID - 1].days[trace.dayID - 1]);
      setTripName(response[trace.tripID - 1].name);
      setEvents(
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

  useFocusEffect(
    React.useCallback(() => {
      updateData();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 15000);
    return () => {
      clearInterval(interval);
    };
  }, [15000]);

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
      <Header
        title={`Day ${dayData.id}`}
        backTo={'Trip'}
        navigation={navigation}
        subtitle={tripName}
      />
      <FlatList
        style={styles.days}
        data={events}
        contentContainerStyle={{ paddingBottom: 300, paddingTop: 10 }}
        renderItem={({ item }) => (
          <SlideInView duration={400} start={50} end={0} offset={events.indexOf(item)}>
            {/* EVENT */}
            <EventTimeLine item={item} events={events} date={route.params.date}>
              {/* EVENT CARD */}
              <TouchableOpacity style={styles.dayCard} onPress={() => navigateTo('Event', item)}>
                <View style={styles.dayItem}>
                  <Text style={styles.dayText}>{item.name}</Text>
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
      />
      <LinearGradient colors={['rgba(255, 255, 255, 0)', '#ffffff']} style={styles.gradient} />
      <TouchableOpacity
        onPress={() =>
          navigateTo('AddEvent', {
            dayData: dayData,
          })
        }
      >
        <View style={styles.addEvent}>
          <Text style={styles.add}>Add Event</Text>
        </View>
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

  timeText: {
    fontSize: 16,
    width: 60,
    color: '#5c5c5c',
    alignSelf: 'center',
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

  dot: {
    height: 10,
    width: 10,
    margin: 10,
    alignSelf: 'center',
    borderRadius: 50000,
    // backgroundColor: '#7ff8f8',
    backgroundColor: '#f5f5f5ff',
  },

  line: {
    position: 'relative',
    alignSelf: 'center',
    top: 10,
    borderColor: '#f5f5f5ff',
    backgroundColor: '#f5f5f5ff',
    width: 2,
    height: 60,
  },

  add: {
    flex: 1,
    textAlign: 'center',
  },
});
