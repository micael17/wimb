'use client';

import React from 'react';
import KakaoMap from './components/kakaoMap';

export default function Home() {
  const toggleMenu = () => {
    const menu = document.getElementById('menu') as HTMLElement;
    const content = document.querySelector('.content') as HTMLElement;

    if (!menu || !content) return;

    menu.classList.toggle('show');
  };

  return (
    <div className="container">
      <div className="menu show" id="menu">
        <button className="menu-toggle" onClick={toggleMenu}>
          ≪
        </button>
        <div>안녕하세요, 김지홍님아?</div>

        <ul>
          <li>내가 최근에 작성한 리뷰 3개</li>
          <li>내가 가장 평점을 높게 준 매장 3개</li>
          <li>동네사람들이 평점을 높게 준 매장 3개</li>
        </ul>
      </div>

      <div className="content">
        <KakaoMap />
      </div>
    </div>
  );
}
