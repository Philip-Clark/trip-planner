import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { editItem } from './dataHandler';
import { StatusBar } from 'expo-status-bar';
import { theme } from './Styles';
export default function Header({
  children,
  title,
  navigation,
  back = true,
  deleteHandler,
  subtitle = '',
  editable,
  route,
}) {
  return (
    <View style={styles.header}>
      <StatusBar style="dark" />
      {back ? (
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack(null)}>
          <Feather name="chevron-left" size={30} style={styles.delete} />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <View style={styles.titles}>
        {subtitle != '' ? <Text style={styles.subTitle}>{subtitle}</Text> : <></>}
        {editable ? (
          <TextInput
            style={[styles.title, styles.editable]}
            defaultValue={title}
            onChangeText={(Text) => {
              let dat = route.data;
              dat.name = Text;
              editItem('event', route.trace, dat, () => {});
            }}
          />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>
      {back ? (
        <TouchableOpacity
          style={styles.delete}
          onPress={() => {
            Alert.alert('Delete', `Are you sure you want to delete this item?\nItem: ${title}`, [
              { text: 'Delete', onPress: deleteHandler, style: 'destructive' },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
        >
          {deleteHandler != undefined ? (
            <Feather name="trash-2" size={30} style={styles.delete}></Feather>
          ) : (
            <></>
          )}
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <View style={styles.right}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    borderColor: theme.colors.itemColor,
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  right: {
    marginLeft: 'auto',
    marginRight: 0,
    justifyContent: 'center',
  },

  back: {
    height: '100%',
    width: 30,
  },

  titles: {
    marginLeft: 10,
    width: '75%',
  },

  subTitle: {
    color: theme.colors.text,
    opacity: 0.5,
    fontSize: 20,
    lineHeight: 20,
  },

  editable: {
    borderColor: theme.colors.text,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: theme.sizes.borderRadius,
    textAlign: 'left',
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 35,
    color: theme.colors.text,
    textAlign: 'left',
  },

  backText: {
    fontSize: 30,
    color: theme.colors.text,
  },
  delete: {
    color: theme.colors.text,
    right: 0,
    lineHeight: 29,
    height: '100%',
    textAlignVertical: 'center',
    position: 'absolute',
  },
});
