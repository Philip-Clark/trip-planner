import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

/*
------------------------------------------------------------------------------------------------
DESCRIPTION:
- Blue timeLine on the left side of the screen.
  Is a small part of the timeLine, the part that relates to the event it is in.
  Includes the start time, the line, and dots.
------------------------------------------------------------------------------------------------
INPUT PARAMETERS:
- Children >  to be rendered inside the timeLine.
- item     >  the data that pertains to the the event.
- events   >  a list of events to get the next event from.
- date     >  to get the date string to build a date/time object from.
------------------------------------------------------------------------------------------------
FUNCTIONS:
- getTimeDifference():
- getPercentageOfTimeRange()
- get12HourTime(time)
- getLineSize()
- setDotColor()
- remaining()
- return()
------------------------------------------------------------------------------------------------
*/
export default function EventTimeLine({ children, item, events, date }) {
  const [newColorValue, setNewColorValue] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const now = new Date();
  let currentTime = now.getTime();

  // Check if this item is the last in the event list
  const notLastItem = () => {
    return events.indexOf(item) + 1 < events.length;
  };

  // Temporary date object
  let tempSplitDate = date.toString().split(' ');

  // Current time
  tempSplitDate[4] = item.startTime;
  const thisTime = new Date(tempSplitDate.join(' ')).getTime();

  // Next time
  tempSplitDate[4] = notLastItem() ? events[events.indexOf(item) + 1].startTime : '';
  const nextTime = new Date(tempSplitDate.join(' ')).getTime();

  /* 
    Returns the difference in time between the currentTime and nextTime. 
  */
  const getTimeDifference = () => {
    const minimumDiff = 1;
    const difference = parseFloat(nextTime - thisTime) / 8000000;
    return difference > minimumDiff ? difference * 30 : 1;
  };

  /* 
    Returns the percent of time of the current time relative to the range of the current item and the next.
  */
  const getPercentageOfTimeRange = () => {
    const timeRange = parseFloat(nextTime - thisTime);
    const mappedCurrentTime = parseFloat(nextTime - currentTime);
    const percent = mappedCurrentTime / timeRange;
    return 1 - percent;
  };

  /* 
    Returns the size of the current item's line.
    If the time range of this item and the next is in the:
    -- past: return 1, 
    -- present: return percentage, 
    -- future: return -1;
  */
  const getLineSize = () => {
    if (currentTime < nextTime && currentTime > thisTime) {
      return getPercentageOfTimeRange();
    } else if (currentTime >= nextTime) return 1;
    return -1;
  };

  // Return remaining percentage of the time range.
  const remaining = () => {
    // 100% - 75% = 35%
    return 1 - getLineSize();
  };

  /* 
    Returns the start time of the current event 
    in a readable 12-hour time format.
    Includes AM or PM time stamps.
  */
  const get12HourTime = () => {
    let hour = item.startTime.split(':')[0];
    let am = 'AM/PM';
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
    return `${hour}:${item.startTime.split(':')[1].padStart(2, '0')} ${am}`;
  };

  // Set the dot color based on if the events start time is passed or not.
  const setDotColor = () => {
    if (newColorValue != 100 && currentTime >= thisTime) {
      setNewColorValue(100);
    }
    return currentTime >= thisTime;
  };

  setDotColor();

  // Animates the dot color changes
  Animated.timing(animation, {
    toValue: newColorValue,
    useNativeDriver: false,
    duration: 300,
  }).start();

  /* 
  
  RETURN 
  
  */
  return (
    <Animated.View style={[styles.day, { marginBottom: getTimeDifference() }]}>
      {/* START TIME */}
      <Text style={styles.timeText}>{get12HourTime()}</Text>
      {/* DOT */}
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: animation.interpolate({
              inputRange: [0, 100],
              outputRange: ['rgba(245, 245, 245, 1)', 'rgb(127, 248, 248)'],
            }),
          },
        ]}
      >
        {notLastItem() && (
          <View>
            {/* BLUE LINE */}
            <View
              style={[
                styles.line,
                { height: getLineSize() * (getTimeDifference() + 50) },
                { backgroundColor: '#7ff8f8' },
              ]}
            />
            {/* GREY LINE */}
            <View
              style={[
                styles.line,
                { height: (remaining() < 1 ? remaining() : 1) * (getTimeDifference() + 50) },
                { backgroundColor: '#f5f5f5ff' },
              ]}
            />
          </View>
        )}
      </Animated.View>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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

  timeText: {
    fontSize: 16,
    width: 60,
    color: '#5c5c5c',
    alignSelf: 'center',
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
  },

  line: {
    position: 'relative',
    alignSelf: 'center',
    top: 10,
    borderColor: '#f5f5f5ff',
    backgroundColor: '#f5f5f5ff',
    width: 2,
    height: 0,
  },
});
