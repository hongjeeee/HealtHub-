package com.smhrd.healthhub;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.smhrd.healthhub.mapper.GraphMapper;
import com.smhrd.healthhub.model.Member;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
public class GraphController {

    @Autowired
    private GraphMapper mapper;

    @GetMapping("/summaryGraph")
    public ResponseEntity<String> getSummaryData(HttpServletRequest request) {

        // 세션에서 사용자 정보 가져오기
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginMember") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Member loginMember = (Member) session.getAttribute("loginMember");
        String mb_id = loginMember.getMb_id();

        // 1. 회원 정보 조회
        Map<String, Object> memberValueMap = mapper.memberValue(mb_id);
        if (memberValueMap == null) {
            memberValueMap = new HashMap<>(); // 빈 맵으로 초기화
        }

        // 2. 표준 영양소 정보 조회
        Map<String, Object> standardValueMap = mapper.standardValue(mb_id);
        if (standardValueMap == null) {
            standardValueMap = new HashMap<>(); // 빈 맵으로 초기화
        } 

        // 3. 결과를 합쳐서 JSON 형태로 반환
        Gson gson = new Gson();
        String summaryJson = gson.toJson(Map.of("memberValue", memberValueMap, "standardValue", standardValueMap));

        return ResponseEntity.ok(summaryJson);
    }

    @GetMapping("/majorRatioGraph")
    public ResponseEntity<String> getMajorRatioData(HttpServletRequest request) {

        // 세션에서 사용자 정보 가져오기
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginMember") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Member loginMember = (Member) session.getAttribute("loginMember");
        String mb_id = loginMember.getMb_id();

        // 1. 회원 3대 영양소 + 나트륨
        Map<String, Object> majorValueMap = mapper.majorValue(mb_id);
        if (majorValueMap == null || majorValueMap.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given user and date.");
        }
        
        

        // 2. 결과를 JSON 형태로 반환
        Gson gson = new Gson();
        String majorValueJson = gson.toJson(Map.of("majorValue", majorValueMap));


        return ResponseEntity.ok(majorValueJson);
    }



}
