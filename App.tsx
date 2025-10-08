import React, { useState, useRef } from 'react';
import { StyleSheet, StatusBar, StatusBarStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const injectedJS = `
(function() {
  function send() {
    try {
      const meta = document.querySelector('meta[name="theme-color"]');
      const theme = meta ? meta.content : null;
      const href = location.href;
      const path = location.pathname || '/';
      const payload = { href: href, path: path, theme: theme };
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }

  // initial send
  send();

  // wrap history methods for SPA routing
  const _push = history.pushState;
  history.pushState = function() {
    _push.apply(this, arguments);
    send();
  };
  const _replace = history.replaceState;
  history.replaceState = function() {
    _replace.apply(this, arguments);
    send();
  };

  window.addEventListener('popstate', send);
  window.addEventListener('hashchange', send);

  // observe if meta[name="theme-color"] is added/changed
  const observer = new MutationObserver(function(muts) {
    for (const m of muts) {
      if (m.type === 'attributes' && m.target && m.target.name === 'theme-color') {
        send();
      }
      if (m.type === 'childList') {
        // new meta might be added
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) send();
      }
    }
  });

  const head = document.head || document.getElementsByTagName('head')[0];
  if (head) observer.observe(head, { childList: true, subtree: true, attributes: true });

  true; // required for Android
})();
`;

export default function App() {
  const [barStyle, setBarStyle] = useState<StatusBarStyle>('light-content');
  const [barColor, setBarColor] = useState('#222222');
  const webRef = useRef(null);

  const decideStyleByColor = (color: string) => {
    try {
      if (!color) return 'dark-content';
      let r = 0,
        g = 0,
        b = 0;
      if (color.startsWith('#')) {
        const c = color.slice(1);
        if (c.length === 3) {
          r = parseInt(c[0] + c[0], 16);
          g = parseInt(c[1] + c[1], 16);
          b = parseInt(c[2] + c[2], 16);
        } else {
          r = parseInt(c.slice(0, 2), 16);
          g = parseInt(c.slice(2, 4), 16);
          b = parseInt(c.slice(4, 6), 16);
        }
      } else {
        const nums = color.match(/\\d+/g);
        if (nums && nums.length >= 3) {
          r = +nums[0];
          g = +nums[1];
          b = +nums[2];
        }
      }
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return lum < 0.5 ? 'light-content' : 'dark-content';
    } catch {
      return 'dark-content';
    }
  };

  const handleMessage = (event: any) => {
    const raw = event.nativeEvent?.data;
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.log('Invalid webview message', e, raw);
      return;
    }
    const { path = '/', theme } = parsed;

    if (theme) {
      setBarColor(theme);
      setBarStyle(decideStyleByColor(theme));
      return;
    }

    if (path === '/' || path === '') {
      setBarColor('#222222');
      setBarStyle('light-content');
    } else if (path.startsWith('/news')) {
      setBarColor('rgba(176, 200, 219, 0.85)');
      setBarStyle('dark-content');
    } else if (path.startsWith('/afisha')) {
      setBarColor('rgba(229, 221, 238, 0.85)');
      setBarStyle('dark-content');
    } else if (path.startsWith('/cinema')) {
      setBarColor('rgba(33, 33, 33, 0.85)');
      setBarStyle('light-content');
    } else {
      setBarColor('#222222');
      setBarStyle('light-content');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: barColor }]}
        edges={['top']}
      >
        <StatusBar
          barStyle={barStyle}
          backgroundColor={barColor}
          animated={true}
          translucent={false}
        />
        <WebView
          ref={webRef}
          source={{ uri: 'https://sitim.info' }}
          style={styles.webview}
          injectedJavaScript={injectedJS}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
