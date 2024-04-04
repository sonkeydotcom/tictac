import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-2052849149225040/2913383388";

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const Interstitial = ({ showAds, setShowAds }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log("Interstitial Ad Loaded");
      }
    );

    const closed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      console.log("Interstitial Ad Closed");
      interstitial.load();
      console.log("Interstitial Ad Loading...");
    });

    interstitial.load();
    console.log("Interstitial Ad Loading...");

    return unsubscribe; // Clean up event listener
  }, []);

  const showInterstitial = () => {
    if (loaded) {
      setTimeout(() => {
        interstitial.show();
        console.log("Interstitial Ad Shown");
      }, 30000); // 30 seconds
    } else {
      console.log("Interstitial Ad not loaded yet");
      return;
    }
  };

  useEffect(() => {
    if (loaded) {
      showInterstitial();
    }
  }, [loaded]);

  return null;
};

export default Interstitial;
