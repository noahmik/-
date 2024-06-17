async function fetchRestaurants() {
    const district = document.getElementById('district').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!district) {
        alert('구군 이름을 입력하세요.');
        return;
    }

    const apiKey = ''; // 공공데이터 포털에서 발급받은 인증키를 입력하세요
    const url = `http://apis.data.go.kr/6260000/FoodService/getFoodKr?serviceKey=${apiKey}&numOfRows=10&pageNo=1&resultType=json&GUGUN_NM=${encodeURIComponent(district)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 응답 데이터 전체를 로그로 출력
        console.log('API 응답 데이터:', data);

        const items = data.getFoodKr.item;
        // GUGUN_NM과 district가 일치하는 항목들 필터링
        const filteredItems = items.filter(item => item.GUGUN_NM === district);

        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('result-item');

                // 메인 타이틀
                const title = document.createElement('div');
                title.classList.add('result-title');
                title.textContent = item.MAIN_TITLE;
                itemDiv.appendChild(title);

                // 전화번호
                const phone = document.createElement('div');
                phone.classList.add('result-phone');
                phone.textContent = item.CNTCT_TEL || '전화번호 정보 없음';
                itemDiv.appendChild(phone);

                // 주소
                const address = document.createElement('div');
                address.textContent = `주소: ${item.ADDR1}`;
                itemDiv.appendChild(address);

                // 구군 이름
                const districtName = document.createElement('div');
                districtName.textContent = `구군: ${item.GUGUN_NM}`;
                itemDiv.appendChild(districtName);

                // 홈페이지 URL (만약 없으면 표시하지 않음)
                if (item.HOMEPAGE_URL) {
                    const homepage = document.createElement('div');
                    homepage.textContent = `홈페이지: ${item.HOMEPAGE_URL}`;
                    itemDiv.appendChild(homepage);
                }

                // 항목 설명
                const description = document.createElement('div');
                description.textContent = `설명: ${item.ITEMCNTNTS}`;
                itemDiv.appendChild(description);

                // 대표 메뉴
                const representativeMenu = document.createElement('div');
                representativeMenu.textContent = `대표 메뉴: ${item.RPRSNTV_MENU}`;
                itemDiv.appendChild(representativeMenu);

                // 운영 시간
                const operatingHours = document.createElement('div');
                operatingHours.textContent = `운영 시간: ${item.USAGE_DAY_WEEK_AND_TIME}`;
                itemDiv.appendChild(operatingHours);

                resultsDiv.appendChild(itemDiv);
            });
        } else {
            resultsDiv.innerHTML = '<p>해당 구군에 대한 결과가 없습니다.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = '<p>데이터를 가져오는 중 오류가 발생했습니다.</p>';
    }
}
