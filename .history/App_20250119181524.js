import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  ScrollView,
  ProgressBarAndroid, // For Android
  Platform
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const { height: screenHeight } = Dimensions.get("window");

const App = () => {
  // Static location for Anna Nagar Roundana
  const annaNagarLocation = {
    latitude: 13.085375, // Latitude of Anna Nagar Roundana
    longitude: 80.213750, // Longitude of Anna Nagar Roundana
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [region, setRegion] = useState(annaNagarLocation);
  const [progress, setProgress] = useState(0); // Bus travel progress
  const [busLocation, setBusLocation] = useState(annaNagarLocation); // Bus marker position
  const [busMoving, setBusMoving] = useState(false); // Bus movement control

  // Simulate bus movement across a route (from point A to point B)
  useEffect(() => {
    const route = [
      { latitude: 13.085375, longitude: 80.213750 }, // Start point (Anna Nagar)
      { latitude: 13.087000, longitude: 80.215000 }, // Intermediate point
      { latitude: 13.090000, longitude: 80.220000 }, // End point
    ];

    let index = 0;
    const totalStops = route.length;

    // Function to update bus position and progress
    const moveBus = () => {
      if (index < totalStops) {
        setBusLocation(route[index]); // Update bus marker location
        setProgress((index + 1) / totalStops); // Update progress
        index++;
      } else {
        clearInterval(interval); // Stop moving after reaching the last stop
      }
    };

    const interval = setInterval(moveBus, 3000); // Update every 3 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []); // Run only once when the component mounts

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {/* The marker simulating the bus movement */}
        <Marker coordinate={busLocation} title="Bus Location" />
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.handleBar} />
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.arriving_text}>Bus Arrives in 20 mins</Text>
          <Text style={styles.arriving_text_sub}>Your bus won’t be late today</Text>

          {/* Progress Bar */}
          {Platform.OS === "android" ? (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress}
              color="#2196F3"
              style={styles.progressBar}
            />
          ) : (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
          )}

          <Text style={styles.progressText}>
            Progress: {Math.round(progress * 100)}%
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: screenHeight,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 16,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 8,
  },
  contentContainer: {
    flex: 1,
  },
  arriving_text: {
    fontSize: 25,
    color: "#000",
    fontWeight: "bold",
    fontFamily: "HelveticaNeue, sans-serif",
  },
  arriving_text_sub: {
    fontSize: 10,
    color: "rgba(0, 0, 0, 0.57)",
    fontWeight: "bold",
    fontFamily: "HelveticaNeue, sans-serif",
  },
  progressText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginTop: 15,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
});

export default App;
