import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useEffect, useState } from 'react';
import Header from './Header';
import { getData, storeData } from './dataHandler';
import SlideInView from './slideView';

export default function Trips({ navigation }) {
  const [data, setData] = useState([]);
  const [trace, setTrace] = useState({ tripID: '', dayID: '', eventID: '' });

  const navigateToTrip = async (tripData) => {
    navigation.navigate('Trip', {
      tripData: tripData,
      trace: { tripID: tripData.id, dayID: '', eventID: '' },
    });
  };

  const updateData = async () => {
    console.log('updateData in Trips');
    getData().then((response) => {
      setData(response);
    });
  };

  // Update data on navigation focus
  useEffect(() => {
    updateData();
    return navigation.addListener('focus', () => {
      updateData();
    });
  }, []);

  // storeData([], () => {}); // WIPE DATA

  return (
    <View style={styles.container}>
      <Header title={'Trips'} back={false} />
      <FlatList
        style={styles.trips}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToTrip(item)} style={{ overflow: 'visible' }}>
            <SlideInView duration={400} start={400} end={0} offset={data.indexOf(item)}>
              <View style={[styles.tripItem]}>
                <Text style={styles.tripText}>{item.name}</Text>
                <Text style={styles.tripText}>
                  {item.leaveDate.slice(5)} - {item.returnDate.slice(5)}
                </Text>
              </View>
            </SlideInView>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => navigation.navigate('AddTrip', { trace: trace })}>
        <View style={styles.tripItem}>
          <Text style={styles.add}>Add Trip</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
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
    overflow: 'visible',
  },
  tripText: {
    fontSize: 16,
    color: '#5c5c5c',
  },
  trips: {
    overflow: 'visible',
  },
  add: {
    flex: 1,
    textAlign: 'center',
  },
});
