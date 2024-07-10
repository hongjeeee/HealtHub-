import React from 'react';
import './style/MiniCalendar.css';

const MiniCalendar = ({ selectedDate, setSelectedDate }) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Get the first and last day of the month
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Create an array for the days of the month
  const days = [];
  for (let i = 1; i <= lastDate; i++) {
    days.push(i);
  }

  const handleDayClick = (day) => {
    // 클릭된 날짜를 사용하여 새로운 Date 객체 생성
    const newSelectedDate = new Date(selectedDate); // 현재 선택된 날짜를 복사
    newSelectedDate.setDate(day); // 날짜 설정
    setSelectedDate(newSelectedDate); // 상태 업데이트
  };

  return (
    <div>
      <div className="calendar-header">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-body">
        {[...Array(firstDay)].map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`calendar-day ${
              selectedDate.getDate() === day ? 'selected' : ''
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
