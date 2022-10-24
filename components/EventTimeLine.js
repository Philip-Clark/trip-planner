import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { theme } from './Styles';
import { get12HourTime } from './timeConvert';
import { Ionicons } from '@expo/vector-icons';

/**
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
export default function EventTimeLine({ children, item, eventUnsorted, date }) {
  const [newColorValue, setNewColorValue] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const [layout, setLayout] = useState({ height: 0, top: 0 });
  const now = new Date();
  let currentTime = now.getTime();
  let events = eventUnsorted.filter((event) => event.type == 'event');

  /** Check if this item is the last in the event list */
  const notLastItem = () => {
    return events.indexOf(item) + 1 < events.length;
  };

  /** Check if this item is the first in the event list */
  const notFirstItem = () => {
    return events.indexOf(item) > 0;
  };

  /** Temporary date object */
  let tempSplitDate = date.toString().split(' ');

  /** Current time */
  tempSplitDate[4] = item.startTime;
  const thisTime = new Date(tempSplitDate.join(' ')).getTime();

  // Next time
  tempSplitDate[4] = notLastItem() ? events[events.indexOf(item) + 1].startTime : '00:00';
  const nextTime = new Date(tempSplitDate.join(' ')).getTime();
  const nextTimeString = tempSplitDate[4];

  // previous time
  tempSplitDate[4] = notFirstItem() ? events[events.indexOf(item) - 1].startTime : '00:00';
  const lastTime = new Date(tempSplitDate.join(' ')).getTime();
  const lastTimeString = tempSplitDate[4];

  tempSplitDate[4] = '18:00';
  const nightTimeStart = new Date(tempSplitDate.join(' ')).getTime();

  /**
    Returns the difference in time between the currentTime and nextTime. 
  */
  const getTimeDifference = (timeA = nextTime, timeB = thisTime) => {
    const minimumDiff = 1;
    const difference = parseFloat(timeA - timeB) / 8000000;
    return difference > minimumDiff ? difference * 30 : 1;
  };

  const getHalfHeight = () => {
    return layout.height - 10;
  };

  const getTopPosition = () => {
    return layout.top == undefined ? 0 : layout.top;
  };

  const measureView = (event) => {
    setLayout(event.nativeEvent.layout);
  };

  /** 
    Returns the percent of time of the current time relative to the range of the current item and the next.
  */
  const getPercentageOfTimeRange = () => {
    const timeRange = parseFloat(nextTime - thisTime);
    const mappedCurrentTime = parseFloat(nextTime - currentTime);
    const percent = mappedCurrentTime / timeRange;
    return 1 - percent;
  };

  /**  
    Returns the size of the current item's line.
    If the time range of this item and the next is in the:
    -- past: return 1, 
    -- present: return percentage, 
    -- future: return -1;
  */
  const getLineSize = (timeA = nextTime) => {
    if (currentTime < timeA && currentTime > thisTime) {
      return getPercentageOfTimeRange();
    } else if (currentTime >= timeA) return 1;
    return -1;
  };

  /** Return remaining percentage of the time range */
  const remaining = () => {
    // 100% - 75% = 35%
    return 1 - getLineSize();
  };

  /** Set the dot color based on if the events start time is passed or not. */
  const setDotColor = () => {
    if (newColorValue != 100 && currentTime + 15000 >= thisTime) {
      setNewColorValue(100);
    }
    return currentTime >= thisTime;
  };

  setDotColor();

  /** Animates the dot color changes */
  Animated.timing(animation, {
    toValue: newColorValue,
    useNativeDriver: false,
    duration: 300,
  }).start();

  const isDay = (time) => {
    return parseFloat(time.replace(':', '.')) <= 18.0 && parseFloat(time.replace(':', '.')) >= 6.0;
  };
  const shouldAddMoonIcon = () => {
    let addMoon = false;
    if (notFirstItem()) {
      addMoon = isDay(lastTimeString);
    } else {
      addMoon = true;
    }

    return addMoon;
  };

  const shouldAddSunIcon = () => {
    let addSun = false;
    if (notFirstItem()) {
      addSun = isDay(lastTimeString);
    } else {
      addSun = false;
    }

    return addSun;
  };

  const getTimeIndicatorHeight = () => {
    let returnHeight = 0;

    if (notLastItem()) {
      if (!isDay(nextTimeString)) {
        returnHeight = getHalfHeight();
      } else {
        returnHeight = getHalfHeight();
      }
    } else {
      returnHeight = getHalfHeight();
    }

    return returnHeight;
  };

  /**
  
  RETURN 
  
  */

  return (
    <Animated.View
      style={[styles.day, { paddingBottom: getTimeDifference() }]}
      onLayout={(event) => measureView(event)}
    >
      {/* START TIME */}
      <View>
        {!isDay(item.startTime) && (
          <View
            style={[
              styles.nightIndicator,
              {
                height:
                  getHalfHeight() +
                  (isDay(lastTimeString)
                    ? getTimeDifference(thisTime, nightTimeStart) + 30
                    : !notFirstItem()
                    ? 40
                    : 20) +
                  (notLastItem() ? 35 : 0),
                top:
                  getTopPosition() -
                  (isDay(lastTimeString)
                    ? getTimeDifference(thisTime, nightTimeStart) + 15
                    : !notFirstItem()
                    ? 20
                    : 0),
              },
            ]}
          >
            {shouldAddMoonIcon() && (
              <Ionicons name="moon" size={15} style={styles.timeIcon} color={theme.colors.text} />
            )}
            {/* {shouldAddSunIcon() && (
              <Ionicons
                name="sunny"
                size={20}
                style={[
                  styles.timeIcon,
                  {
                    transform: [
                      { translateY: getTimeDifference() > 40 ? getTimeDifference() : 40 },
                    ],
                  },
                ]}
                color={theme.colors.text}
              />
            )} */}
          </View>
        )}
        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.timeText}>
          {get12HourTime(item.startTime).split(' ')[0]}
        </Text>
      </View>
      {/* DOT */}
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: animation.interpolate({
              inputRange: [0, 100],
              outputRange: [theme.colors.itemColor, theme.colors.accent],
            }),
            shadowColor: animation.interpolate({
              inputRange: [0, 100],
              outputRange: [theme.colors.itemColor, theme.colors.accent],
            }),
          },
        ]}
      >
        <View>
          {/* BLUE LINE */}
          <View
            style={[
              styles.line,
              {
                height: notLastItem()
                  ? getLineSize() * getHalfHeight()
                  : newColorValue == 100
                  ? 0
                  : 0,
                backgroundColor: theme.colors.accent,
                shadowColor: theme.colors.accent,
                elevation: 5,
              },
            ]}
          />
        </View>

        {/* GREY LINE */}
        <View
          style={[
            styles.line,
            {
              height: notLastItem() ? (remaining() < 1 ? remaining() : 1) * getHalfHeight() : 0,
              shadowColor: theme.colors.itemColor,
            },
            { backgroundColor: theme.colors.itemColor },
          ]}
        />

        {getLineSize() < 1 && getLineSize() > 0 && (
          <View style={[styles.bar, { top: getLineSize() * getHalfHeight() + 10 }]} />
        )}
      </Animated.View>
      {children}
    </Animated.View>
  );
}
/**
 * Styles for this view
 */
const styles = StyleSheet.create({
  currentTimeLine: {
    // position: 'absolute',
    marginTop: 23,
    transform: [
      { translateX: -10 },
      {
        translateY: 57.5 * 6.88,
      },
    ],
    zIndex: 10,
    width: 20,
    height: 2,
    backgroundColor: theme.colors.accent,
  },

  timeText: {
    paddingLeft: 20,
    marginRight: 10,
    fontSize: 16,
    width: 55,
    textAlign: 'center',
    color: theme.colors.text,
    alignSelf: 'center',
    marginTop: 18,
  },
  nightIndicator: {
    backgroundColor: theme.colors.itemColor,
    borderRadius: 5000,
    width: 50,
    left: 12,
    position: 'absolute',
    elevation: -1,

    // transform: [{ scaleY: 300 }],
  },

  timeIcon: {
    alignSelf: 'center',
    marginTop: 15,
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
    marginTop: 22,
    alignSelf: 'flex-start',
    borderRadius: 50000,
    elevation: 3,
    overflow: 'visible',
  },

  bar: {
    width: 8,
    alignSelf: 'center',
    position: 'absolute',
    height: 2,
    backgroundColor: theme.colors.accent,
    borderRadius: 50000,
    elevation: 5,
    shadowColor: theme.colors.accent,
    shadowOpacity: 1,
  },

  line: {
    position: 'relative',
    alignSelf: 'center',
    top: 10,
    borderColor: theme.colors.itemColor,
    backgroundColor: theme.colors.itemColor,
    width: 2,
    height: 0,

    elevation: 3,
  },
});
