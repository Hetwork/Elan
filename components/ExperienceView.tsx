import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const { width, height } = Dimensions.get('window');

interface Product {
  id: number;
  name: string;
  productCount: string;
  image: string;
}

interface ExperienceViewProps {
  products: Product[];
}

export default function ExperienceView({ products }: ExperienceViewProps) {
  const numColumns = 5; // number of images per row
  const spacing = 20; // space between images
  const imageSize = 100;
  
  // Animation values for each item
  const animationValues = useRef(
    products.map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Calculate grid dimensions
  const numRows = Math.ceil(products.length / numColumns);
  const gridWidth = numColumns * imageSize + (numColumns - 1) * spacing;
  const gridHeight = numRows * (imageSize + spacing) - spacing;
  
  // Calculate boundaries with equal padding on all sides
  const boundaryPadding = 80; // Equal padding on all 4 sides
  
  // Content dimensions - make it larger than screen to allow proper centering
  const contentWidth = Math.max(width, gridWidth + (boundaryPadding * 2));
  const contentHeight = Math.max(height, gridHeight + (boundaryPadding * 2));
  
  // Center the grid within the content area
  const gridOffsetX = (contentWidth - gridWidth) / 2;
  const gridOffsetY = (contentHeight - gridHeight) / 2;

  useEffect(() => {
    // Animate items in with staggered timing
    const animations = animationValues.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: 1,
          duration: 600,
          delay: index * 100, // Stagger by 100ms
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 600,
          delay: index * 100, // Stagger by 100ms
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, animations).start();
  }, []);

  return (
    <ReactNativeZoomableView
      maxZoom={2.5}
      minZoom={0.8}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      panBoundaryPadding={0}
      contentWidth={contentWidth}
      contentHeight={contentHeight}
      movementSensibility={1}
      style={styles.fullScreenZoomable}>
      <View style={[styles.contentContainer, { 
        width: contentWidth, 
        height: contentHeight 
      }]}>
        {products.map((item, index) => {
          const row = Math.floor(index / numColumns);
          const col = index % numColumns;

          // Stagger effect for columns: shift even columns right
          const staggerCol = col % 2 === 0 ? 0 : spacing / 0.5;

          // Position items with center offset + boundary padding
          const top = gridOffsetY + row * (imageSize + spacing) + staggerCol;
          const left = gridOffsetX + col * (imageSize + spacing);

          return (
            <Animated.View
              key={`${item.id}-${index}`}
              style={[
                styles.productItem,
                {
                  top,
                  left,
                  opacity: animationValues[index]?.opacity || 0,
                  transform: [
                    {
                      scale: animationValues[index]?.scale || 0,
                    },
                  ],
                },
              ]}>
              <TouchableOpacity
                onPress={() => alert(`Clicked on ${item.name}`)}
                style={styles.touchableArea}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </ReactNativeZoomableView>
  );
}

const styles = StyleSheet.create({
  fullScreenZoomable: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    minHeight: '100%',
    minWidth: '100%',
  },
  productItem: {
    position: 'absolute',
  },
  touchableArea: {
    width: 100,
    height: 100,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
