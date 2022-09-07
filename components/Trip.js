import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightBase,
  TouchableOpacity,
  View,
} from 'react-native';
import addItem, { getData, removeItem } from './dataHandler';
import Header from './Header';
import SlideInView from './slideView';

/**
 * =============================================================================
 * -----------
 * Trip view
 * -----------
 *
 * Displays a list of the days of the trip
 *
 * Allows for trip deletion
 * =============================================================================
 */
export default function Trip({ route, navigation }) {
  const [tripData, setTripData] = useState({});
  const [tripDate, setTripDate] = useState(new Date());
  const trace = route.params.trace;
  const isFocused = useIsFocused();

  const updateData = async () => {
    console.log('updateData in Days');

    getData().then((response) => {
      setTripData(response[trace.tripID - 1]);
    });

    setTripDate(
      new Date(
        `${route.params.tripData.leaveDate.split('/')[1]}/${
          route.params.tripData.leaveDate.split('/')[2]
        }/${route.params.tripData.leaveDate.split('/')[0]}`
      )
    );
  };

  useEffect(() => {
    updateData();
    return navigation.addListener('focus', () => {
      updateData();
    });
  }, []);

  Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const navigateToDay = async (dayData) => {
    route.params.trace.dayID = dayData.id;
    const date = tripDate.addDays(parseInt(dayData.id) - 1);

    console.log(date);
    navigation.navigate('Day', {
      dayData: dayData,
      trace: route.params.trace,
      date: date.toString(),
    });
  };

  const deleteTrip = async () => {
    removeItem('trip', route.params.trace, tripData, () => navigation.goBack(null));
  };

  return (
    <View style={styles.container}>
      <Header
        title={tripData.name}
        backTo={'Trip'}
        navigation={navigation}
        deleteHandler={deleteTrip}
      />

      <FlatList
        style={styles.trips}
        data={tripData.days}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDay(item)}>
            <SlideInView duration={400} start={400} end={0} offset={tripData.days.indexOf(item)}>
              <View style={styles.tripItem}>
                <Text style={styles.tripText}>Day {item.id}</Text>
                <Text style={styles.tripText}>
                  {moment(tripDate.addDays(parseInt(item.id) - 1), 'YYYYMMDD').format('dddd')}
                  {', '}
                  {tripDate.addDays(parseInt(item.id) - 1).getDate()}
                </Text>
              </View>
            </SlideInView>
          </TouchableOpacity>
        )}
      />
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
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#5c5c5c',
    borderColor: '#f5f5f5ff',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },

  tripItem: {
    backgroundColor: '#f5f5f5ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  tripText: {
    fontSize: 16,
    color: '#5c5c5c',
  },

  add: {
    flex: 1,
    textAlign: 'center',
  },
});
