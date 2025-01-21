import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { PanResponder } from "react-native"; // Make sure PanResponder is imported

const { height: screenHeight } = Dimensions.get("window");

const App = () => {
  const [region, setRegion] = useState({
    latitude: 13.085375,
    longitude: 80.213750,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [userLocation, setUserLocation] = useState(null); // User's live location
  const [isLoading, setIsLoading] = useState(true); // Loading state for location

  const animatedValue = new Animated.Value(screenHeight * 0.6);

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

  // Function to get the current user location
  const getUserLocation = () => {
    console.log("Checking location permissions...");
    if (Platform.OS === "android") {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then((result) => {
          console.log("Location permission result: ", result);
          if (result === RESULTS.GRANTED) {
            console.log("Fetching user location...");
            Geolocation.getCurrentPosition(
              (position) => {
                console.log("User location fetched: ", position.coords);
                setUserLocation(position.coords);
                setRegion({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
                setIsLoading(false);
              },
              (error) => {
                console.error("Error getting location:", error);
                setIsLoading(false);
                Alert.alert("Error", "Unable to get your location");
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
              }
            );
          } else {
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
              (requestResult) => {
                console.log("Request permission result: ", requestResult);
                if (requestResult === RESULTS.GRANTED) {
                  getUserLocation();
                } else {
                  setIsLoading(false);
                  Alert.alert("Permission Denied", "Location permission denied");
                  console.log("Location permission not granted");
                }
              }
            );
          }
        })
        .catch((error) => {
          console.log("Permission check error:", error);
          setIsLoading(false);
          Alert.alert("Error", "Permission check failed");
        });
    }
  };

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const BottomSheet = () => (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}
      </MapView>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.handleBar} />
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.arriving_text}>Bus Arrives in 20 mins</Text>
          <Text style={styles.arriving_text_sub}>Your bus won’t be late today</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );

  return isLoading ? (
    <Text style={styles.loadingText}>Loading...</Text>
  ) : (
    <BottomSheet />
  );
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