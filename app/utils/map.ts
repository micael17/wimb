export function setMarker(map: any) {
  const kakao = window.kakao;
  var marker = new kakao.maps.Marker({
    // 지도 중심좌표에 마커를 생성합니다
    position: map.getCenter(),
  });

  // 지도에 마커를 표시합니다
  marker.setMap(map);

  const infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

  kakao.maps.event.addListener(map, 'click', function (mouseEvent: { latLng: any }) {
    // 클릭한 위도, 경도 정보를 가져옵니다
    var latlng = mouseEvent.latLng;

    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(latlng);

    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';

    var resultDiv = document.getElementById('clickLatlng');
    if (!resultDiv) return;
    resultDiv.innerHTML = message;
  });
}

//맵 로딩하기
export function loadMap(lat: number, long: number) {
  const kakao = window.kakao;
  kakao.maps.load(() => {
    // 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
    const placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
    const contentNode = document.createElement('div'); // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
    let currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다
    let markers: any[] = []; // 마커를 담을 배열입니다

    const container = document.getElementById('map');
    const latLng = new kakao.maps.LatLng(lat, long);
    const options = {
      center: latLng,
      level: 3,
    };

    const map: any = new kakao.maps.Map(container, options);

    // 장소 검색 객체를 생성합니다
    const ps = new kakao.maps.services.Places(map);

    // 지도에 idle 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'idle', searchPlaces);

    // 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
    contentNode.className = 'placeinfo_wrap';

    // 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
    // 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
    addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
    addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

    // 커스텀 오버레이 컨텐츠를 설정합니다
    placeOverlay.setContent(contentNode);

    // 각 카테고리에 클릭 이벤트를 등록합니다
    addCategoryClickEvent();

    const searchBox = document.getElementById('searchBox') as HTMLInputElement;
    if (searchBox) {
      searchBox.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
          // Enter 키를 눌렀을 때 실행할 코드를 여기에 작성합니다.
          // 예를 들어, 입력된 검색어를 가져와서 검색 기능을 실행할 수 있습니다.
          var searchText = searchBox.value;

          if (searchText) {
            const options = {
              // size: 15, 기본값 15 (최대치)
              useMapBounds: true,
            };
            removeMarker();
            ps.keywordSearch(searchText, placesSearchCB2, options);
          }
        }
      });
    }

    // 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
    function addEventHandle(target: HTMLElement, type: any, callback: () => {}) {
      if (target.addEventListener) {
        target.addEventListener(type, callback);
      }
    }

    // 카테고리 검색을 요청하는 함수입니다
    function searchPlaces() {
      if (!currCategory) {
        return;
      }

      // 커스텀 오버레이를 숨깁니다
      placeOverlay.setMap(null);

      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarker();

      const options = {
        // size: 15, 기본값 15 (최대치)
        useMapBounds: true,
      };

      ps.categorySearch(currCategory, placesSearchCB, options);
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data: any[], status: any, pagination: any) {
      if (pagination.hasNextPage) {
        pagination.nextPage();
      }

      console.log(data);
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
      } else if (status === kakao.maps.services.Status.ERROR) {
        // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
      }
    }

    // 키워드검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB2(data: any[], status: any, pagination: any) {
      if (pagination.hasNextPage) {
        pagination.nextPage();
      }

      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          displayMarker(data[i]);
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
      } else if (status === kakao.maps.services.Status.ERROR) {
        // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
      }
    }

    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(place: any) {
      // 마커를 생성하고 지도에 표시합니다
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', function () {
        displayPlaceInfo(place);
      });

      markers.push(marker);
    }

    // 지도에 마커를 표출하는 함수입니다
    function displayPlaces(places: any) {
      // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
      // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
      if (document.getElementById(currCategory)) {
        const el = document.getElementById(currCategory) as HTMLElement;
        let order = el.getAttribute('data-order');

        for (let i = 0; i < places.length; i++) {
          // 마커를 생성하고 지도에 표시합니다
          let marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

          // 마커와 검색결과 항목을 클릭 했을 때
          // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
          (function (marker, place) {
            kakao.maps.event.addListener(marker, 'click', function () {
              displayPlaceInfo(place);
            });
          })(marker, places[i]);
        }
      }
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position: any, order: any) {
      let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(11, 28), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage,
        });

      marker.setMap(map); // 지도 위에 마커를 표출합니다
      markers.push(marker); // 배열에 생성된 마커를 추가합니다

      return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
    function displayPlaceInfo(place: any) {
      let content =
        '<div class="placeinfo">' +
        '   <a class="title" href="' +
        place.place_url +
        '" target="_blank" title="' +
        place.place_name +
        '">' +
        place.place_name +
        '</a>';

      if (place.road_address_name) {
        content +=
          '    <span title="' +
          place.road_address_name +
          '">' +
          place.road_address_name +
          '</span>' +
          '  <span class="jibun" title="' +
          place.address_name +
          '">(지번 : ' +
          place.address_name +
          ')</span>';
      } else {
        content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
      }

      content += '    <span class="tel">' + place.phone + '</span>' + '</div>' + '<div class="after"></div>';

      contentNode.innerHTML = content;
      placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
      placeOverlay.setMap(map);
    }

    // 각 카테고리에 클릭 이벤트를 등록합니다
    function addCategoryClickEvent() {
      const category = document.getElementById('category') as HTMLElement;
      console.log('category ', category);
      const children = category.children;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        console.log(child);
        child.onclick = onClickCategory;
      }
    }

    // 카테고리를 클릭했을 때 호출되는 함수입니다
    function onClickCategory(this: any) {
      console.log(this.id, this.className);
      let id = this.id,
        className = this.className;

      placeOverlay.setMap(null);

      if (className === 'on') {
        currCategory = '';
        changeCategoryClass(null);
        removeMarker();
      } else {
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
      }
    }

    // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
    function changeCategoryClass(el: any) {
      let category = document.getElementById('category') as HTMLElement,
        children = category.children,
        i;

      for (i = 0; i < children.length; i++) {
        children[i].className = '';
      }

      if (el) {
        el.className = 'on';
      }
    }
  });
}
