import { useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Feather, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  KeyboardAvoidingView,
  Text,
  View,
  Modal,
  TextArea,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { getLinkPreview, getPreviewFromContent } from 'link-preview-js';
import RenderHTML from 'react-native-render-html';

export default function RichTextEditor({ callback, defaultValue, placeholder }) {
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [linkRaw, setLinkRaw] = useState();
  const [code, setCode] = useState();
  const [linkData, setLinkData] = useState();
  const richText = useRef();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log('RESPONSE:\n', result);

    if (!result.cancelled) {
      richText.current?.insertImage(result.uri);
    }
  };

  const getNewLinkPreview = (link) => {
    getLinkPreview(link).then((data) => {
      setLinkRaw(data);
      setLinkData(`
      <a href="${
        data.url
      }"><div style="display: flex;height:120px; flex-direction:row; text-decoration:none; background-color: #f5f5f5ff; border-radius:10px">
      <img
        src="${data.mediaType == 'website' ? data.favicons[0] : data.images[0]}"
        style="width: 100px;height:100px; margin: 10px;"
      />
      <div style="padding: 5px; width: 250px; overflow: hidden;">
        <h1
          style="
            height: 24px;
            margin:0;
            padding:0;
            font-size: 24px;
            color: black;
            width: 90%;
            text-overflow: ellipsis;
          "
        >
          ${data.title}
        </h1>
        <hr style="width:80%;margin:5px 0px;">
        <h2 style="
        font-size: 16px; 
        color: #616161;
        width: 90%; 
        text-overflow: ellipsis; 
        margin:0;
        padding:0; 
        margin-bottom:5px;
        height:48px;
        
        ">
          ${data.description}
        </h2>

        <h3 style="font-size: 16px; color: #909090;height:16px;margin:0;">
          ${data.url}
        </h3>
      </div>
    </div></a><br><br>`);
      console.debug(data);
    });
  };

  const handleLink = () => {};

  return (
    <View style={{ display: 'flex', flexDirection: 'column-reverse' }}>
      <ScrollView>
        <View style={{ marginBottom: 100, paddingBottom: 300 }}>
          <RichEditor
            ref={richText} // from useRef()
            onChange={(text) => {
              callback(text);
            }}
            initialContentHTML={defaultValue}
            placeholder={placeholder}
            androidHardwareAccelerationDisabled={true}
            initialHeight={100}
            allowsLinkPreview={true}
          />
        </View>
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
          actions.setStrikethrough,
          actions.setUnderline,
          'blank',
          'addCode',
          'addLink',
          'addImage',
        ]}
        iconMap={{
          addImage: ({ tintColor }) => (
            <Ionicons name="image" size={24} color="black" style={[{ color: tintColor }]} />
          ),

          addLink: ({ tintColor }) => (
            <Ionicons name="link" size={24} color="black" style={[{ color: tintColor }]} />
          ),

          addCode: ({ tintColor }) => (
            <Ionicons name="code-slash" size={24} color="black" style={[{ color: tintColor }]} />
          ),
        }}
        addImage={() => {
          pickImage();
        }}
        addLink={() => {
          setLinkModalVisible(true);
        }}
        addCode={() => {
          setCodeModalVisible(true);
        }}
      />

      {/*  */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={linkModalVisible}
        onRequestClose={() => {
          setLinkModalVisible(false);
        }}
      >
        <View style={styles.modalDimmer}>
          <View style={styles.modal}>
            <View>
              <Text style={styles.Title}> Insert Link </Text>
              <TextInput
                onChangeText={(text) => {
                  getNewLinkPreview(text);
                }}
                style={styles.link}
                placeholder="https://"
              />
            </View>
            <RenderHTML source={{ html: linkData }} style={{ height: 30 }} />

            <TouchableOpacity
              style={styles.done}
              onPress={() => {
                richText.current?.insertHTML(`<a href='${linkRaw.url}'>${linkRaw.title}</a>`);
                setLinkData('');
                setLinkRaw('');
                setLinkModalVisible(false);
              }}
            >
              <Text style={{ textAlign: 'center' }}>Insert Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={codeModalVisible}
        onRequestClose={() => {
          setCodeModalVisible(false);
        }}
      >
        <View style={styles.modalDimmer}>
          <View style={styles.modal}>
            <View>
              <Text style={styles.Title}> Insert HTML </Text>
              <KeyboardAwareScrollView
                style={{
                  margin: 5,
                  marginBottom: 25,
                  padding: 15,
                  borderWidth: 1,
                  borderColor: '#000',
                }}
              >
                <TextInput
                  // style={{ height: 300 }}
                  multiline={true}
                  placeholder="<div>\n<h1>Hello</h1>\n</div>"
                  onChangeText={(text) => {
                    setCode(text);
                  }}
                />
              </KeyboardAwareScrollView>
            </View>

            <TouchableOpacity
              style={styles.done}
              onPress={() => {
                richText.current?.insertHTML(code + '<br><br>');
                setCode('');
                setCodeModalVisible(false);
              }}
            >
              <Text style={{ textAlign: 'center', marginBottom: 10 }}>Insert HTML</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalDimmer: {
    flex: 1,
    backgroundColor: '#00000098',
  },
  modal: {
    borderRadius: 10,
    alignContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    minHeight: 300,
    justifyContent: 'space-between',
    marginVertical: 100,
  },

  Title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },

  link: {
    backgroundColor: '#f5f5f5ff',
    padding: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
  },

  done: {
    backgroundColor: '#f5f5f5ff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
