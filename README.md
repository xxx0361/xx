# JellyCardDemo

React Native Reanimatedを使用したゼリーのような物理アニメーションを実装したデモアプリです。

## 特徴

- **物理法則に基づいた動き**: スプリング物理演算（damping、stiffness、mass）による自然なアニメーション
- **3層構造**: 各層が異なる物理パラメータで動作し、本物のゼリーのような波打つ効果を実現
- **速度ベースの歪み**: スワイプの速度と方向に応じて動的に歪み（skew）を適用
- **慣性スクロール**: 高速スワイプ時は`withDecay`で滑らかに減速
- **多次元アニメーション**: 歪み、回転、スケールを組み合わせた複雑な動き

## アニメーション実装

### 物理パラメータ

```javascript
const LAYERS = [
  { damping: 20, stiffness: 200, mass: 0.8 },  // 中心（硬い）
  { damping: 15, stiffness: 150, mass: 1.0 },  // 中間
  { damping: 10, stiffness: 100, mass: 1.2 },  // 外側（柔らかい）
];
```

### アニメーション効果

1. **スワイプ検出**: `PanGestureHandler`で指の動きを追跡
2. **速度ベースの歪み**: スワイプ速度に応じて`skew`を適用
3. **3層の遅延**: 各層が異なるタイミングで元に戻ることでゼリー効果
4. **慣性**: 速いスワイプ時は`withDecay`で物理的な減速
5. **回転・スケール**: 動きに合わせて微妙な回転と縮小

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npx expo start
```

Expo Goアプリでスキャンするか、エミュレータで実行してください。

## 技術スタック

- **React Native**: 0.81.5
- **Expo**: ~54.0.25
- **React Native Reanimated**: ^4.1.5
- **React Native Gesture Handler**: ~2.28.0

## ファイル構成

- `AdvancedJellyCard.tsx` - 3層構造の高度なゼリーアニメーション
- `JellyCard.tsx` - シンプル版のゼリーアニメーション
- `babel.config.js` - Reanimatedプラグインの設定

## カスタマイズ

物理パラメータを調整することで、動きをカスタマイズできます：

- **damping**: 小さいほど揺れが大きい（推奨: 10-20）
- **stiffness**: 大きいほど硬い動き（推奨: 100-200）
- **mass**: 大きいほど重い動き（推奨: 0.8-1.2）

## ライセンス

MIT

## 開発者

Generated with [Claude Code](https://claude.com/claude-code)
