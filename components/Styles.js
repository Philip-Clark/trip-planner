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
    white: '#ffffff',
    itemColor: '#f5f5f5ff',
    text: '#5c5c5c',
    modalBackground: '#00000037',
    accent: '#67dfe8',
  },
  // ? DARK theme
  // colors: {
  //   white: '#1d1e23',
  //   itemColor: '#171717ff',
  //   text: '#9e9e9e',
  //   modalBackground: '#00000066',
  //   accent: '#408f82',
  // },

  sizes: {
    borderRadius: 5,
    // borderRadius: 50,
  },
};
