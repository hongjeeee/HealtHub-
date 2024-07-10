// src/components/ChartComponent.jsx
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useDarkMode } from './DarkModeContext';

// Chart.js의 요소들 등록
ChartJS.register(
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const options = (isDarkMode) => ({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: isDarkMode ? 'white' : '#999',
        font: {
          size: 14
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: isDarkMode ? 'white' : '#999',
        font: {
          size: 14
        }
      }
    },
    y: {
      ticks: {
        color: isDarkMode ? 'white' : '#999',
        font: {
          size: 14
        }
      }
    }
  }
});

export const VisitorInsights = ({ data }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`card visitor-insights ${isDarkMode ? 'dark' : ''}`}>
      <h2>방문자 통계</h2>
      <div className="chart-container1">
        <Line data={data} options={options(isDarkMode)} />
      </div>
    </div>
  );
};

export const TotalRevenue = ({ data }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`card total-revenue ${isDarkMode ? 'dark' : ''}`}>
      <h2>총 수익</h2>
      <div className="chart-container1">
        <Bar data={data} options={options(isDarkMode)} />
      </div>
    </div>
  );
};

export const CustomerSatisfaction = ({ data }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`card customer-satisfaction ${isDarkMode ? 'dark' : ''}`}>
      <h2>고객 만족도</h2>
      <div className="chart-container1">
        <Line data={data} options={options(isDarkMode)} />
      </div>
    </div>
  );
};

export const TargetVsReality = ({ data }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`card target-vs-reality ${isDarkMode ? 'dark' : ''}`}>
      <h2>목표 대비 실적</h2>
      <div className="chart-container1">
        <Bar data={data} options={options(isDarkMode)} />
      </div>
    </div>
  );
};

export const VolumeVsServiceLevel = ({ data }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`card volume-vs-service ${isDarkMode ? 'dark' : ''}`}>
      <h2>볼륨 대비 서비스 수준</h2>
      <div className="chart-container1">
        <Bar data={data} options={options(isDarkMode)} />
      </div>
    </div>
  );
};

export const FavoriteFood = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`card favorite-food ${isDarkMode ? 'dark' : ''}`}>
      <h2>인기 음식</h2>
      <table>
        <thead>
          <tr>
            <th className={isDarkMode ? 'dark' : ''}>순위</th>
            <th className={isDarkMode ? 'dark' : ''}>이름</th>
            <th className={isDarkMode ? 'dark' : ''}>인기도</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={isDarkMode ? 'dark' : ''}>01</td>
            <td className={isDarkMode ? 'dark' : ''}>닭가슴살</td>
            <td className={isDarkMode ? 'dark' : ''}>45%</td>
          </tr>
          <tr>
            <td className={isDarkMode ? 'dark' : ''}>02</td>
            <td className={isDarkMode ? 'dark' : ''}>토마토</td>
            <td className={isDarkMode ? 'dark' : ''}>29%</td>
          </tr>
          <tr>
            <td className={isDarkMode ? 'dark' : ''}>03</td>
            <td className={isDarkMode ? 'dark' : ''}>연어</td>
            <td className={isDarkMode ? 'dark' : ''}>25%</td>
          </tr>
          <tr>
            <td className={isDarkMode ? 'dark' : ''}>04</td>
            <td className={isDarkMode ? 'dark' : ''}>양배추</td>
            <td className={isDarkMode ? 'dark' : ''}>18%</td>
          </tr>
          <tr>
            <td className={isDarkMode ? 'dark' : ''}>05</td>
            <td className={isDarkMode ? 'dark' : ''}>틸라피아</td>
            <td className={isDarkMode ? 'dark' : ''}>15%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
