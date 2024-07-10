package com.smhrd.healthhub;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.smhrd.healthhub.mapper.HealthHubMapper;
import com.smhrd.healthhub.model.Diet;
import com.smhrd.healthhub.model.Food;
import com.smhrd.healthhub.model.Member;
import com.smhrd.healthhub.model.Menu;
import com.smhrd.healthhub.model.MenuDTO;

import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@Slf4j
public class DataController {

	@Autowired
	private HealthHubMapper mapper;

	@GetMapping("/getweight")
	public ResponseEntity<?> getUserData(HttpServletRequest request) {

		HttpSession session = request.getSession(false);
		if (session != null && session.getAttribute("loginMember") != null) {

			Member loginMember = (Member) session.getAttribute("loginMember");

			Map<String, Object> userData = new HashMap<>();
			userData.put("currentWeight", loginMember.getMb_weight());
			userData.put("targetWeight", loginMember.getMb_target_weight());
			return ResponseEntity.ok(userData);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@PutMapping("/setweight")
	public ResponseEntity<?> updateCurrentWeight(HttpServletRequest request, @RequestBody Member m) {
	    HttpSession session = request.getSession(false);
	    if (session != null && session.getAttribute("loginMember") != null) {
	        Member loginMember = (Member) session.getAttribute("loginMember");
	        
	        // 로그인된 사용자의 몸무게 업데이트
	        mapper.updateCurrentWeight(loginMember.getMb_id(), m.getMb_weight());
	        
	        // 세션에 있는 사용자 정보도 업데이트
	        loginMember.setMb_weight(m.getMb_weight());
	        session.setAttribute("loginMember", loginMember);
	        
	        return ResponseEntity.ok("현재 체중 업데이트 성공");
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }
	}


	@GetMapping("/foods")
	public ResponseEntity<List<Food>> searchFoods(@RequestParam(value = "query", required = false) String query) {
		List<Food> foodList = mapper.searchFoods(query);
		return ResponseEntity.ok(foodList);
	}

	// 메뉴추가
	@PutMapping("/addMenu")
	public ResponseEntity<?> addMenu(HttpServletRequest request, @RequestBody Map<String, Object> requestData) {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("loginMember") == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 세션이 없으면 401 Unauthorized
		}

		Member loginMember = (Member) session.getAttribute("loginMember");
		String mb_id = loginMember.getMb_id();

		try {
			String meal_type = (String) requestData.get("meal_type");
			int food_idx = (int) requestData.get("food_idx");
			int input_amount = (int) requestData.get("input_amount");
			LocalDate dietLocalDate = LocalDate.parse((String) requestData.get("diet_date"));
			java.sql.Date diet_date = java.sql.Date.valueOf(dietLocalDate);

			// 입력 데이터 검증
			if (meal_type == null || !meal_type.matches("(아침|점심|저녁)") || diet_date == null || food_idx <= 0
					|| input_amount <= 0) {
				return ResponseEntity.badRequest().body("올바르지 않은 데이터 형식 또는 필수 데이터 누락");
			}

			Diet diet = mapper.getDietByMbIdAndDate(mb_id, diet_date);
			if (diet == null) {
				diet = new Diet();
				diet.setMb_id(mb_id);
				diet.setDiet_date(diet_date);
				diet.setTotal_calories(0);
				mapper.addDiet(diet); // 먼저 diet를 데이터베이스에 삽입

				// 새로 생성된 diet_idx 값을 가져오기
				diet = mapper.getDietByMbIdAndDate(mb_id, diet_date); // diet_idx 값을 얻기 위해 다시 조회
			}

			Menu menu = new Menu();
			menu.setMeal_type(meal_type);
			menu.setDiet_idx(diet.getDiet_idx());
			menu.setFood_idx(food_idx);
			menu.setInput_amount(input_amount);

			int result = mapper.addMenu(menu);
			if (result > 0) {
				mapper.updateDietNutrition(diet.getDiet_idx(), menu.getFood_idx(), menu.getInput_amount());
				Map<String, Object> response = new HashMap<>();
				response.put("message", "식단 추가 성공");
				response.put("menu", menu);
				return ResponseEntity.ok(response);
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("식단 추가 실패");
			}
		} catch (DateTimeParseException e) {
			return ResponseEntity.badRequest().body("올바르지 않은 날짜 형식");
		} catch (IllegalArgumentException e) {
			log.error("Invalid data format:", e);
			return ResponseEntity.badRequest().body("올바르지 않은 데이터 형식: " + e.getMessage());
		} catch (Exception e) {
			log.error("식단 추가 중 오류 발생:", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
		}

	}

	@GetMapping("/get_total_calories")
	public ResponseEntity<?> getTotalCalories(HttpServletRequest request) {
		HttpSession session = request.getSession(false);

		// 로그인 여부 확인
		if (session == null || session.getAttribute("loginMember") == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Member loginMember = (Member) session.getAttribute("loginMember");
		String mbId = loginMember.getMb_id();

		try {
			Integer totalCalories = mapper.getTotalCaloriesByMbId(mbId);

			// 칼로리 정보가 없을 경우 처리
			if (totalCalories == null) {
				return ResponseEntity.ok(0); // 칼로리가 없으면 0 반환
			} else {
				return ResponseEntity.ok(totalCalories);
			}
		} catch (Exception e) {
			log.error("총 칼로리 조회 중 오류 발생: {}", e.getMessage(), e); // 오류 로그 상세화
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
		}
	}

	@GetMapping("/most-abundant-nutrient")
	public ResponseEntity<?> getMostAbundantNutrient(HttpServletRequest request) {
		HttpSession session = request.getSession(false);

		if (session == null || session.getAttribute("loginMember") == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
		}

		Member loginMember = (Member) session.getAttribute("loginMember");
		String mbId = loginMember.getMb_id();

		try {
			String mostAbundantNutrient = mapper.findMostAbundantNutrient(mbId);
			if (mostAbundantNutrient == null) {
				return ResponseEntity.notFound().build(); // 섭취된 영양소가 없는 경우
			}
			return ResponseEntity.ok(mostAbundantNutrient); // 가장 많은 영양소 반환
		} catch (Exception e) {
			log.error("가장 많이 섭취된 영양소 조회 중 오류 발생: {}", e.getMessage(), e); // 상세 로그 메시지 추가
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error fetching most abundant nutrient");
		}
	}

	// 메뉴 추가
	@GetMapping("/getMenu")
	public ResponseEntity<?> getMenu(HttpServletRequest request, @RequestParam("diet_date") String dietDateStr,
			@RequestParam("meal_type") String mealType) {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("loginMember") == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Member loginMember = (Member) session.getAttribute("loginMember");
		String mbId = loginMember.getMb_id();

		try {
			LocalDate dietDate = LocalDate.parse(dietDateStr);
			Diet diet = mapper.getDietByMbIdAndDate(mbId, java.sql.Date.valueOf(dietDate));

			if (diet != null) {
				// 메뉴 목록 조회 (MenuDTO 객체 리스트로 반환)
				List<MenuDTO> menuList = mapper.getMenuListByDietIdxAndMealType(diet.getDiet_idx(), mealType);

				return ResponseEntity.ok(menuList); // me nuList 바로 반환
			} else {
				return ResponseEntity.notFound().build(); // 식단 정보 없음
			}
		} catch (DateTimeParseException e) {
			log.error("Invalid date format: {}", dietDateStr, e);
			return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다.");
		}
	}

	// foodRecords 전체
	@GetMapping("/foodRecords")
	public ResponseEntity<?> getFoodRecords(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("loginMember") == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Member loginMember = (Member) session.getAttribute("loginMember");
		String mbId = loginMember.getMb_id();

		try {
			List<Map<String, Object>> foodRecords = mapper.getAllFoodRecordsByMbId(mbId);
			return ResponseEntity.ok(foodRecords); // 음식 기록 목록 반환
		} catch (Exception e) {
			log.error("음식 기록 가져오기 중 오류 발생:", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
		}
	}

	// 추천메뉴
	@GetMapping("/getRecommendedMenu")
	public ResponseEntity<?> getRecommendedMenu(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session == null || session.getAttribute("loginMember") == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Member loginMember = (Member) session.getAttribute("loginMember");
		String goal = loginMember.getMb_diet_purpose();

		try {
			List<Food> recommendedFoods = mapper.getRecommendedFoodsByGoal(goal); // 목표에 맞는 음식 목록 조회

			if (recommendedFoods == null || recommendedFoods.isEmpty()) {
				return ResponseEntity.notFound().build(); // 추천 음식이 없는 경우
			}

			return ResponseEntity.ok(recommendedFoods); // 음식 목록 반환
		} catch (Exception e) {
			log.error("추천 메뉴 조회 중 오류 발생: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching recommended menu");
		}
	}

	// 회원가입
	@PostMapping("/signup")
	public ResponseEntity<String> signup(@RequestBody Member member) {
		log.info("회원가입 요청: {}", member); // 회원 정보 로그 출력
		try {
			// 생년월일 변환 (문자열 -> LocalDate)
			Instant instant = member.getMb_birthdate().toInstant();
			ZoneId zone = ZoneId.systemDefault();
			LocalDate birthdate = LocalDateTime.ofInstant(instant, zone).toLocalDate();
			member.setMb_birthdate(Date.from(birthdate.atStartOfDay(zone).toInstant()));
			int result = mapper.registerMember(member);
			if (result > 0) {
				return ResponseEntity.ok("회원가입 성공");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패: 데이터베이스 오류");
			}
		} catch (DateTimeParseException e) {
			return ResponseEntity.badRequest().body("잘못된 날짜 형식입니다.");
		} catch (DataIntegrityViolationException e) { // 데이터 무결성 제약 조건 위반 예외 처리 (예: 아이디 중복)
			return ResponseEntity.badRequest().body("이미 사용 중인 아이디입니다.");
		} catch (Exception e) {
			log.error("회원가입 중 오류 발생:", e); // 에러 로그 출력
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생");
		}
	}
	// 몸무게ㅁㄹ
	@GetMapping("/loginMember")
	 public ResponseEntity<?> getLoginMember(HttpServletRequest request) {
	     HttpSession session = request.getSession(false);
	     if (session != null && session.getAttribute("loginMember") != null) {
	         Member loginMember = (Member) session.getAttribute("loginMember");
	         return ResponseEntity.ok(loginMember); // 사용자 정보 반환
	     } else {
	         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	     }
	 }

}
