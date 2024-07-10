package com.smhrd.healthhub.mapper;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.smhrd.healthhub.model.Diet;
import com.smhrd.healthhub.model.Food;
import com.smhrd.healthhub.model.Member;
import com.smhrd.healthhub.model.Menu;
import com.smhrd.healthhub.model.MenuDTO;

@Mapper
public interface HealthHubMapper {

		@Select("select * from t_member")
		List<Member> memberList();
		
		int insertMember(Member member);
		
		List<Food> searchFoods(@Param("query") String query);
		
		@Select("SELECT * FROM t_member WHERE mb_id = #{mb_id}")
		Member getMemberById(String mb_id);

		@Update("UPDATE t_member SET mb_weight = #{mb_weight} WHERE mb_id = #{mb_id}")
		int updateCurrentWeight(@Param("mb_id") String mb_id, @Param("mb_weight") Double mb_weight);

		@Select("SELECT * FROM t_diet WHERE mb_id = #{mb_id} AND diet_date = #{diet_date}")
	    Diet getDietByMbIdAndDate(@Param("mb_id") String mb_id, @Param("diet_date") Date diet_date);

		@Insert("insert into t_diet(mb_id, diet_date, total_calories) values(#{mb_id}, #{diet_date}, #{total_calories})")
		void addDiet(Diet diet);
		
		int addMenu(Menu menu);
		
		@Update("CALL update_diet_nutrition(#{dietIdx}, #{foodIdx}, #{inputAmount})")
	    void updateDietNutrition(
	        @Param("dietIdx") int dietIdx, 
	        @Param("foodIdx") int foodIdx, 
	        @Param("inputAmount") int inputAmount
	    ); 
		
		@Select("SELECT food_name, calories FROM t_food WHERE food_idx = #{foodIdx}")
	    Food getFoodNameAndCaloriesById(@Param("foodIdx") int foodIdx);

		@Select("SELECT m.*, f.food_name, f.calories " +
		        "FROM t_menu m " +
		        "JOIN t_food f ON m.food_idx = f.food_idx " +
		        "WHERE m.diet_idx = #{dietIdx} AND m.meal_type = #{mealType}")
		List<MenuDTO> getMenuListByDietIdxAndMealType(
		        @Param("dietIdx") int dietIdx, @Param("mealType") String mealType);
		
		@Select("SELECT COALESCE(SUM(f.calories * m.input_amount), 0) AS total_calories " +
		        "FROM t_menu m " +
		        "JOIN t_food f ON m.food_idx = f.food_idx " +
		        "JOIN t_diet d ON m.diet_idx = d.diet_idx " +
		        "WHERE d.mb_id = #{param1} AND d.diet_date = CURDATE();") // param1 사용
		Integer getTotalCaloriesByMbId(String mb_id); 
		
		@Select("SELECT\r\n"
				+ "    CASE\r\n"
				+ "        WHEN SUM(total_protein) >= SUM(total_carbonhydrate) \r\n"
				+ "             AND SUM(total_protein) >= SUM(total_fat) \r\n"
				+ "             AND SUM(total_protein) >= SUM(total_sugar) THEN 'protein'\r\n"
				+ "        WHEN SUM(total_carbonhydrate) >= SUM(total_fat) \r\n"
				+ "             AND SUM(total_carbonhydrate) >= SUM(total_sugar) THEN 'carbohydrate'\r\n"
				+ "        WHEN SUM(total_fat) >= SUM(total_sugar) THEN 'fat'\r\n"
				+ "        ELSE 'sugar'\r\n"
				+ "    END AS mostAbundantNutrient\r\n"
				+ "FROM t_diet\r\n"
				+ "WHERE mb_id = #{mb_id}\r\n"
				+ "GROUP BY mb_id\r\n"
				+ "LIMIT 1;")
	    String findMostAbundantNutrient(@Param("mb_id") String mb_id);

		int updateMember(Member member);
		
	    int deleteMember(@Param("mbId") String mbId);
	    
	    @Select("SELECT d.*, f.food_name, f.calories, m.input_amount, m.meal_type " +
	            "FROM t_diet d " +
	            "JOIN t_menu m ON d.diet_idx = m.diet_idx " +
	            "JOIN t_food f ON m.food_idx = f.food_idx " +
	            "WHERE d.mb_id = #{mbId}")
	    List<Map<String, Object>> getAllFoodRecordsByMbId(@Param("mbId") String mbId);
	    
	    @Select({
            "<script>",
            "SELECT * FROM t_food WHERE food_idx IN (",
            "SELECT food_idx FROM t_reco_menu WHERE diet_purpose = #{goal}",
            ")",
            "</script>"
	    })
	    List<Food> getRecommendedFoodsByGoal(@Param("goal") String goal);
	    
	    @Insert("INSERT INTO t_member (mb_id, mb_pw, mb_name, mb_email, mb_height, mb_weight, mb_birthdate, mb_gender, mb_diet_purpose, mb_bmi ) " +
	            "VALUES (#{mb_id}, #{mb_pw}, #{mb_name}, #{mb_email}, #{mb_height}, #{mb_weight}, #{mb_birthdate}, #{mb_gender}, #{mb_diet_purpose}, 0)")
	    int registerMember(Member member);
}
