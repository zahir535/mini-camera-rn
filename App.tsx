/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { SafeAreaView, StatusBar } from "react-native";

import { CameraPage } from "./src/page/CameraPage";
import "react-native-polyfill-globals/auto";

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <StatusBar barStyle={"light-content"} />
      <CameraPage />
    </SafeAreaView>
  );
}

export default App;
