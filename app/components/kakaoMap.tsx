'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import useScript from '../hooks/useScript';
import { loadMap } from '../utils/map';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const apiKey = 'f299d9526d51a6d72d276b0883a57df4';
  const src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`;

  const [loading, error] = useScript(src);

  useEffect(() => {
    if (loading === false) {
      let lat = 37.566826;
      let long = 126.9786567;

      if ('geolocation' in navigator) {
        let options = {
          enableHighAccuracy: true,
        };
        navigator.geolocation.getCurrentPosition(
          (position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            loadMap(lat, long);
          },
          null,
          options,
        );
      }
    }
  }, [loading, error]);

  if (error !== null) return <p>지도 스크립트 불러오기를 실패했습니다.</p>;
  return (
    <div className="map_wrap">
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
      <input id="searchBox" type="text"></input>
      <ul id="category">
        <li id="BK9" data-order="0">
          <span className="category_bg bank"></span>
          은행
        </li>
        <li id="MT1" data-order="1">
          <span className="category_bg mart"></span>
          마트
        </li>
        <li id="PM9" data-order="2">
          <span className="category_bg pharmacy"></span>
          약국
        </li>
        <li id="OL7" data-order="3">
          <span className="category_bg oil"></span>
          주유소
        </li>
        <li id="CE7" data-order="4">
          <span className="category_bg cafe"></span>
          카페
        </li>
        <li id="CS2" data-order="5">
          <span className="category_bg store"></span>
          편의점
        </li>
      </ul>
    </div>
  );
}
