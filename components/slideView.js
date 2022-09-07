import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export default function SlideInView({ duration, end, start, offset, children }) {
  const slideAnim = useRef(new Animated.Value(50)).current; // Initial value for opacity: 0
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.bezier(0, 0, 0, 1.06),
        duration: 100,
      }).start();
      Animated.timing(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.bezier(0.21, -0.01, 0.48, 0.67),
        duration: 100,
      }).start();
    }, 100 + offset * 30);
  }, [slideAnim]);
  return (
    <Animated.View // Special animatable View
      style={{
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      {children}
    </Animated.View>
  );
}

function remapRange(val, min, max) {
  if (max - min === 0 || isNaN(val - min)) return 1;
  return (val - min) / (max - min);
}