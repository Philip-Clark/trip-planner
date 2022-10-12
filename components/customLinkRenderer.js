import React, { useState } from 'react';
import RenderHTML, {
  CustomBlockRenderer,
  defaultHTMLElementModels,
} from 'react-native-render-html';
import { Alert, Image, Linking, Text, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { HTMLElementModel, HTMLContentModel } from 'react-native-render-html';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getLinkPreview, getPreviewFromContent } from 'link-preview-js';

export const customHTMLElementModels = {
  a: defaultHTMLElementModels.a.extend({
    contentModel: HTMLContentModel.block,
  }),
};

const LinkRenderer = function LinkRenderer({ TDefaultRenderer, tnode, ...props }) {
  const [linkData, setLinkData] = useState({
    title: '',
    mediaType: '',
    images: [],
    description: '',
    url: '',
  });

  const showLink = () => {
    getLinkPreview(tnode.attributes.href).then((data) => {
      setLinkData(data);
    });
  };

  if (linkData.title == '') showLink();

  return (
    <TDefaultRenderer
      tnode={tnode}
      {...props}
      onPress={() => {
        onPress(tnode.attributes.href);
      }}
    >
      <View
        style={{
          backgroundColor: '#f5f5f5ff',
          padding: 10,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Image
          source={{
            uri: linkData.mediaType == 'website' ? linkData.favicons[0] : linkData.images[0],
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 5,
          }}
        />
        <View style={{ display: 'flex', flexDirection: 'column', marginLeft: 10, width: '70%' }}>
          <Text style={{ fontSize: 24, height: 25 }}>{linkData.title}</Text>
          <Text style={{ fontSize: 14, height: 44, color: '#5e5e5e' }}>{linkData.description}</Text>
          <Text style={{ fontSize: 20, height: 20, marginTop: 6, color: '#bfbfbf' }}>
            {linkData.url}
          </Text>
        </View>
      </View>
    </TDefaultRenderer>
  );
};

const onPress = (url) => {
  try {
    Linking.openURL(url);
  } catch (e) {}
};

export const AnchorRenderer = {
  a: LinkRenderer,
};
