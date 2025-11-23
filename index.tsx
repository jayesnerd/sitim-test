import { registerRootComponent } from 'expo';
import App from './App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

registerRootComponent(Root);
