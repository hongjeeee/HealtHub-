// Loginkakao.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Loginkakao = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const authCode = searchParams.get('code');

    console.log('인가 코드:', authCode);

    if (authCode) {
      // 백엔드로 인가 코드 전송
      axios.post('http://localhost:5000/auth/kakao', { code: authCode })
        .then(response => {
          if (response.data.success) {
            // 로그인 성공, 토큰 저장 및 메인 페이지로 리디렉션
            localStorage.setItem('kakao_token', response.data.token);
            navigate('/'); // 메인 페이지로 리디렉션
          } else {
            // 로그인 실패 처리
            console.error('로그인 실패:', response.data.message);
            alert('로그인에 실패했습니다.');
          }
        })
        .catch(error => {
          console.error('에러 발생:', error);
          alert('로그인 중 에러가 발생했습니다.');
        });
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>카카오 로그인중....</h1>
    </div>
  );
};

export default Loginkakao;
