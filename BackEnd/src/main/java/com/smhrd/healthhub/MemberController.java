package com.smhrd.healthhub;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.healthhub.mapper.HealthHubMapper;
import com.smhrd.healthhub.model.Member;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@Slf4j
public class MemberController {
	
	@Autowired
	HealthHubMapper mapper;
	
	
	@GetMapping("/myinfo")
    public ResponseEntity<?> getMyInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginMember") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Member loginMember = (Member) session.getAttribute("loginMember");
        String mbId = loginMember.getMb_id();
        System.out.println(loginMember.getMb_birthdate());
        try {
            Member member = mapper.getMemberById(mbId);
            if (member != null) {
                return ResponseEntity.ok(member);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("회원 정보 조회 중 오류 발생:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
	
	
	@PutMapping("/updateMember")
    public ResponseEntity<?> updateMember(HttpServletRequest request, @RequestBody Member member) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginMember") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Member loginMember = (Member) session.getAttribute("loginMember");
        String mbId = loginMember.getMb_id();

        // 현재 로그인한 사용자의 정보만 수정 가능하도록 확인
        if (!mbId.equals(member.getMb_id())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
        }

        try {

            // 현재 로그인한 사용자의 정보만 수정 가능하도록 확인
            if (!mbId.equals(member.getMb_id())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
            }

            // 수정할 필드만 설정된 새로운 Member 객체 생성
            Member updatedMember = new Member();
            System.out.println("\n"+
                    member.getMb_pw()+"\n"+
                    member.getMb_name()+"\n"+
                    member.getMb_birthdate()+"\n"+
                	member.getMb_email()+"\n"+
                    member.getMb_height()+"\n"+
                    member.getMb_target_weight()+"\n"+
                    member.getMb_diet_purpose());
            
            updatedMember.setMb_id(mbId); // mb_id는 변경 불가
            updatedMember.setMb_pw(member.getMb_pw());
            updatedMember.setMb_name(member.getMb_name());
            updatedMember.setMb_birthdate(member.getMb_birthdate());
            updatedMember.setMb_email(member.getMb_email());
            updatedMember.setMb_height(member.getMb_height());
            updatedMember.setMb_target_weight(member.getMb_target_weight());
            updatedMember.setMb_diet_purpose(member.getMb_diet_purpose());

            int result = mapper.updateMember(updatedMember); // 수정된 객체 전달
            if (result > 0) {
                // 세션 정보 업데이트 (필요한 경우)
                session.setAttribute("loginMember", updatedMember);
                return ResponseEntity.ok("회원 정보 수정 성공");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            log.error("회원 정보 수정 중 오류 발생:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
	
	@DeleteMapping("/deleteMember")
    public ResponseEntity<String> deleteMember(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginMember") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Member loginMember = (Member) session.getAttribute("loginMember");
        String mbId = loginMember.getMb_id();

        try {
            int result = mapper.deleteMember(mbId);
            if (result > 0) {
                session.invalidate(); // 세션 무효화
                return ResponseEntity.ok("회원 탈퇴 성공");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            log.error("회원 탈퇴 중 오류 발생:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
	
	
	

}
