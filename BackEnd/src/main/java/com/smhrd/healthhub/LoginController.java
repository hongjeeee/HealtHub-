package com.smhrd.healthhub;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.healthhub.mapper.HealthHubMapper;
import com.smhrd.healthhub.model.Member;

@RestController
public class LoginController {

	@Autowired
	private HealthHubMapper healthHubMapper;

	// @CrossOrigin 어노테이션은 클래스 레벨에 적용
	@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")

	@PostMapping("/login")
	public ResponseEntity<String> login(HttpServletRequest request, HttpServletResponse response,
			@RequestBody Member member) {
		Member foundMember = healthHubMapper.getMemberById(member.getMb_id());

		if (foundMember != null && member.getMb_pw().equals(foundMember.getMb_pw())) {

			// 세션 유효 시간 설정 (예: 30분)
			HttpSession session = request.getSession();
			session.setMaxInactiveInterval(30 * 60); // 초 단위

			session.setAttribute("loginMember", foundMember);

			// 세션 쿠키 설정
			Cookie cookie = new Cookie("JSESSIONID", session.getId());
			cookie.setPath("/home");
			response.addCookie(cookie);

			return ResponseEntity.ok("로그인 성공");
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
		}
	}

	// @GetMapping("/checkSession") 메서드는 로그인 상태를 확인하는 용도이며, CORS 설정이 필요합니다.
	@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
	@GetMapping("/checkSession")
	public ResponseEntity<Map<String, Object>> checkSession(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		boolean isLoggedIn = session != null && session.getAttribute("loginMember") != null;
		String mbName = "";
		if (isLoggedIn) {
			Member loginMember = (Member) session.getAttribute("loginMember");
			mbName = loginMember.getMb_name(); // 사용자 이름 가져오기
		}
		return ResponseEntity.ok(Map.of("isLoggedIn", isLoggedIn, "mb_name", mbName));
	}

	@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
	@GetMapping("/logout")
	public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate(); // 세션 무효화

			// 로그아웃 시 세션 쿠키 삭제
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("JSESSIONID")) {
						cookie.setMaxAge(0); // 쿠키 유효 시간 0으로 설정하여 만료
						cookie.setPath("/");
						response.addCookie(cookie);
						break; // JSESSIONID 쿠키를 찾았으면 반복 종료
					}
				}
			}
		}

		return ResponseEntity.ok("로그아웃 성공");
	}

}
