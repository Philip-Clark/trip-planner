import { StyleSheet, Text, TextInput, View } from 'react-native';
import { editItem, removeItem } from './dataHandler';
import Header from './Header';

/**
 * Displays the details of the event.
 */
export default function Event({ route, navigation }) {
  /**
   * When the delete button is pressed, the event is removed from the database and the user is returned
   * to the previous screen.
   */
  const deleteEvent = () => {
    removeItem('event', route.params.trace, route.params.data, () => navigation.goBack(null));
  };
  return (
    <View style={[styles.container, route.params.editMode && styles.editModeContainer]}>
      <Header
        title={route.params.data.name}
        navigation={navigation}
        deleteHandler={route.params.editMode ? deleteEvent : undefined}
        editable={route.params.editMode}
        route={route.params}
      />
      {route.params.editMode ? (
        <View>
          {/* <View style={{ alignSelf: 'flex-start' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',

                justifyContent: 'space-between',
              }}
            >
              <Text style={{ textAlign: 'right' }}>Arrival</Text>
              <TextInput
                style={[
                  styles.text,
                  styles.editable,
                  { alignSelf: 'flex-start', marginLeft: 10, width: 60 },
                ]}
                multiline={true}
                defaultValue={route.params.data.startTime}
                onChangeText={(Text) => {
                  let dat = route.params.data;
                  dat.data = Text;
                  editItem('event', route.params.trace, dat, () => {});
                }}
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ textAlign: 'right' }}>Departure</Text>
              <TextInput
                style={[
                  styles.text,
                  styles.editable,
                  { alignSelf: 'flex-start', marginLeft: 10, width: 60 },
                ]}
                multiline={true}
                defaultValue={route.params.data.departure}
                onChangeText={(Text) => {
                  let dat = route.params.data;
                  dat.data = Text;
                  editItem('event', route.params.trace, dat, () => {});
                }}
              />
            </View>
          </View> */}

          <TextInput
            style={[styles.text, styles.editable]}
            multiline={true}
            defaultValue={route.params.data.data}
            onChangeText={(Text) => {
              let dat = route.params.data;
              dat.data = Text;
              editItem('event', route.params.trace, dat, () => {});
            }}
          />
        </View>
      ) : (
        <Text style={styles.text}>{route.params.data.data}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 35,
  },

  editModeContainer: {
    borderColor: '#67dfe8',
    borderWidth: 5,
    padding: 15,
  },
  text: {
    fontSize: 16,
    color: '#828282',
  },

  editable: {
    borderColor: '#969696',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
});
