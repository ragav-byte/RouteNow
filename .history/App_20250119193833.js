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
import Geolocation from '@react-native-community/geolocation';

const { height: screenHeight } = Dimensions.get("window");

const App = () => {
  // Static location for Anna Nagar Roundana
  const annaNagarLocation = {
    latitude: 13.085375,
    longitude: 80.213750,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [userLocation, setUserLocation] = useState(null);
  const animatedValue = new Animated.Value(screenHeight * 0.6);

  useEffect(() => {
    // Get user's current location
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

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

  const BottomSheet = () => {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={annaNagarLocation} // Using initialRegion to prevent re-renders
          showsUserLocation={true} // This will show the user's location
          showsMyLocationButton={true} // This shows the "my location" button
          scrollEnabled={true}
          zoomEnabled={true}
        >
          {/* The marker stays fixed at Anna Nagar Roundana */}
          <Marker coordinate={annaNagarLocation} title="Anna Nagar Roundana" />
          
          {/* Show user location if available */}
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
          
          {/* Dot in the bottom sheet */}
          <View style={styles.dot_1}></View>
          <View style={styles.line_1}></View>
          <View style={styles.dot_2}></View>
          <Text style={styles.subtext_1}>Current stop:</Text>
          <Text style={styles.current_stop}>Nathamuni</Text>
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
  dot_1: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: "#000",
    position: "absolute", // position the dot at the bottom of the bottom sheet
    left: "8%", // horizontally center it
    top: "10%",
    transform: [{ translateX: -10 }, { translateY: 10 }], // adjust the position of the dot
  },
  dot_2: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: "#fff",
    borderColor: "#000", // Corrected border color syntax
    borderWidth: 2, // Border width added to make the border visible
    position: "absolute", // position the dot at the bottom of the bottom sheet
    left: "8%", // horizontally position it
    top: "25%", // adjust the top positioning
    transform: [{ translateX: -10 }, { translateY: 10 }], // adjust positioning if needed
  },
  line_1:{
    width: "2",
    height: 130,
    backgroundColor:"#000",
    position: "absolute", // position the dot at the bottom of the bottom sheet
    left: "8%", // horizontally position it
    top: "12%", // adjust the top positioning
  },
  subtext_1:{
        fontSize: 10,
    color: "#000",
    fontWeight: "bold",
    fontFamily: "HelveticaNeue, sans-serif",
    position: "absolute", // position the dot at the bottom of the bottom sheet
    left: "13%", // horizontally position it
    top: "11%", // adjust the top positioning
    opacity:0.5,
  },
  current_stop:{
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
    fontFamily: "HelveticaNeue, sans-serif",
    position: "absolute", // position the dot at the bottom of the bottom sheet
    left: "13%", // horizontally position it
    top: "12%", // adjust the top positioning
  }
});

export default App;