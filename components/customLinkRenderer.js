import React, { useState } from 'react';
import { defaultHTMLElementModels, HTMLContentModel } from 'react-native-render-html';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { getLinkPreview } from 'link-preview-js';
import { theme } from './Styles';

const LinkRenderer = function LinkRenderer({ TDefaultRenderer, tnode, ...props }) {
  const [linkData, setLinkData] = useState({
    title: '',
    mediaType: '',
    images: [],
    description: '',
    url: '',
  });
  // Get link preview image from favicon if website, else first image.
  const linkImage = linkData.mediaType == 'website' ? linkData.favicons[0] : linkData.images[0];
  // If there is no title, retrieve the link data
  if (linkData.title == '') getLinkPreview(tnode.attributes.href).then((data) => setLinkData(data));
  // Try to open the given URL
  const openUrl = (url) => {
    try {
      Linking.openURL(url);
    } catch (e) {}
  };

  return (
    <TDefaultRenderer {...props} tnode={tnode} onPress={() => openUrl(tnode.attributes.href)}>
      <View style={styles.linkPreviewContainer}>
        <Image source={{ uri: linkImage }} style={styles.linkImage} />
        <View style={styles.linkDetails}>
          <Text style={styles.linkTitle}>{linkData.title}</Text>
          <Text style={styles.linkDescription}>{linkData.description}</Text>
          <Text style={styles.linkUrl}>{linkData.url}</Text>
        </View>
      </View>
    </TDefaultRenderer>
  );
};
// a Helper function
export const customHTMLElementModels = {
  a: defaultHTMLElementModels.a.extend({
    contentModel: HTMLContentModel.block,
  }),
};
// Export the custom renderer
export const AnchorRenderer = {
  a: LinkRenderer,
};

const styles = StyleSheet.create({
  linkPreviewContainer: {
    backgroundColor: theme.colors.itemColor,
    padding: 10,
    borderRadius: theme.sizes.borderRadius,
    display: 'flex',
    flexDirection: 'row',
  },
  linkImage: {
    width: 100,
    height: 100,
    borderRadius: theme.sizes.borderRadius,
  },
  linkDetails: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    width: '70%',
  },

  linkTitle: {
    fontSize: 24,
    height: 25,
  },

  linkDescription: {
    fontSize: 14,
    height: 44,
    color: theme.colors.text,
  },

  linkUrl: {
    fontSize: 20,
    height: 20,
    marginTop: 6,
    color: '#bfbfbf',
  },
});
