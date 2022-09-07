import { StyleSheet, Text, View } from 'react-native';
import { removeItem } from './dataHandler';
import Header from './Header';

export default function Event({ route, navigation }) {
  const deleteEvent = () => {
    removeItem('event', route.params.trace, route.params.data, () => navigation.goBack(null));
  };

  return (
    <View style={styles.container}>
      <Header title={route.params.data.name} navigation={navigation} deleteHandler={deleteEvent} />
      <Text style={styles.text}>{route.params.data.data}</Text>
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
  text: {
    fontSize: 16,
    color: '#5c5c5c',
  },
});
