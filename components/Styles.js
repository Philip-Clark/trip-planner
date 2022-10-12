import { StyleSheet } from 'react-native';

export const theme = {
  style: StyleSheet.create({
    leftButton: {
      alignSelf: 'flex-start',
      fontWeight: 'normal',
    },

    bottomButton: {
      justifyContent: 'center',
      position: 'absolute',
      marginHorizontal: 20,
      bottom: 30,
    },
    centerText: {
      alignSelf: 'center',
    },
  }),
  colors: {
    white: 'white',
    itemColor: '#f5f5f5ff',
    // itemColor: '#ff03ddff',
    text: '#5c5c5c',
    modalBackground: '#00000037',
    accent: '#67dfe8',
  },
  sizes: {
    borderRadius: 5,
    // borderRadius: 50,
  },
};
