import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

export default function JellyCard() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);

  // 歪み用の値（カードの各部分が異なる速度で動く）
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      // カードの位置を更新
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;

      // 速度に基づいて歪みを計算
      velocityX.value = event.velocityX;
      velocityY.value = event.velocityY;

      // スワイプの速度と方向に応じて歪みを適用
      const velocityFactor = 0.0003;
      skewX.value = -event.velocityY * velocityFactor;
      skewY.value = event.velocityX * velocityFactor;

      // スワイプの方向に応じて伸縮
      const stretchFactor = 0.00005;
      scaleX.value = 1 + Math.abs(event.velocityX) * stretchFactor;
      scaleY.value = 1 + Math.abs(event.velocityY) * stretchFactor;
    },
    onEnd: (event) => {
      // 元の位置に戻る（スプリングアニメーション）
      translateX.value = withSpring(0, {
        ...SPRING_CONFIG,
        velocity: event.velocityX * 0.001,
      });
      translateY.value = withSpring(0, {
        ...SPRING_CONFIG,
        velocity: event.velocityY * 0.001,
      });

      // 歪みも元に戻る（遅延を加えてゼリーのような動き）
      skewX.value = withSpring(0, {
        ...SPRING_CONFIG,
        damping: 12,
      });
      skewY.value = withSpring(0, {
        ...SPRING_CONFIG,
        damping: 12,
      });
      scaleX.value = withSpring(1, {
        ...SPRING_CONFIG,
        damping: 10,
      });
      scaleY.value = withSpring(1, {
        ...SPRING_CONFIG,
        damping: 10,
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { skewX: `${skewX.value}rad` },
        { skewY: `${skewY.value}rad` },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.cardContent}>
            {/* カードの内容 */}
          </View>
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
  card: {
    width: 300,
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
