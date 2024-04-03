import React from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-2052849149225040/2223251690";

export default function BannerOne() {
  return <BannerAd unitId={adUnitId} size={BannerAdSize.LEADERBOARD} />;
}
