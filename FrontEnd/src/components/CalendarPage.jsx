import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style/CalendarPage.css';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import axios from 'axios';

const locales = {
  'ko': require('date-fns/locale/ko'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [foodRecords, setFoodRecords] = useState([]);

  useEffect(() => {
    const fetchFoodRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8081/healthhub/foodRecords', {
          withCredentials: true
        });
        if (response.status === 200) {
          const formattedRecords = response.data.map(record => ({
            ...record,
            date: new Date(record.diet_date)
          }));

          
          setFoodRecords(formattedRecords);
        }
      } catch (error) {
        console.error('음식 기록 가져오기 에러:', error);
      }
    };
    fetchFoodRecords();
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getAllDailyCaloriesByMealType = () => {
    const allDailyCalories = {};
    foodRecords.forEach(record => {
      const dateString = record.date.toDateString();
      if (!allDailyCalories[dateString]) {
        allDailyCalories[dateString] = {};
      }
      const totalCalories = record.calories * record.input_amount;
      allDailyCalories[dateString][record.meal_type] = (allDailyCalories[dateString][record.meal_type] || 0) + totalCalories;
    });
    return allDailyCalories;
  };

  const sortMealTypes = (mealTypes) => {
    const order = { 아침: 0, 점심: 1, 저녁: 2 };
    return mealTypes.sort((a, b) => order[a] - order[b]);
  };

  const getFoodRecordsForDate = (date) => {
    return foodRecords.filter(record => record.date.toDateString() === date.toDateString());
  };

  const events = [];
  const allDailyCalories = getAllDailyCaloriesByMealType();
  for (const dateString in allDailyCalories) {
    const date = new Date(dateString);
    const sortedMealTypes = sortMealTypes(Object.keys(allDailyCalories[dateString]));
    sortedMealTypes.forEach(mealType => {
      events.push({
        title: `${mealType}: ${allDailyCalories[dateString][mealType]} Kcal`,
        date: date,
      });
    });
  }

  // 캘린더 셀 렌더링 함수
  const renderEventContent = (eventInfo) => {
    // 아침, 점심, 저녁 순으로 정렬
    const sortedMealTypes = sortMealTypes(Object.keys(allDailyCalories[eventInfo.event.startStr] || {})); 
    return (
      <div>
        {sortedMealTypes.map((mealType) => (
          <div key={mealType}>
            {mealType}: {allDailyCalories[eventInfo.event.startStr][mealType]} Kcal
          </div>
        ))}
      </div>
    );
  };

 

  return (
    <div className="calendar-page">
      <main className="main-content">
        <div className="calendar-container">
          <FullCalendar
            locale="ko"
            defaultView="dayGridMonth"
            plugins={[dayGridPlugin, interactionPlugin]}
            height={800}
            contentHeight={600}
            aspectRatio={1.35}
            events={events} // 모든 날짜의 이벤트를 사용
            
            dateClick={handleDateClick}
          />
        </div>
      </main>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Food Records"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>{selectedDate ? selectedDate.toLocaleDateString() : ''} 먹은 음식</h2>
        {selectedDate && (
          <ul>
            {getFoodRecordsForDate(selectedDate).map(record => (
              <li key={record.id}>
                {record.meal_type}: {record.food_name} ({record.calories}Kcal)
              </li>
            ))}
          </ul>
        )}
        <div>
          <button onClick={closeModal} id='foodModal-close'>닫기</button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarPage;
