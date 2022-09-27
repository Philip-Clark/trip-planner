import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useEffect, useState, setState } from 'react';
import Header from './Header';
import { getData, storeData, removeItem } from './dataHandler';
import SlideInView from './slideView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Feather } from '@expo/vector-icons';
import moment from 'moment/moment';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { renderers } from 'react-native-popup-menu';

export default function Trips({ navigation }) {
  const [data, setData] = useState([]);
  const [trace, setTrace] = useState({ tripID: '', dayID: '', eventID: '' });
  const [refresh, setRefresh] = useState(0);

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

  /**
   * Removes the trip from the data file
   */
  const deleteTrip = async () => {
    removeItem('trip', trace, '', () => {
      updateData();
      setRefresh((refresh) => refresh + 1);
    });
  };

  // storeData([], () => {}); // WIPE DATA

  return (
    <View style={styles.container}>
      <Header title={'Trips'} back={false} />
      <FlatList
        style={styles.trips}
        data={data}
        renderItem={({ item }) => (
          <SlideInView
            duration={400}
            start={400}
            end={0}
            offset={data.indexOf(item)}
            style={styles.tripItem}
          >
            <View style={[styles.tripItem]}>
              <TouchableOpacity
                onPress={() => navigateToTrip(item)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '90%',

                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.tripText}>{item.name}</Text>
                <Text style={styles.tripText}>
                  {}
                  {moment(item.leaveDate.slice(5), 'MMDD').format('MMM[.] Do')}
                </Text>
              </TouchableOpacity>

              <Menu renderer={renderers.ContextMenu}>
                <MenuTrigger>
                  <Feather name="more-horizontal" size={32} style={styles.optionsIcon} />
                </MenuTrigger>
                <MenuOptions customStyles={MenuStyle}>
                  <MenuOption onSelect={() => {}} text="Edit Trip" />
                  <MenuOption
                    onSelect={() => {
                      deleteTrip();
                    }}
                    text="Delete Trip"
                  />
                </MenuOptions>
              </Menu>
            </View>
          </SlideInView>
        )}
      />
      <TouchableOpacity
        style={styles.add}
        onPress={() => navigation.navigate('AddTrip', { trace: trace })}
      >
        <View>
          <Feather name="plus" size={30} style={{ color: 'white' }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tripCard: {
    display: 'flex',
    flexDirection: 'row',
  },
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

  optionsIcon: {
    marginVertical: 7.5,
    color: '#5c5c5c',
    width: 32,
  },

  tripItem: {
    backgroundColor: '#f5f5f5ff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  tripText: {
    fontSize: 16,
    paddingVertical: 15,

    color: '#5c5c5c',
  },
  trips: {
    overflow: 'visible',
  },

  add: {
    position: 'absolute',
    backgroundColor: '#7ff8f8',
    borderRadius: 5000,
    bottom: 0,
    right: 0,
    margin: 20,
    padding: 20,
    color: '#5c5c5c',
  },
});

const MenuStyle = {
  optionsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 25,
    width: 100,
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
