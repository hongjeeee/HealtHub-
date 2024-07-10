import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './style/Summary.css';
import AuthContext from '../contexts/AuthContext';

const Summary = () => {
  const { isLoggedIn, userName } = useContext(AuthContext);

  const [currentWeight, setCurrentWeight] = useState(null);
  const [targetWeight, setTargetWeight] = useState(null);
  const [currentWeightInput, setCurrentWeightInput] = useState('');
  const [todayCalories, setTodayCalories] = useState(0);
  const [nutrientWarning, setNutrientWarning] = useState('');

  const fetchUserData = async () => {
    if (isLoggedIn) {
      try {
        // 몸무게 값 가져오기
        const response = await axios.get('http://localhost:8081/healthhub/myinfo', { withCredentials: true });
        const userData = response.data;
        setCurrentWeight(userData.mb_weight);
        setTargetWeight(userData.mb_target_weight);
        setCurrentWeightInput(userData.mb_weight);
        console.log("로그인 직후 몸무게 값", userData.mb_weight);

        // 칼로리 값 가져오기
        const totalCaloriesResponse = await axios.get('http://localhost:8081/healthhub/get_total_calories', { withCredentials: true });
        const totalCalories = totalCaloriesResponse.data;
        setTodayCalories(totalCalories);

        // 가장 많은 영양소 가져오기 (nutrientWarning 변수 사용)
        const mostAbundantNutrientResponse = await axios.get('http://localhost:8081/healthhub/most-abundant-nutrient', { withCredentials: true });
        const nutrientInEnglish = mostAbundantNutrientResponse.data;

        // 영양소 이름 한글로 변환 (nutrientTranslationMap 사용)
        const nutrientTranslationMap = {
          protein: '단백질',
          carbohydrate: '탄수화물',
          fat: '지방',
          sugar: '당',
          calsium: '칼슘',
          fe: '철',
          sodium: '나트륨'
        };
        const nutrientInKorean = nutrientTranslationMap[nutrientInEnglish] || nutrientInEnglish;
        setNutrientWarning(nutrientInKorean);

      } catch (error) {
        console.error('사용자 데이터 가져오기 에러:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData(); // 로그인 성공 직후 데이터 가져오기
  }, [isLoggedIn]);

  // 현재 체중 변경 이벤트 핸들러
  const handleCurrentWeightChange = (event) => {
    setCurrentWeightInput(event.target.value);
  };

  // 현재 체중 저장 이벤트 핸들러
  const handleCurrentWeightSubmit = async () => {
    const parsedWeight = parseFloat(currentWeightInput);

    if (!isNaN(parsedWeight)) {
      try {
        await axios.put('http://localhost:8081/healthhub/setweight', {
          mb_weight: parsedWeight // currentWeight 필드만 전송
        }, { withCredentials: true });


        // 성공적으로 업데이트된 후 다시 사용자 정보 가져오기
        const loginMemberResponse = await axios.get('http://localhost:8081/healthhub/loginMember', { withCredentials: true });
        const updatedUserData = loginMemberResponse.data;

        setCurrentWeight(updatedUserData.mb_weight);
        setCurrentWeightInput(updatedUserData.mb_weight); // 입력 필드에 반영
        setTargetWeight(updatedUserData.mb_target_weight);

        // 사용자 데이터 다시 불러오기
        await fetchUserData();

      } catch (error) {
        console.error('현재 체중 업데이트 에러:', error.response ? error.response.data : error.message);
        // 에러 처리 (사용자에게 알림 등)
      }
    }
  };

  return (
    <div className="summary">
      <div className="summaryBox calories">
        <div className="summaryBox-header">오늘의 섭취 칼로리</div>
        <div className="summaryBox-content" id="caloriesContent">{todayCalories}Kcal</div>
      </div>
      <div className="summaryBox warning">
        <div className="summaryBox-header">주의 👩‍🦰 </div>
        <div className="summaryBox-content">
          <div id="summaryBox-content1">{nutrientWarning ? `${nutrientWarning} 과다 섭취!!` : '영양소 경고 메시지가 없습니다.'}</div> {/* 영양소 경고 메시지 표시 */}
          <div id="summaryBox-content2">{nutrientWarning ? `${nutrientWarning} 섭취를 줄여주세요!!` : ''}</div> {/* 영양소 경고 메시지 표시 */}
        </div>
      </div>
      <div className="summaryBox goal">
        <div className="weight-content">
          <div className="weight-section">
            <div className="weight-label">현재 체중</div>
            <input
              type="number"
              value={currentWeightInput}
              onChange={handleCurrentWeightChange}
              className="weight-input"
            />
            <button onClick={handleCurrentWeightSubmit} className="weight-submit">설정</button>
          </div>
          <div className="weight-section">
            <div className="weight-label">목표 체중</div>
            <div className="weight-data">{targetWeight}Kg</div> {/* 목표 체중 표시 */}
          </div>
          <div className="weight-section">
            <div className="weight-label">남은 체중</div>
            <div className="weight-data">{Math.abs(currentWeightInput - targetWeight).toFixed(2)}Kg</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
