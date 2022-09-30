import {
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useEffect, useState, setState } from 'react';
import Header from './Header';
import addItem, { getData, storeData, removeItem } from './dataHandler';
import SlideInView from './slideView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Feather } from '@expo/vector-icons';
import moment from 'moment/moment';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { renderers } from 'react-native-popup-menu';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { importCSV } from './csvHandler';
import { usePapaParse } from 'react-papaparse';

export default function Trips({ navigation }) {
  const [data, setData] = useState([]);
  const [trace, setTrace] = useState({ tripID: '', dayID: '', eventID: '' });
  const [refresh, setRefresh] = useState(0);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importFile, setImportFile] = useState('');
  const [importFileString, setImportFileString] = useState('');
  const { readString } = usePapaParse();

  const navigateToTrip = async (tripData) => {
    navigation.navigate('Trip', {
      tripData: tripData,
      trace: { tripID: tripData.id, dayID: '', eventID: '' },
    });
  };

  const pickFile = async () => {
    DocumentPicker.getDocumentAsync({ type: ['text/*'] }).then((response) => {
      setImportFile(response);
    });
  };

  const parsInputFile = async () => {
    let tripId = -1;
    let dayId = 0;
    // console.log(importFile);
    await FileSystem.readAsStringAsync(importFile.uri).then((response) => {
      readString(response, {
        header: ['Type', 'Date', 'Arrival', 'Departure', 'Title', 'Info', 'Duration'],
        complete: function (results) {
          addItem(
            'trip',
            {
              name: importFile.name,
              startDate: results.data[0].Date,
              endDate: results.data[results.data.length - 2].Date,
              imported: true,
            },
            undefined,
            async (data) => {
              await iterativelyAddEvent(data, results, tripId, dayId).then(() => {
                updateData();
                setRefresh((refresh) => refresh + 1);
              });
            }
          );
        },
      });
    });
  };

  const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  const iterativelyAddEvent = async (data, results, tripId, dayId) => {
    console.log(results.data);
    tripId = parseInt(data.length);
    await asyncForEach(results.data, async (element, i) => {
      if (i > 0 && i < results.data.length - 1) {
        if (element.Date != results.data[i - 1].Date) {
          dayId += 1;
        }
      }
      console.log('2');
      try {
        let event = {
          title: element.Title,
          description: element.Info,
          time: element.Departure,
          startTime: element.Arrival,
          type: element.Type.toLowerCase(),
          duration: element.Duration,
        };

        if (element.Arrival == '') {
          if (element.Title == '') {
            event.startTime = results.data[i - 1].Arrival.split(' ')[0] + '.1';
          } else {
            event.startTime = results.data[i - 1].Arrival.split(' ')[0];
          }
        }
        await addItem('event', event, { tripID: tripId, dayID: dayId + 1 }, () => {});
      } catch (e) {}
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
      {/* Import Modal */}
      <Modal
        visible={importModalVisible}
        transparent={true}
        onRequestClose={() => {
          setImportModalVisible(false);
        }}
      >
        <View style={styles.modalDimmer}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.done} onPress={pickFile}>
              <Text style={styles.fileName}>
                {importFile != '' ? importFile.name : 'Pick File'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.done}
              onPress={() => {
                setImportModalVisible(false);
                parsInputFile();
              }}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Header title={'Trips'} back={false}>
        <Menu renderer={renderers.ContextMenu}>
          <MenuTrigger>
            <Feather name="more-horizontal" size={30} style={styles.options} />
          </MenuTrigger>
          <MenuOptions customStyles={MenuStyle}>
            <MenuOption
              onSelect={() => {
                setImportModalVisible(true);
              }}
              text="Import CSV"
            />
          </MenuOptions>
        </Menu>
      </Header>
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
  modalDimmer: {
    flex: 1,
    backgroundColor: '#00000098',
  },
  modal: {
    borderRadius: 10,
    alignContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
    margin: 50,
    padding: 30,
    marginVertical: 100,
  },

  fileName: {
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingVertical: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 1,
    textAlign: 'center',
  },

  done: {
    backgroundColor: '#f5f5f5ff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 10,
  },

  doneText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
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
