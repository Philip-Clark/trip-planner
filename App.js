import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Trips from './components/Trips';
import Trip from './components/Trip';
import Day from './components/Day';
import Event from './components/Event';
import AddEvent from './components/AddEvent';
import AddTrip from './components/AddTrip';
import { Animated } from 'react-native';

export default function App() {
  const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
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
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  screen.width * 1.5, // Focused, but offscreen in the beginning
                  0, // Fully focused
                  screen.width * -0.0, // Fully unfocused
                ],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
    };
  };

  const forSlideHori = ({ current, next, inverted, layouts: { screen } }) => {
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
        transform: [
          {
            translateY: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  screen.height, // Focused, but offscreen in the beginning
                  0, // Fully focused
                  screen.height * -0.3, // Fully unfocused
                ],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
    };
  };

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Trips"
          component={Trips}
          options={{ title: 'Trips', headerShown: false, cardStyleInterpolator: forSlide }}
        />
        <Stack.Screen
          name="Trip"
          component={Trip}
          options={{ title: 'Trip', headerShown: false, cardStyleInterpolator: forSlide }}
        />
        <Stack.Screen
          name="Day"
          component={Day}
          options={{ title: 'Day', headerShown: false, cardStyleInterpolator: forSlide }}
        />
        <Stack.Screen
          name="AddEvent"
          component={AddEvent}
          options={{ title: 'NewEvent', headerShown: false, cardStyleInterpolator: forSlideHori }}
        />
        <Stack.Screen
          name="Event"
          component={Event}
          options={{ title: 'Event', headerShown: false, cardStyleInterpolator: forSlide }}
        />
        <Stack.Screen
          name="AddTrip"
          component={AddTrip}
          options={{ title: 'AddTrip', headerShown: false, cardStyleInterpolator: forSlideHori }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
