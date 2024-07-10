import React, { useState, useEffect, useContext } from 'react';
import Header from './Header';
import Summary from './Summary'; 
import DatePickerCalendar from './DatePickerCalendar';
import MealSuggestions from './MealSuggestions';
import NutritionRatio from './NutritionRatio';
import DailyNutrition from './DailyNutrition';
import './style/HomePage.css';
import AuthContext from '../contexts/AuthContext';

const HomePage = () => {
  const { isLoggedIn, userName } = useContext(AuthContext);

  const [date, setDate] = useState(new Date());

  return (
    <div className="health-hub">
      <Header />
      <main className="main-content">
        <Summary />
        <DatePickerCalendar date={date} setDate={setDate} />
        <MealSuggestions />
        <NutritionRatio />
        <DailyNutrition />
      </main>
    </div>
  );
};

export default HomePage;
