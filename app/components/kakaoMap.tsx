'use client';

import { useEffect, useState } from 'react';
import useScript from '../hooks/useScript';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const apiKey = 'f299d9526d51a6d72d276b0883a57df4';
  const src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;

  const [loading, error] = useScript(src);

  useEffect(() => {
    if (loading === false) {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
      });
    }
  }, [loading, error]);

  if (error !== null) return <p>지도 스크립트 불러오기를 실패했습니다.</p>;
  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
}
