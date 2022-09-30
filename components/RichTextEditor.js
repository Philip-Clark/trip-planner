import { useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Feather, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';

export default function RichTextEditor({ callback, defaultValue, placeholder }) {
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
      <ScrollView style={{ height: '80%' }}>
        <RichEditor
          ref={richText} // from useRef()
          onChange={(text) => {
            callback(text);
          }}
          initialContentHTML={defaultValue}
          placeholder={placeholder}
          androidHardwareAccelerationDisabled={true}
          // style={styles.richTextEditorStyle}
          initialHeight={300}
        />
      </ScrollView>

      <RichToolbar
        editor={richText}
        selectedIconTint="#873c1e"
        iconTint="#312921"
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.setStrikethrough,
          actions.setUnderline,
          'addImage',
          actions.size,
        ]}
        iconMap={{
          addImage: ({ tintColor }) => (
            <Ionicons name="image" size={24} color="black" style={[{ color: tintColor }]} />
          ),
        }}
        addImage={() => {
          pickImage();
        }}
      />
    </KeyboardAvoidingView>
  );
}
