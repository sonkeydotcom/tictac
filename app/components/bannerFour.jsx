import React from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-2052849149225040/4613611316";

export default function BannerFour() {
  return (
    <BannerAd
      unitId={TestIds.ADAPTIVE_BANNER}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}
