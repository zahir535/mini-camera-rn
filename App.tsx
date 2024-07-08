/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { StatusBar, View } from "react-native";

import { CameraPage } from "./src/page/CameraPage";
import { SafeAreaProvider } from "react-native-safe-area-context";

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={"light-content"} />
      <CameraPage />
    </SafeAreaProvider>
  );
}

export default App;
