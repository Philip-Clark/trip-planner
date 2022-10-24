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
import { Table, Row, Rows } from 'react-native-table-component';
import { useEffect, useState, setState } from 'react';
import Header from './Header';
import addItem, { getData, storeData, removeItem } from './dataHandler';
import SlideInView from './slideView';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment/moment';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { renderers } from 'react-native-popup-menu';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from './Styles';
import { parsInputFile } from './csvImporter';

export default function Trips({ navigation }) {
  const [data, setData] = useState([]);
  const [trace, setTrace] = useState({ tripID: '', dayID: '', eventID: '' });
  const [refresh, setRefresh] = useState(0);
  const [showDataStructure, setShowDataStructure] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importFile, setImportFile] = useState('');

  const DemoData = {
    headers: ['Type', 'Date', 'Arrival', 'Departure', 'Title', 'Info', 'Duration'],
    rows: [
      ['Event', 'MM/DD/YYYY', '15:00', '15:30', 'Event Title', 'html/text', ''],
      ['Drive', 'MM/DD/YYYY', '', '', '', '', 'hh:mm'],
    ],
  };

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
            {/* <View style={styles.dataStructurePrompt}>
              <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                Acceptable Data Structure
              </Text>

              <Table
                borderStyle={{ borderWidth: 1, borderColor: theme.text }}
                style={styles.dataTable}
              >
                <Row data={DemoData.headers} style={styles.headerRow} textStyle={styles.dataText} />
                <Rows data={DemoData.rows} style={styles.rows} textStyle={styles.dataText} />
              </Table>
            </View> */}

            <TouchableOpacity style={styles.done} onPress={pickFile}>
              <Text style={styles.fileName}>
                {importFile != '' ? importFile.name : 'Pick File'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.done}
              onPress={() => {
                setImportModalVisible(false);

                parsInputFile(importFile, () => {
                  updateData();
                  setRefresh((refresh) => refresh + 1);
                });
              }}
            >
              <Text style={styles.doneText}>Import CSV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Header title={'Trips'} back={false}>
        <TouchableOpacity
          style={styles.importIcon}
          onPress={() => {
            setImportModalVisible(true);
          }}
        >
          <MaterialCommunityIcons name="import" size={30} style={styles.options} />
        </TouchableOpacity>
        {/* <Menu renderer={renderers.ContextMenu}>
          <MenuTrigger>
            <MaterialCommunityIcons name="import" size={30} style={styles.options} />
          </MenuTrigger>
          <MenuOptions customStyles={MenuStyle}>
            <MenuOption
              onSelect={() => {
                setImportModalVisible(true);
              }}
              text="Import CSV"
            />
          </MenuOptions>
        </Menu> */}
      </Header>
      <FlatList
        showsVerticalScrollIndicator={false}
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
          <Feather name="plus" size={30} style={{ color: theme.colors.white }} />
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

  optionsIcon: {
    marginVertical: 7.5,
    color: theme.colors.text,
    width: 32,
  },

  dataStructurePrompt: {
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: theme.colors.itemColor,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: theme.sizes.borderRadius,
  },
  dataTable: {},
  dataText: {
    fontSize: 10,
    textAlign: 'center',
  },
  tripItem: {
    backgroundColor: theme.colors.itemColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: theme.sizes.borderRadius,
    marginVertical: 5,
    elevation: theme.sizes.standardElevation,
  },

  options: {
    color: theme.colors.text,
    marginRight: 10,
  },
  tripText: {
    fontSize: 16,
    paddingVertical: 15,

    color: theme.colors.text,
  },
  trips: {
    overflow: 'visible',
  },

  add: {
    position: 'absolute',
    backgroundColor: theme.colors.accent,
    borderRadius: 5000,
    bottom: 0,
    right: 0,
    margin: 20,
    padding: 20,
    color: theme.colors.text,
  },
  modalDimmer: {
    flex: 1,
    backgroundColor: '#00000098',
  },
  modal: {
    borderRadius: theme.sizes.borderRadius,
    alignContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    margin: 30,
    padding: 20,
    marginVertical: 150,
  },

  fileName: {
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingVertical: 40,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
    margin: 1,
    textAlign: 'center',
    borderColor: theme.colors.text,
    color: theme.colors.text,
  },

  done: {
    backgroundColor: theme.colors.itemColor,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
    margin: 10,
  },

  doneText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});

const MenuStyle = {
  optionsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 25,
    width: 100,
    backgroundColor: theme.colors.itemColor,
    borderRadius: theme.sizes.borderRadius,
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
    color: theme.colors.text,
  },
};
