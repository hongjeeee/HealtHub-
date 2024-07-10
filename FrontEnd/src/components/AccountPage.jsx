import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from './Header';
import './style/AccountPage.css';
import { useNavigate } from "react-router-dom";
import AuthContext from '../contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

const AccountPage = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        mb_id: '',
        mb_pw: '',
        mb_name: '',
        mb_birthdate: null,
        mb_email: '',
        mb_height: '',
        mb_target_weight: '',
        mb_diet_purpose: '',
    });
    const [editing, setEditing] = useState(false);

    //로그인한 회원 정보 가져오기
    useEffect(() => {
        const getMemberData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/healthhub/myinfo', { withCredentials: true });
                if (response.status === 200) {
                    // 서버에서 받은 생년월일 문자열을 Date 객체로 변환
                    const formattedBirthDate = response.data.mb_birthdate
                        ? new Date(response.data.mb_birthdate).toISOString().split('T')[0]
                        : null;

                    setFormData({
                        ...response.data,
                        mb_birthdate: formattedBirthDate, // 문자열 형식으로 저장
                    });
                }
            } catch (error) {
                console.error('사용자 데이터 가져오기 에러:', error);
                navigate("/login");
            }
        }
        getMemberData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editing) {
            alert("수정하기 버튼을 누른 후 수정하세요.");
            return;
        }
        try {
            const response = await axios.put('http://localhost:8081/healthhub/updateMember', formData, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log('정보 수정 성공:', response.data);
                alert('회원 정보가 수정되었습니다.');
                setEditing(false);
                setFormData(response.data); // 수정된 데이터로 상태 업데이트
            }
        } catch (error) {
            console.error('정보 수정 에러:', error);
            alert("정보수정에 실패했습니다.");
            // 필요한 경우 에러 처리 로직 추가
        }
    };

    const handleDelete = async () => {
        // ... (회원 탈퇴 로직)
    };

    return (
        <div className="account-page">
            <main className="main-content">
                <h2>회원 정보</h2>
                <form className="account-form" onSubmit={handleSubmit}>
                    {/* 입력 필드 */}
                    <div className="form-group">
                        <label>아이디: </label>                        
                        <input type="text" id="id" name="mb_id" value={formData.mb_id} readonly></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호: </label>
                        <input
                            type="password"
                            id="password"
                            name="mb_pw"
                            value={formData.mb_pw}
                            onChange={handleChange}
                            readOnly={!editing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">이름: </label>
                        <input
                            type="text"
                            id="name"
                            name="mb_name"
                            value={formData.mb_name}
                            onChange={handleChange}
                            readOnly={!editing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthDate">생년월일: </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <br/>
                            <DatePicker
                                id="birthDate"
                                // value={formData.birthDate ? AdapterDayjs.date(formData.birthDate) : null} // 기존 코드
                                value={formData.mb_birthdate ? dayjs(formData.mb_birthdate) : null} // dayjs 함수 사용
                                onChange={(newValue) => setFormData({ ...formData, mb_birthdate: newValue && newValue.format('YYYY-MM-DD') })}
                                readOnly={!editing}
                                renderInput={(params) => <TextField {...params} />}
                            />

                        </LocalizationProvider>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">이메일: </label>
                        <input
                            type="email"
                            id="email"
                            name="mb_email"
                            value={formData.mb_email}
                            onChange={handleChange}
                            readOnly={!editing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="height">키: </label>
                        <input
                            type="number"
                            id="height"
                            name="mb_height"
                            placeholder="단위(cm)"
                            value={formData.mb_height}
                            onChange={handleChange}
                            readOnly={!editing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="targetWeight">목표 체중: </label>
                        <input
                            type="number"
                            id="targetWeight"
                            name="mb_target_weight"
                            placeholder="단위(kg)"
                            value={formData.mb_target_weight}
                            onChange={handleChange}
                            readOnly={!editing}
                        />
                    </div>
                    <div className="form-group">
                        <label>목적설정: </label>
                        <div className="goal-buttons">
                            <button
                                type="button"
                                className={formData.mb_diet_purpose === '다이어트' ? 'active' : ''}
                                onClick={() => setFormData({ ...formData, mb_diet_purpose: '다이어트' })}
                                disabled={!editing}
                            >
                                다이어트
                            </button>
                            <button
                                type="button"
                                className={formData.mb_diet_purpose === '벌크업' ? 'active' : ''}
                                onClick={() => setFormData({ ...formData, mb_diet_purpose: '벌크업' })}
                                disabled={!editing}
                            >
                                벌크업
                            </button>
                            <button
                                type="button"
                                className={formData.mb_diet_purpose === '유지' ? 'active' : ''}
                                onClick={() => setFormData({ ...formData, mb_diet_purpose: '유지' })}
                                disabled={!editing}
                            >
                                유지
                            </button>
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button type="button" onClick={handleEditClick} className="update-button">
                            수정하기
                        </button>

                        {editing && (
                            <button type="submit" className="update-button">
                                저장
                            </button>
                        )}

                        <button type="button" className="delete-button" onClick={handleDelete}>
                            회원 탈퇴
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AccountPage;
