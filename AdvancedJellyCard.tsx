import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDecay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 複数の層を使ってゼリーのような動きを実現
const LAYERS = [
  { damping: 20, stiffness: 200, mass: 0.8 },  // 最も硬い層（中心）
  { damping: 15, stiffness: 150, mass: 1.0 },  // 中間層
  { damping: 10, stiffness: 100, mass: 1.2 },  // 柔らかい層（外側）
];

export default function AdvancedJellyCard() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);

  // 各層の変形値
  const layer1SkewX = useSharedValue(0);
  const layer1SkewY = useSharedValue(0);
  const layer2SkewX = useSharedValue(0);
  const layer2SkewY = useSharedValue(0);
  const layer3SkewX = useSharedValue(0);
  const layer3SkewY = useSharedValue(0);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;

      velocityX.value = event.velocityX;
      velocityY.value = event.velocityY;

      // 速度に基づいて回転と歪みを計算
      const velocityMagnitude = Math.sqrt(
        event.velocityX ** 2 + event.velocityY ** 2
      );

      // 回転：スワイプの方向に応じて
      rotation.value = (event.velocityX * 0.0001);

      // スケール：動いている時は少し縮む
      scale.value = 1 - Math.min(velocityMagnitude * 0.00002, 0.05);

      // 各層に異なる歪みを適用（遅延効果でゼリーのような動き）
      const factor1 = 0.0004;
      const factor2 = 0.0006;
      const factor3 = 0.0008;

      layer1SkewX.value = -event.velocityY * factor1;
      layer1SkewY.value = event.velocityX * factor1;

      layer2SkewX.value = -event.velocityY * factor2;
      layer2SkewY.value = event.velocityX * factor2;

      layer3SkewX.value = -event.velocityY * factor3;
      layer3SkewY.value = event.velocityX * factor3;
    },
    onEnd: (event) => {
      // メインの位置：慣性を持って戻る
      const shouldDecay = Math.abs(event.velocityX) > 500 || Math.abs(event.velocityY) > 500;

      if (shouldDecay) {
        translateX.value = withDecay({
          velocity: event.velocityX,
          clamp: [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
          deceleration: 0.997,
        }, () => {
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          });
        });

        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [-400, 400],
          deceleration: 0.997,
        }, () => {
          translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          });
        });
      } else {
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
          velocity: event.velocityX * 0.001,
        });
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
          velocity: event.velocityY * 0.001,
        });
      }

      // 回転とスケールを元に戻す
      rotation.value = withSpring(0, LAYERS[0]);
      scale.value = withSpring(1, LAYERS[0]);

      // 各層を異なるタイミングで元に戻す（ゼリー効果）
      layer1SkewX.value = withSpring(0, LAYERS[0]);
      layer1SkewY.value = withSpring(0, LAYERS[0]);

      layer2SkewX.value = withSpring(0, LAYERS[1]);
      layer2SkewY.value = withSpring(0, LAYERS[1]);

      layer3SkewX.value = withSpring(0, LAYERS[2]);
      layer3SkewY.value = withSpring(0, LAYERS[2]);
    },
  });

  // メインカードのスタイル
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}rad` },
        { scale: scale.value },
      ],
    };
  });

  // 各層のスタイル
  const layer1Style = useAnimatedStyle(() => {
    return {
      transform: [
        { skewX: `${layer1SkewX.value}rad` },
        { skewY: `${layer1SkewY.value}rad` },
      ],
    };
  });

  const layer2Style = useAnimatedStyle(() => {
    return {
      transform: [
        { skewX: `${layer2SkewX.value}rad` },
        { skewY: `${layer2SkewY.value}rad` },
      ],
    };
  });

  const layer3Style = useAnimatedStyle(() => {
    return {
      transform: [
        { skewX: `${layer3SkewX.value}rad` },
        { skewY: `${layer3SkewY.value}rad` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardContainer, cardStyle]}>
          {/* 3層構造でゼリーのような効果 */}
          <Animated.View style={[styles.layer, styles.layer3, layer3Style]}>
            <Animated.View style={[styles.layer, styles.layer2, layer2Style]}>
              <Animated.View style={[styles.layer, styles.layer1, layer1Style]}>
                <View style={styles.cardContent}>
                  <Text style={styles.emoji}>🍮</Text>
                  <Text style={styles.title}>Jelly Card</Text>
                  <Text style={styles.subtitle}>Swipe me!</Text>
                </View>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cardContainer: {
    width: 300,
    height: 400,
  },
  layer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 20,
  },
  layer1: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  layer2: {
    backgroundColor: 'transparent',
  },
  layer3: {
    backgroundColor: 'transparent',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
