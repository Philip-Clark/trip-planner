import { useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

export default function RichTextEditor({ callback, defaultValue }) {
  const richText = useRef();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log('RESPONSE:\n', result);

    if (!result.cancelled) {
      richText.current?.insertImage(result.uri);
    }
  };

  return (
    <View>
      <RichEditor
        ref={richText} // from useRef()
        onChange={(text) => {
          callback(text);
        }}
        initialContentHTML={defaultValue}
        androidHardwareAccelerationDisabled={true}
        // style={styles.richTextEditorStyle}
        initialHeight={250}
      />

      <RichToolbar
        editor={richText}
        selectedIconTint="#873c1e"
        iconTint="#312921"
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          'addImage',
          actions.insertLink,
          actions.setStrikethrough,
          actions.setUnderline,
        ]}
        iconMap={{ addImage: <Text>I</Text> }}
        addImage={() => {
          pickImage();
        }}
        // style={styles.richTextToolbarStyle}
      />
    </View>
  );
}
