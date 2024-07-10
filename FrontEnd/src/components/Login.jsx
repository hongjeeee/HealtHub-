import React, { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
    const idRef = useRef();
    const pwRef = useRef();
    const nav = useNavigate();
    const [query] = useSearchParams();

    function login() {
        const inputId = idRef.current.value;
        const inputPw = pwRef.current.value;
        if (inputId === query.get('id') && inputPw === query.get('pw')) {
            nav(`/?nick=${query.get('nick')}`);
        } else {
            alert('정보를 잘못 입력하였습니다.');
        }
    }
    
    return (
        <div>
            ID : <input ref={idRef} name='id'></input>
            <br></br>
            PW : <input ref={pwRef} name='pw' type='password'></input>
            <br></br>
            <button onClick={login}>로그인</button>
        </div>
    );
}

export default Login;