import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";

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
  const [userLocation, setUserLocation] = useState(null); // User location state
  const animatedValue = new Animated.Value(screenHeight * 0.6);

  // Draggable bottom sheet setup
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newY = animatedValue._value + gestureState.dy;
      if (newY >= screenHeight * 0.2 && newY <= screenHeight * 0.9) {
        animatedValue.setValue(newY);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < 0) {
        Animated.timing(animatedValue, {
          toValue: screenHeight * 0.2,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(animatedValue, {
          toValue: screenHeight * 0.6,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const translateY = animatedValue.interpolate({
    inputRange: [screenHeight * 0.2, screenHeight * 0.9],
    outputRange: [screenHeight * 0.2, screenHeight * 0.9],
    extrapolate: "clamp",
  });

  // Get user location
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('User location:', position.coords); // Log the location data
        const { latitude, longitude } = position.coords;
        setUserLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => {
        console.log('Location error:', error); // Log any errors
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const BottomSheet = () => {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region || annaNagarLocation} // Fallback to annaNagarLocation if region is invalid
          showsUserLocation={true}
          showsMyLocationButton={true}
          scrollEnabled={true}  // Enable map scrolling
          zoomEnabled={true}    // Enable zoom
        >
          {/* The marker stays fixed at Anna Nagar Roundana */}
          <Marker coordinate={annaNagarLocation} title="Anna Nagar Roundana" />

          {/* Render user's location if available */}
          {userLocation && (
            <Marker coordinate={userLocation} title="Your Location" pinColor="blue" />
          )}
        </MapView>

        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.bottomSheet, { transform: [{ translateY }] }]}
        >
          <View style={styles.handleBar} />
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.arriving_text}>Bus Arrives in 20 mins</Text>
            <Text style={styles.arriving_text_sub}>
              Your bus won’t be late today
            </Text>
          </ScrollView>
        </Animated.View>
      </View>
    );
  };

  return <BottomSheet />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
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
    color: "#000",
    fontWeight: "bold",
    fontFamily: "HelveticaNeue, sans-serif",
  },
});

export default App;