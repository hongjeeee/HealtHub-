import React, { useState, useEffect, useRef, useContext } from 'react';
import './style/FirstPage.css';
import kakaologin from './kakao_login_medium_wide.png';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const FirstPage = () => {
  const { setIsLoggedIn, setUserName, isLoggedIn } = useContext(AuthContext);
  const [isSignInActive, setIsSignInActive] = useState(true);
  const containerRef = useRef(null);

  // 로그인 관련 상태
  const [mb_id, setMb_id] = useState('');
  const [mb_pw, setMb_pw] = useState('');
  const [error, setError] = useState('');

  // 회원가입 관련 상태 변수
  const [signupData, setSignupData] = useState({
    mb_id: '',
    mb_pw: '',
    mb_name: '',
    mb_email: '',
    mb_birthdate: '',
    mb_height: '',
    mb_weight: '',
    mb_gender: '',
    mb_diet_purpose: '',
  });
  const [signupError, setSignupError] = useState('');

  const navigate = useNavigate();
  const location = useLocation(); // useLocation 추가
  const from = location.state?.from?.pathname || '/home'; // 이전 경로 가져오기, 없으면 /home으로 설정

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true }); // 로그인 상태이면 이전 경로 또는 /home으로 이동
    }
  }, [isLoggedIn, from, navigate]);

  const toggle = () => {
    setIsSignInActive(prev => !prev);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsSignInActive(true);
    }, 200);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.toggle('sign-in', isSignInActive);
      containerRef.current.classList.toggle('sign-up', !isSignInActive);
    }
  }, [isSignInActive]);

  const REST_API_KEY = 'd81a8c0bc765b79c7531857dd7db86bb';
  const REDIRECT_URI = 'http://localhost:3000/healthhub/Loginkakao';
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const kakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  //로그인 로직
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/healthhub/login', { mb_id, mb_pw }, { withCredentials: true });

      if (response.status === 200) {
        setIsLoggedIn(true);
        setUserName(response.data.mb_name);
        const redirectPath = mb_id === 'admin' ? '/admin' : from;
        navigate(redirectPath, { replace: true }); 
      } else {
        if (response.status === 401) {
          const errorMessage = response.data.message || '로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.';
          setError(errorMessage);
        } else {
          setError('로그인 실패: 서버 오류');
        }
      }
    } catch (error) {
      console.error(error);
      setError('로그인 실패: 네트워크 오류 또는 서버 문제');
    }
  };

  //회원가입 로직

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 현재 시간을 joined_at 값으로 설정
      const joinedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // 회원가입 요청 데이터 생성 (signupData + joined_at)
      const requestData = {
        ...signupData,
        mb_birthdate: signupData.mb_birthdate, // 생년월일은 문자열 그대로 전송
        mb_height: parseFloat(signupData.mb_height) || 0, // 숫자로 변환, 실패 시 0
        mb_weight: parseFloat(signupData.mb_weight) || 0, // 숫자로 변환, 실패 시 0
        mb_bmi: 0, //BMI 초기값 설정
        joined_at: joinedAt,
      };

      // 백엔드에 회원가입 요청 전송
      console.log("리액트 회원가입 요청", requestData);
      const response = await axios.post('http://localhost:8081/healthhub/signup', requestData, { withCredentials: true, });

      console.log('회원가입 성공:', response.data);

      // 로그아웃 처리 (AuthContext의 setIsLoggedIn을 false로 설정)
      setIsLoggedIn(false); // 로그아웃 처리

       // 세션 스토리지에서 loginMember 정보 제거
    sessionStorage.removeItem('loginMember');

      navigate('/healthhub/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('회원가입 에러:', error);

      // 에러 메시지 처리 (예시)
      if (error.response && error.response.data) {
        setSignupError(error.response.data); // 서버에서 전달된 에러 메시지 사용
      } else {
        setSignupError('회원가입 실패'); // 일반적인 에러 메시지
      }
    }
  };





  return (
    <div>
      <div id="container" ref={containerRef} className="container">
        {/* FORM SECTION */}
        <div className="row">
          {/* SIGN UP */}
          <div className={`col align-items-center flex-col sign-up ${isSignInActive ? '' : 'active'}`}>
            <div className="form-wrapper align-items-center">
              <form className="form sign-up" onSubmit={handleSignup}>
                <div className="input-group">
                  <i className='bx bxs-user'></i>
                  <input type="text" name='mb_id' placeholder="아이디" value={signupData.mb_id} onChange={handleChange} />
                </div>
                {/* 비밀번호 입력 */}
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="password" name="mb_pw" placeholder="비밀번호" value={signupData.mb_pw} onChange={handleChange} />
                </div>
                {/* 이메일 입력 */}
                <div className="input-group">
                  <i className='bx bx-mail-send'></i>
                  <input type="email" name="mb_email" placeholder="이메일" value={signupData.mb_email} onChange={handleChange} />
                </div>

                {/* 이름 입력 */}
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="text" name="mb_name" placeholder="이름" value={signupData.mb_name} onChange={handleChange} />
                </div>

                {/* 키 입력 */}
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="text" name="mb_height" placeholder="키 입력" value={signupData.mb_height} onChange={handleChange} />
                </div>

                {/* 몸무게 입력 */}
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="text" name="mb_weight" placeholder="몸무게 입력" value={signupData.mb_weight} onChange={handleChange} />
                </div>

                {/* 생년월일 */}
                <div className="input-group">
                  <i className='bx bxs-calendar'></i>
                  <input type="date" name="mb_birthdate" value={signupData.mb_birthdate} onChange={handleChange} />
                </div>

                {/* 성별 선택 (예: 라디오 버튼) */}
                <div className="radio-group">
                  <label>
                    <input type="radio" name="mb_gender" value="M" onChange={handleChange} /> 남성
                  </label>
                  <label>
                    <input type="radio" name="mb_gender" value="F" onChange={handleChange} /> 여성
                  </label>
                </div>

                {/* 운동 목적 선택 (예: 라디오 버튼) */}
                <div className="radio-group">
                  <label>
                    <input type="radio" name="mb_diet_purpose" value="벌크업" onChange={handleChange} /> 벌크업
                  </label>
                  <label>
                    <input type="radio" name="mb_diet_purpose" value="유지" onChange={handleChange} /> 유지
                  </label>
                  <label>
                    <input type="radio" name="mb_diet_purpose" value="다이어트" onChange={handleChange} /> 다이어트
                  </label>
                </div>
                <button type='submit'>Sign up</button>
                {/* {signupError && <p style={{ color: 'red' }}>{signupError}</p>} */}
                <p>
                  <span>회원이신가요?</span>
                  <b onClick={toggle} className="pointer">로그인하기</b>
                </p>
              </form>
            </div>
          </div>
          {/* END SIGN UP */}

          {/* SIGN IN */}
          <div className={`col align-items-center flex-col sign-in ${isSignInActive ? 'active' : ''}`}>
            <div className="form-wrapper align-items-center">
              <form className="form sign-in" onSubmit={handleLogin}>
                <div className="input-group">
                  <i className='bx bxs-user'></i>
                  <input type="text" placeholder="아이디"
                    value={mb_id} onChange={(e) => setMb_id(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input type="password" placeholder="비밀번호"
                    value={mb_pw} onChange={(e) => setMb_pw(e.target.value)}
                  />
                </div>
                <button type="submit">Sign in</button>
                <button onClick={kakaoLogin} id='kakaologin'><img src={kakaologin} id='kakaoimg'></img></button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p>
                  <span>회원이 아니신가요?</span>
                  <b onClick={toggle} className="pointer">회원가입</b>
                </p>
              </form>
            </div>
            <div className="form-wrapper">
            </div>
          </div>
          {/* END SIGN IN */}
        </div>
        {/* END FORM SECTION */}

        {/* CONTENT SECTION */}
        <div className="row content-row">
          {/* SIGN IN CONTENT */}
          <div className={`col align-items-center flex-col ${isSignInActive ? 'active' : ''}`}>
            <div className="text sign-in">
              <h2>Welcome</h2>
            </div>
            <div className="img sign-in"></div>
          </div>
          {/* END SIGN IN CONTENT */}

          {/* SIGN UP CONTENT */}
          <div className={`col align-items-center flex-col ${isSignInActive ? '' : 'active'}`}>
            <div className="img sign-up"></div>
            <div className="text sign-up">
              <h2>Join with us</h2>
            </div>
          </div>
          {/* END SIGN UP CONTENT */}
        </div>
        {/* END CONTENT SECTION */}
      </div>
    </div>
  );
};

export default FirstPage;
