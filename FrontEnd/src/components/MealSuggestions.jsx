import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/MealSuggestions.css';

const MealSuggestions = () => {
    const [recommendedMenu, setRecommendedMenu] = useState([]);

    useEffect(() => {
        const fetchRecommendedMenu = async () => {
            try {
                const response = await axios.get('http://localhost:8081/healthhub/getRecommendedMenu', {
                    withCredentials: true
                });
                if (response.status === 200) {
                    // 서버에서 받은 추천 메뉴를 랜덤하게 섞기
                    const shuffledMenu = shuffleArray(response.data);
                    setRecommendedMenu(shuffledMenu);
                }
            } catch (error) {
                console.error('추천 메뉴 가져오기 에러:', error);
            }
        };
        fetchRecommendedMenu();
    }, []);

    // Fisher-Yates Shuffle 알고리즘을 사용하여 배열 랜덤하게 섞기
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    return (
        <section className="meal-suggestions">
            <h2>오늘의 식단 추천</h2>
            <div className="meals">
                {["아침", "점심", "저녁"].map((mealType, index) => ( // 아침, 점심, 저녁 순서 고정
                    <div className="meal" key={mealType}>
                        <h3>{mealType}</h3>
                        <p>{recommendedMenu[index]?.food_name || "추천 메뉴 없음"}</p> 
                        <p>{recommendedMenu[index]?.calories || 0} Kcal</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MealSuggestions;
