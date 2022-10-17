import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Trips from './components/Trips';
import Trip from './components/Trip';
import Day from './components/Day';
import Event from './components/Event';
import AddEvent from './components/AddEvent';
import AddTrip from './components/AddTrip';
import { Animated, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import AddTravel from './components/AddTravel';
import { theme } from './components/Styles';

export default function App() {
  const fadeTransition = ({ current, next, inverted, layouts: { screen } }) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        : 0
    );

    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  };

  const Stack = createStackNavigator();

  const screenOptions = {
    cardStyleInterpolator: fadeTransition,
    cardOverlay: () => (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.white,
        }}
      />
    ),
  };
  return (
    <MenuProvider style={{ paddingTop: 40, backgroundColor: theme.colors.white }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="Trips"
            component={Trips}
            options={{
              title: 'Trips',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Trip"
            component={Trip}
            options={{
              title: 'Trip',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Day"
            component={Day}
            options={{
              title: 'Day',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddEvent"
            component={AddEvent}
            options={{
              title: 'NewEvent',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddTravel"
            component={AddTravel}
            options={{
              title: 'TravelTime',
            }}
          />
          <Stack.Screen
            name="Event"
            component={Event}
            options={{
              title: 'Event',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddTrip"
            component={AddTrip}
            options={{
              title: 'AddTrip',
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
