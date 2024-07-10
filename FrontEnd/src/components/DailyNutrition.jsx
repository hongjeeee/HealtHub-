import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './style/DailyNutrition.css';

const DailyNutrition = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ajax 요청을 통해 서버에서 JSON 데이터 가져오기
    axios.get('http://localhost:8081/healthhub/summaryGraph', { withCredentials: true })
      .then(response => {
        const data = response.data;
        setChartData(data);
        setLoading(false); // 데이터 로딩 완료
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data'); // 에러 발생 시 처리
        setLoading(false);
      });
  }, []);

  // 데이터 로딩 중인 경우 로딩 메시지 표시
  if (loading) {
    return <p>Loading...</p>;
  }

  // 데이터가 없거나 에러가 발생한 경우 에러 메시지 표시
  if (!chartData || error) {
    return <p>{error || 'No data available'}</p>;
  }

  console.log(chartData.memberValue.total_calsium);

  // Chart.js에 사용할 데이터 설정
  const barData = {
    labels: ['단백질', '탄수화물', '당', '지방', '칼슘', '철'],
    datasets: [
      {
        label: '섭취량',
        data: [
          chartData.memberValue ? chartData.memberValue.total_protein : 0,
          chartData.memberValue ? chartData.memberValue.total_carbonhydrate : 0,
          chartData.memberValue ? chartData.memberValue.total_sugar : 0,
          chartData.memberValue ? chartData.memberValue.total_fat : 0,
          chartData.memberValue ? chartData.memberValue.total_calsium : 0,
          chartData.memberValue ? chartData.memberValue.total_fe : 0          
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      },
      {
        label: '평균량',
        data: [
          chartData.standardValue ? chartData.standardValue.st_protein : 0,
          chartData.standardValue ? chartData.standardValue.st_carbonhydrate : 0,
          chartData.standardValue ? chartData.standardValue.st_sugar : 0,
          chartData.standardValue ? chartData.standardValue.st_fat : 0,
          chartData.standardValue ? chartData.standardValue.st_calsium : 0,
          chartData.standardValue ? chartData.standardValue.st_fe : 0          
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)'
      }
    ]
  };

  // Chart.js 설정 옵션
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <section className="daily-nutrition">
      <h2>오늘 섭취 영양분</h2>
      <div className="bar-chart">
        <Bar data={barData} options={barOptions} />
      </div>
    </section>
  );
};

export default DailyNutrition;
