import { Pressable, StyleSheet, Dimensions, View } from "react-native";
import React, { useEffect } from "react";
import { icon } from "@/constants/Icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
}: {
  onPress: Function;
  onLongPress: Function;
  isFocused: boolean;
  routeName: string;
  label: string;
}) => {
  const opacity = useSharedValue(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    opacity.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 50 }
    );
  }, [opacity, isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacityValue = interpolate(opacity.value, [0, 1], [1, 0])

    return {
      opacity: opacityValue,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.tabbarBtn, { width: screenWidth / 5 }]}
    >
      <View style={styles.iconContainer}>
        {icon[routeName]({
          color: isFocused ? Colors.tabIconSelected : Colors.tabIconDefault,
          focused: isFocused,
        })}
      </View>
      <Animated.Text
        style={[
          styles.label,
          {
            color: isFocused ? Colors.tabIconSelected : Colors.tabIconDefault,
          },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabbarBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
