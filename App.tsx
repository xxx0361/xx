import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AdvancedJellyCard from './AdvancedJellyCard';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AdvancedJellyCard />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
