//package com.smhrd.heathhub;
//
//import java.sql.Date;
//import java.sql.Timestamp;
//import java.time.Instant;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.ZoneId;
//import java.time.format.DateTimeFormatter;
//import java.time.format.DateTimeParseException;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.dao.DataIntegrityViolationException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.smhrd.healthhub.mapper.HealthHubMapper;
//import com.smhrd.healthhub.model.Member;
//
//import lombok.extern.slf4j.Slf4j;
//
//@RestController
//@Slf4j
//@RequestMapping("/healthhub/signup") // 엔드포인트 경로 설정
//@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
//public class SignUpController {
//
//    @Autowired
//    private HealthHubMapper mapper;
//
//
//    
//    @PostMapping("/signup")
//    public ResponseEntity<String> signup(@RequestBody Member member) {
//        log.info("회원가입 요청: {}", member); // 회원 정보 로그 출력
//        System.out.println("리액트에서 회원가입 요청");
//        try {
//            // 생년월일 변환 (문자열 -> LocalDate)
//        	Instant instant = member.getMb_birthdate().toInstant();
//            ZoneId zone = ZoneId.systemDefault();
//            LocalDate birthdate = LocalDateTime.ofInstant(instant, zone).toLocalDate();
//            member.setMb_birthdate(Date.valueOf(birthdate));
//
//            // joined_at 값이 null인 경우 현재 시간으로 설정
//            if (member.getJoined_at() == null) {
//                LocalDateTime now = LocalDateTime.now();
//                member.setJoined_at(Timestamp.valueOf(now));
//            }
//
//            // 회원가입 정보 검증 (필요한 경우 추가)
//            // ... (예: 아이디 중복 확인, 비밀번호 유효성 검사 등)
//
//            int result = mapper.insertMember(member);
//            if (result > 0) {
//                return ResponseEntity.ok("회원가입 성공");
//            } else {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패: 데이터베이스 오류");
//            }
//        } catch (DateTimeParseException e) {
//            return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다.");
//        } catch (DataIntegrityViolationException e) { // 데이터 무결성 제약 조건 위반 예외 처리 (예: 아이디 중복)
//            return ResponseEntity.badRequest().body("이미 사용 중인 아이디입니다.");
//        } catch (Exception e) {
//            log.error("회원가입 중 오류 발생:", e); // 에러 로그 출력
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생");
//        }
//    }
//    
//    
//
//}