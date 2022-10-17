import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getData, removeItem } from './dataHandler';
import { useEffect, useState } from 'react';
import SlideInView from './slideView';
import Header from './Header';
import moment from 'moment';
import { theme } from './Styles';

/**
 * Renders a list of days
 * @returns A view that contains a header and a flatList.
 */
export default function Trip({ route, navigation }) {
  const [tripData, setTripData] = useState({});
  const [tripDate, setTripDate] = useState(new Date());
  const trace = route.params.trace;

  /**
   * UpdateData is an async function that gets the data from the data file and then sets the tripData
   * state to the data that is returned. It also converts the date from the format mm/dd/yyyy to
   * yyyy/mm/dd.
   */
  const updateData = async () => {
    console.log('updateData in Days');
    getData().then((response) => {
      setTripData(response[trace.tripID - 1]);
    });
    /* Converting the date from the format mm/dd/yyyy to yyyy/mm/dd. */
    setTripDate(
      new Date(
        `${route.params.tripData.leaveDate.split('/')[1]}/${
          route.params.tripData.leaveDate.split('/')[2]
        }/${route.params.tripData.leaveDate.split('/')[0]}`
      )
    );
  };

  /**
   * A react hook that is used to update the data when the screen is focused.
   * */
  useEffect(() => {
    updateData();
    return navigation.addListener('focus', () => {
      updateData();
    });
  }, []);

  /**
   * Adding a function to the Date prototype.
   * Handles converting future dates to real dates
   */
  Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  /**
   * NavigateToDay is a function that takes in a dayData object and navigates to the Day screen, passing
   * in the dayData object, a trace object, and a date object.
   */
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

  /**
   * Removes the trip from the data file and then navigates back to the previous screen.
   */
  const deleteTrip = async () => {
    removeItem('trip', route.params.trace, tripData, () => navigation.goBack(null));
  };

  return (
    <View style={styles.container}>
      <Header
        title={tripData.name}
        backTo={'Trip'}
        navigation={navigation}
        // deleteHandler={deleteTrip}
      />
      {/* Rendering a list of days. */}
      <FlatList
        data={tripData.days}
        renderItem={({ item }) => (
          /* A Button that is used to navigate to the next screen. */
          <TouchableOpacity onPress={() => navigateToDay(item)}>
            <SlideInView duration={400} start={400} end={0} offset={tripData.days.indexOf(item)}>
              <View style={styles.tripItem}>
                {/* Rendering the day number. */}
                <Text style={styles.tripText}>Day {item.id}</Text>
                {/* Rendering the day of the week and the date. */}
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
    backgroundColor: theme.colors.white,
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.colors.text,
    borderColor: theme.colors.itemColor,
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },

  tripItem: {
    backgroundColor: theme.colors.itemColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
    marginVertical: 5,
    elevation: theme.sizes.standardElevation,
    marginHorizontal: 5,
  },
  tripText: {
    fontSize: 16,
    color: theme.colors.text,
  },

  add: {
    flex: 1,
    textAlign: 'center',
  },
});
