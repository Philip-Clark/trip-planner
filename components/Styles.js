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
  //   white: '#252525',
  //   itemColor: '#363636',
  //   text: '#afafaf',
  //   modalBackground: '#00000066',
  //   accent: '#d55252',
  // },

  sizes: {
    borderRadius: 5,
    standardElevation: 0.0,
    // borderRadius: 50,
  },
};
