import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import './style/DatePickerCalendar.css';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddedFoodList from './AddedFoodList';

const DatePickerCalendar = ({ date, setDate }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [newFood, setNewFood] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [mealTime, setMealTime] = useState('아침');
  const [refresh, setRefresh] = useState();

  useEffect(() => {
    const fetchAllFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:8081/healthhub/foods');
        setFoodItems(response.data);
      } catch (error) {
        console.error('음식 목록 가져오기 에러:', error);
      }
    };
    fetchAllFoodItems();
  }, []);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/healthhub/foods?query=${newFood}`);
        setFoodItems(response.data.slice(0, 5));
      } catch (error) {
        console.error('음식 검색 에러:', error);
      }
    };
    if (newFood.trim() !== '') {
      fetchFoodItems();
    }
  }, [newFood]);


  const handleFoodItemClick = (event, value) => {
    setNewFood(value);
  };

  const handlePrevDate = () => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    setDate(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    setDate(nextDate);
  };

  const handleMealTimeChange = (meal) => {
    setMealTime(meal);
  };

  const addFood = async () => {
    if (newFood.trim() !== '' && newQuantity.trim() !== '') {
      const selectedFoodItem = foodItems.find(item => item.food_name === newFood);

      if (selectedFoodItem) {
        try {
          const formattedDate = date.toISOString().slice(0, 10);

          const response = await axios.put('http://localhost:8081/healthhub/addMenu', {
            meal_type: mealTime,
            food_idx: selectedFoodItem.food_idx,
            input_amount: parseFloat(newQuantity),
            diet_date: formattedDate
          }, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          setNewFood('');
          setNewQuantity('');
          if (response.status === 200) {
            setRefresh(!refresh);
          }
        } catch (error) {
          console.error('음식 추가 에러:', error);
        }
      } else {
        console.error('선택된 음식이 없습니다.');
      }
    }
  };

  return (
    <div className="date-picker-calendar">
      <div className="date-picker-box">
        <div className="date-navigation">
          <button onClick={handlePrevDate} className="nav-button">&lt;</button>
          <span>{date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <button onClick={handleNextDate} className="nav-button">&gt;</button>
        </div>
        <div className="food-input">
          <Autocomplete
            freeSolo
            disableClearable
            options={[...new Set(foodItems.map((option) => option.food_name))]}
            value={newFood}
            onChange={handleFoodItemClick}
            sx={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="음식"
                variant="outlined"
                onChange={(e) => setNewFood(e.target.value)}
              />
            )}
          />
          <TextField
            type="number"
            label="양"
            variant="outlined"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            sx={{ width: 100 }}
          />
          <Button variant="contained" onClick={addFood} sx={{ marginLeft: 1 }}>
            추가
          </Button>
        </div>
        <div className="meal-time-buttons">
          <button onClick={() => handleMealTimeChange('아침')} className={mealTime === '아침' ? 'active' : ''}>아침</button>
          <button onClick={() => handleMealTimeChange('점심')} className={mealTime === '점심' ? 'active' : ''}>점심</button>
          <button onClick={() => handleMealTimeChange('저녁')} className={mealTime === '저녁' ? 'active' : ''}>저녁</button>
        </div>

        {/* 추가된 음식 목록 표시 */}
        <div>
          <AddedFoodList mealTime={mealTime} date={date} refresh={refresh} setRefresh={setRefresh}></AddedFoodList>
        </div>
      </div>

      {/* 달력 */}
      <div className="calendar-section">
        <MiniCalendar selectedDate={date} setSelectedDate={setDate} />
      </div>
    </div>
  );
}

export default DatePickerCalendar;
