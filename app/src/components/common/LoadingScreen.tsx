import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

import { Colors, Fonts } from "@/constants/theme";

export function LoadingScreen() {
  const [indicatorOn, setIndicatorOn] = useState<number>(1);
  const outline_rotation = useSharedValue(0);
  const Q_rotation = useSharedValue(0);

  useEffect(() => {
    outline_rotation.value = withRepeat(
      withTiming(360, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(outline_rotation);
    };
  }, []);

  useEffect(() => {
    Q_rotation.value = withSequence(
      withTiming(15, {
        duration: 800,
        easing: Easing.inOut(Easing.sin),
      }),
      withRepeat(
        withTiming(-15, {
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );

    return () => {
      cancelAnimation(Q_rotation);
    };
  }, []);

  const animatedOutline = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${outline_rotation.value}deg` }],
    };
  });

  const animatedQ = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${Q_rotation.value}deg` }],
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndicatorOn((prevCount) => (prevCount === 3 ? 1 : prevCount + 1));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.loadingCircleWrapper}>
        <Animated.View style={[styles.loadingCircleOutline, animatedOutline]} />
        <View style={styles.loadingCircle}>
          <View style={styles.logoBox}>
            <Animated.View style={[styles.logoQ, animatedQ]}>
              <Image
                source={require("@/assets/images/logo_Q.png")}
                contentFit="contain"
                style={styles.logoQImage}
              />
            </Animated.View>
            <Image
              source={require("@/assets/images/logo_rice.png")}
              contentFit="contain"
              style={styles.logoFix}
            />
          </View>
        </View>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.messageBig}>왓밥</Text>
        <Text style={styles.messageSmall}>오늘 뭐 먹을 지 고민 중</Text>
      </View>
      <View style={styles.indicatorBox}>
        <View
          style={indicatorOn === 1 ? styles.indicatorOn : styles.indicatorOff}
        />
        <View
          style={indicatorOn === 2 ? styles.indicatorOn : styles.indicatorOff}
        />
        <View
          style={indicatorOn === 3 ? styles.indicatorOn : styles.indicatorOff}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    backgroundColor: Colors.textBrown,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingCircleWrapper: {
    width: 220,
    height: 220,
  },
  loadingCircleOutline: {
    ...StyleSheet.absoluteFill,
    borderRadius: 110,
    borderColor: Colors.backOrange,
    borderStyle: "dashed",
    borderWidth: 2,
  },
  loadingCircle: {
    flex: 1,
    margin: 8,
    borderRadius: 999,
    backgroundColor: Colors.backOrange,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoBox: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  logoFix: {
    width: 100,
    height: 100,
  },
  logoQ: {
    position: "absolute",
    top: -27,
    right: -31,
    width: 40,
    height: 65,
  },
  logoQImage: {
    width: "100%",
    height: "100%",
  },
  textBox: {
    gap: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBig: {
    fontFamily: Fonts.danjunghae,
    fontSize: 46,
    color: Colors.backOrange,
  },
  messageSmall: {
    fontFamily: Fonts.nonpreferencefood,
    fontSize: 27,
    color: Colors.backOrange,
  },
  indicatorBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 23,
  },
  indicatorOn: {
    backgroundColor: Colors.white,
    width: 15,
    height: 15,
    borderRadius: 10,
  },
  indicatorOff: {
    backgroundColor: Colors.white,
    opacity: 0.25,
    width: 15,
    height: 15,
    borderRadius: 10,
  },
});
