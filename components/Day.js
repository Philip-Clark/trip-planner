import { Feather, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getData, removeItem } from './dataHandler';
import { renderers } from 'react-native-popup-menu';
import React, { useEffect, useState } from 'react';
import { get12HourTime } from './timeConvert';
import EventTimeLine from './EventTimeLine';
import OpacityButton from './OpacityButton';
import SlideInView from './slideView';
import { theme } from './Styles';
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
  const [expandAddMenu, setExpandAddMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tripName, setTripName] = useState('');
  const [dayData, setDayData] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [events, setEvents] = useState([]);
  const [time, setTime] = useState();
  const trace = route.params.trace;

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

  const navigateTo = async (location, eventData) => {
    route.params.trace.eventID = eventData.id;
    navigation.navigate(location, {
      data: eventData,
      trace: route.params.trace,
      date: route.params.date,
      editMode: editMode,
    });
  };

  const notLast = (events, item) => {
    return events.indexOf(item) < events.length - 1;
  };

  const nextIsTravel = (events, item) => {
    return (
      events[events.indexOf(item) + 1].type === 'travel' ||
      events[events.indexOf(item) + 1].type === 'drive'
    );
  };

  const updateData = () => {
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
  return (
    <View style={[styles.container, editMode && styles.editModeContainer]}>
      <Header
        title={`Day ${dayData.id}`}
        backTo={'Trip'}
        navigation={navigation}
        subtitle={tripName}
        style={{ marginLeft: 20 }}
      >
        {editMode ? (
          <OpacityButton
            text={'Save'}
            buttonStyle={styles.saveButton}
            textStyle={styles.saveText}
            onPress={() => setEditMode(!editMode)}
          >
            <MaterialCommunityIcons name="lock-outline" size={26} color={theme.colors.white} />
          </OpacityButton>
        ) : (
          <Menu renderer={renderers.ContextMenu}>
            <MenuTrigger>
              <Feather
                name="more-horizontal"
                size={30}
                style={styles.options}
                color={theme.colors.text}
              />
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
        contentContainerStyle={{ paddingBottom: 300, paddingTop: 50 }}
        renderItem={({ item }) =>
          /* A custom component that is used to animate the events. */
          item.type != 'travel' &&
          item.name != '' && (
            <SlideInView offset={1}>
              {/* EVENT */}
              <EventTimeLine item={item} eventUnsorted={events} date={route.params.date}>
                {/* EVENT CARD */}
                <View style={styles.locationAndTravel}>
                  <TouchableOpacity
                    style={styles.dayCard}
                    onPress={() => navigateTo('Event', item)}
                  >
                    <View style={styles.dayItem}>
                      <Text style={styles.dayText}>{item.name}</Text>
                      <Text style={styles.departure}>
                        {item.departure != '' && (
                          <MaterialCommunityIcons
                            name="clock"
                            size={12}
                            color={theme.colors.text}
                          />
                        )}
                        {item.departure != '' && get12HourTime(item.departure)}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {
                    // Display travel information
                    notLast(events, item) && nextIsTravel(events, item) ? (
                      editMode ? (
                        <Menu renderer={renderers.ContextMenu}>
                          <MenuTrigger>
                            <Text style={styles.travel}>
                              <MaterialCommunityIcons
                                name="car"
                                size={16}
                                color={theme.colors.text}
                              />
                              {events[events.indexOf(item) + 1].duration}
                            </Text>
                          </MenuTrigger>
                          <MenuOptions customStyles={MenuStyle}>
                            <MenuOption
                              onSelect={() => {
                                let newTrace = trace;
                                newTrace.eventID =
                                  parseFloat(item.startTime.replace(':', '')) + 0.1;
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
                          <MaterialCommunityIcons name="car" size={16} color={theme.colors.text} />
                          {events[events.indexOf(item) + 1].duration}
                        </Text>
                      )
                    ) : (
                      <View style={{ height: 16 }}></View>
                    )
                  }
                </View>
              </EventTimeLine>
            </SlideInView>
          )
        }
      ></FlatList>

      {/* Fade out list view */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', theme.colors.white]}
        style={styles.gradient}
      />

      {/* Add event Button */}
      {editMode && (
        <View style={styles.addList}>
          {expandAddMenu && (
            <View>
              <OpacityButton
                onPress={() => navigateTo('AddEvent', { dayData: dayData })}
                buttonStyle={styles.addOption}
                text={'Location'}
              >
                <SimpleLineIcons name="location-pin" size={16} style={styles.icon} />
              </OpacityButton>

              <OpacityButton
                onPress={() => navigateTo('AddTravel', { dayData: dayData })}
                style={styles.addOption}
                buttonStyle={styles.addOption}
                text={'Travel Time'}
              >
                <Ionicons name="car" size={16} style={styles.icon} />
              </OpacityButton>
            </View>
          )}

          <TouchableOpacity onPress={() => setExpandAddMenu(!expandAddMenu)} style={styles.add}>
            <View>
              <Feather name="plus" size={30} style={{ color: theme.colors.white }} />
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
    borderColor: theme.colors.white,
    borderWidth: 5,
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 15,
    paddingLeft: 0,
  },

  icon: {
    color: theme.colors.text,
    marginRight: 10,
  },
  locationAndTravel: {
    flex: 1,
    transform: [{ translateY: 8 }],
    alignContent: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  editModeContainer: {
    borderColor: theme.colors.accent,
  },

  saveButton: {
    paddingVertical: 6,
    marginVertical: 0,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.accent,
    borderRadius: 500,
    elevation: 20,
    shadowColor: theme.colors.accent,
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
    backgroundColor: theme.colors.itemColor,
  },

  addOptionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  saveText: {
    color: theme.colors.white,
    padding: 5,
  },

  dayItem: {
    backgroundColor: theme.colors.itemColor,
    display: 'flex',
    // flexDirection: '',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
    marginVertical: 5,
    elevation: theme.sizes.standardElevation,
    marginHorizontal: 5,
  },

  departure: {
    fontSize: 12,
    color: theme.colors.text,
  },

  addEvent: {
    backgroundColor: theme.colors.itemColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
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
    color: theme.colors.text,
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
    color: theme.colors.text,
  },

  add: {
    backgroundColor: theme.colors.accent,
    borderRadius: 5000,
    padding: 20,
    color: theme.colors.text,
    alignSelf: 'flex-end',
    elevation: 5,
    shadowColor: theme.colors.accent,
  },
});

const MenuStyle = {
  optionsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 25,
    width: 150,
    backgroundColor: theme.colors.white,
    borderRadius: theme.sizes.borderRadius,
  },

  optionsWrapper: {},
  optionWrapper: {
    margin: 5,
  },
  optionTouchable: {
    activeOpacity: 0,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
};
