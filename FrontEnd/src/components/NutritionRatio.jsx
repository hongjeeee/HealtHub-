import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import './style/NutritionRatio.css';

const NutritionRatio = () => {
    const [chartData, setChartData] = useState(null);
    const [sodiumIntake, setSodiumIntake] = useState(null); // 섭취 나트륨 값 상태 추가
    const [recommendedIntake, setRecommendedIntake] = useState(null); // 권장 섭취량 값 상태 추가
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Ajax 요청을 통해 서버에서 JSON 데이터 가져오기
        axios.get('http://localhost:8081/healthhub/majorRatioGraph', { withCredentials: true })
            .then(response => {
                const data = response.data;
                setChartData(data);

                // 나트륨 섭취량 및 권장 섭취량 데이터 가져오기
                setSodiumIntake(data.majorValue.total_sodium); // 서버에서 받아온 total_sodium 값 사용
                setRecommendedIntake(data.majorValue.st_sodium); // 서버에서 권장 섭취량을 받아옴

                setLoading(false); // 데이터 로딩 완료
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data'); // 에러 발생 시 처리
                setLoading(false);
            });
    }, []);

    // 데이터에서 단백질, 탄수화물, 지방 데이터를 가져옴
    const totalProtein = parseFloat(chartData?.majorValue.total_protein) || 0; // 단위: g
    const totalCarbonhydrate = parseFloat(chartData?.majorValue.total_carbonhydrate) || 0; // 단위: g
    const totalFat = parseFloat(chartData?.majorValue.total_fat) || 0; // 단위: g

    // 칼로리 계산 (1g 당 kcal)
    const calorieProtein = totalProtein * 4;
    const calorieCarbonhydrate = totalCarbonhydrate * 4;
    const calorieFat = totalFat * 9;

    // 전체 칼로리 합 계산
    const totalCalories = calorieProtein + calorieCarbonhydrate + calorieFat;

    // 각 영양소의 비율 계산 (%)
    const proteinRatio = (calorieProtein / totalCalories) * 100;
    const carbonhydrateRatio = (calorieCarbonhydrate / totalCalories) * 100;
    const fatRatio = (calorieFat / totalCalories) * 100;

    const gaugeData = [
        {
            id: '나트륨',
            data: [
                { x: '섭취 나트륨', y: sodiumIntake },
                { x: '평균 섭취량', y: recommendedIntake - sodiumIntake },
            ],
        },
    ];

    const colors = sodiumIntake > recommendedIntake ? ['#FF0000', '#e9ecef'] : ['#76c7c0', '#e9ecef'];
    const textColor = sodiumIntake > recommendedIntake ? '#FF0000' : '#76c7c0';

    const doughnutData = {
        labels: ['단백질', '탄수화물', '지방'],
        datasets: [
            {
                label: '탄단지 비율',
                data: [proteinRatio, carbonhydrateRatio, fatRatio],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    const MyResponsiveRadialBar = ({ data }) => (
        <div style={{ height: '100%', width: '100%' }}>
            <ResponsiveRadialBar
                data={data}
                valueFormat=">-.2f"
                startAngle={-150}
                endAngle={150}
                padding={0.4}
                cornerRadius={10}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                colors={colors}
                radialAxisStart={null} // 축 비활성화
                circularAxisOuter={null} // 축 비활성화
                enableRadialGrid={false} // 그리드 비활성화
                enableCircularGrid={false} // 원형 그리드 비활성화
                legends={[
                    {
                        anchor: 'top',
                        direction: 'row',
                        justify: false,
                        translateX: 8,
                        translateY: 0,
                        itemsSpacing: 6,
                        itemDirection: 'left-to-right',
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        symbolSize: 18,
                        symbolShape: 'square',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000',
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );

    return (
        <div className="ratioChart-div">
            <div className="chart-container">
                <Doughnut data={doughnutData} id="majorGraph"/>
            </div>
            <div className="chart-container">
                <MyResponsiveRadialBar data={gaugeData} id="sodiumGraph"/>
                <div className="gauge-text" style={{ color: textColor }}>{sodiumIntake}</div>
            </div>
        </div>
    );
};

export default NutritionRatio;
