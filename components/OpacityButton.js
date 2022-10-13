import { Children } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from './Styles';

export default function OpacityButton({ text, onPress, textStyle, buttonStyle, children }) {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      {children}
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: theme.colors.itemColor,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: theme.sizes.borderRadius,
    marginVertical: 5,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'normal',
    alignSelf: 'center',
    color: theme.colors.text,
  },
});
