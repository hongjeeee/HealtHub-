import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './style/AddedFoodList.css';

const AddedFoodList = ({ mealTime, date, refresh, setRefresh }) => { // refresh, setRefresh props 추가
  const [totalCal, setTotalCal] = useState(0);
  const [addedFoodItems, setAddedFoodItems] = useState({});

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const formattedDate = date.toISOString().slice(0, 10);
        const response = await axios.get('http://localhost:8081/healthhub/getMenu', {
          params: {
            diet_date: formattedDate,
            meal_type: mealTime
          },
          withCredentials: true  
        });

        if (response.status === 200) {
          setAddedFoodItems(response.data || []);
        }
      } catch (error) {
        setAddedFoodItems({food_name:[], input_amount:[], calories:[] });
        console.error('메뉴 정보 가져오기 에러:', error);
      }
    };

    fetchMenuData();
  }, [date, mealTime, refresh]); 
      useEffect(() => {
        // 총 칼로리 계산
        const calculateTotalCalories = () => {
          const total = Object.values(addedFoodItems) // 객체 값을 배열로 변환
            .flat() // 2차원 배열을 1차원 배열로 평탄화
            .filter(item => item.meal_type === mealTime) // 선택된 식사 유형에 해당하는 메뉴 필터링
            .reduce((sum, item) => sum + (item.calories * item.input_amount), 0); // 총 칼로리 계산
          setTotalCal(total);
        };
    
        calculateTotalCalories();
      }, [addedFoodItems, mealTime]);
    
  
    return (
        <table>
            <thead>
            <tr>
                <th>음식 이름</th>
                <th>양</th>
                <th>칼로리</th>
            </tr>
            </thead>
            <tbody>
            {/* addedFoodItems 배열을 평탄화하여 모든 메뉴 출력 */}
            {Object.values(addedFoodItems).flat().map((item, index) => (
                <tr key={`${item.food_idx}-${index}-${item.meal_type}`}>
                <td>{item.food_name}</td>
                <td>{item.input_amount*100}g</td>
                <td>{item.calories * item.input_amount} kcal</td>
                </tr>
            ))}
            <tr className="total-calories-row">
                <td>총 칼로리</td>
                <td></td>
                <td>{totalCal} kcal</td>
            </tr>
            </tbody>
        </table>

    );
}

export default AddedFoodList