import React from 'react';
import './AdminPage.css';
import Sidebar from './Sidebar';
import { VisitorInsights, TotalRevenue, CustomerSatisfaction, TargetVsReality, VolumeVsServiceLevel, FavoriteFood } from './ChartComponent';
import AdminHeader from './AdminHeader';
import { useDarkMode } from './DarkModeContext';

const visitorData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '기존 고객',
      data: [300, 250, 200, 300, 350, 400, 350, 300, 250, 200, 300, 350],
      borderColor: 'purple',
      fill: false,
    },
    {
      label: '신규 고객',
      data: [200, 300, 250, 300, 300, 350, 300, 200, 300, 250, 300, 300],
      borderColor: 'red',
      fill: false,
    },
  ],
};

const revenueData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '온라인 판매',
      data: [15000, 20000, 25000, 20000, 15000, 10000, 5000, 15000, 20000, 25000, 20000, 15000],
      backgroundColor: 'blue',
    },
    {
      label: '오프라인 판매',
      data: [10000, 15000, 20000, 15000, 10000, 5000, 2000, 10000, 15000, 20000, 15000, 10000],
      backgroundColor: 'green',
    },
  ],
};

const satisfactionData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '지난 달',
      data: [65, 70, 75, 80, 85, 90, 95, 65, 70, 75, 80, 85],
      borderColor: 'green',
      fill: false,
    },
    {
      label: '이번 달',
      data: [60, 65, 70, 75, 80, 85, 90, 60, 65, 70, 75, 80],
      borderColor: 'blue',
      fill: false,
    },
  ],
};

const AdminPage = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`admin-container ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      <main className={`main-content ${isDarkMode ? 'dark' : ''}`}>
        <AdminHeader />
        <section className="dashboard">
          <div className={`card visitor-insights ${isDarkMode ? 'dark' : ''}`}>
            <VisitorInsights data={visitorData} />
          </div>
          <div className={`card total-revenue ${isDarkMode ? 'dark' : ''}`}>
            <TotalRevenue data={revenueData} />
          </div>
          <div className={`card customer-satisfaction ${isDarkMode ? 'dark' : ''}`}>
            <CustomerSatisfaction data={satisfactionData} />
          </div>
          <div className={`card target-vs-reality ${isDarkMode ? 'dark' : ''}`}>
            <TargetVsReality data={revenueData} />
          </div>
          <div className={`card volume-vs-service ${isDarkMode ? 'dark' : ''}`}>
            <VolumeVsServiceLevel data={revenueData} />
          </div>
          <div className={`card favorite-food ${isDarkMode ? 'dark' : ''}`}>
            <FavoriteFood />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
