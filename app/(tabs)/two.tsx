import React from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const { width } = Dimensions.get('window');

// Example product data
const products = [
  {
    id: 1,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d970cf3163f9824c3a12c2_Midori%20Plate%2023%2C5.webp',
  },
  {
    id: 2,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d9707eab0def13c185226a_Miami%20Saucer%2014.webp',
  },
  {
    id: 3,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d971124ae04d418efb01c7_Ruston%20Plate%2027.webp',
  },
  {
    id: 4,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96d19cd7ab59d28b45037_Barolo%20Plate%2028.webp',
  },
  {
    id: 5,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836da17f598be5f1ff00aa5_Deep%20plate%2016.webp',
  },
  {
    id: 6,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96ebd7bed792e812eca91_Kiryu%20Plate%2023%2C5.webp',
  },
  {
    id: 7,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96efac6037c23fa15d6c4_Light%20Blue%20Sea%20Bowl%2016.webp',
  },
  {
    id: 8,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96d19cd7ab59d28b45037_Barolo%20Plate%2028.webp',
  },
  {
    id: 9,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96d19cd7ab59d28b45037_Barolo%20Plate%2028.webp',
  },
  {
    id: 10,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96d19cd7ab59d28b45037_Barolo%20Plate%2028.webp',
  },
  {
    id: 11,
    image:
      'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96d19cd7ab59d28b45037_Barolo%20Plate%2028.webp',
  },
];

export default function App() {
  const numColumns = 5; // number of images per row
  const spacing = 20; // space between images
  const imageSize = 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f3' }}>
      <ReactNativeZoomableView
        maxZoom={2.5}
        minZoom={0.8}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={false}
        movementSensibility={1}
        style={{ flex: 1 }}>
        {products.map((item, index) => {
          const row = Math.floor(index / numColumns);
          const col = index % numColumns;

          // Stagger effect for rows: shift odd rows down
          // const staggerRow = row % 2 === 0 ? 0 : imageSize / 2;

          // Stagger effect for columns: shift even columns right
          const staggerCol = col % 2 === 0 ? 0 : spacing / 0.5;

          const top = row * (imageSize + spacing) + staggerCol;
          const left = col * (imageSize + spacing);

          return (
            <TouchableOpacity
              key={item.id}
              style={{
                position: 'absolute',
                top,
                left,
              }}
              onPress={() => alert(`Clicked on item ${item.id}`)}>
              <Image
                source={{ uri: item.image }}
                style={{ width: imageSize, height: imageSize, borderRadius: 50 }}
              />
            </TouchableOpacity>
          );
        })}
      </ReactNativeZoomableView>
    </View>
  );
}