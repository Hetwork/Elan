// TestViewShot.tsx
import React, { useRef, useState } from "react";
import { View, Text, Button, Image, StyleSheet, SafeAreaView } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";

const TestViewShot = () => {
  const viewShotRef = useRef<ViewShot>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const takeScreenshot = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.9,
      });
      console.log("Screenshot saved to:", uri);
      setImageUri(uri);
    } catch (error) {
      console.error("Failed to take screenshot:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ViewShot ref={viewShotRef} style={styles.shotArea}>
        <Text style={styles.text}>Hello 👋 This is inside ViewShot</Text>
        <View style={styles.box} />
      </ViewShot>

      <Button title="Take Screenshot" onPress={takeScreenshot} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.preview}
          resizeMode="contain"
        />
      )}
    </SafeAreaView>
  );
};

export default TestViewShot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "flex-start",
  },
  shotArea: {
    backgroundColor: "#d1f7d6",
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#4caf50",
    borderRadius: 10,
  },
  preview: {
    marginTop: 20,
    width: "100%",
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
