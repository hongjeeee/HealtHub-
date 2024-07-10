package com.smhrd.healthhub.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Member {

	private String mb_id;
	private String mb_pw;
	private String mb_name;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date mb_birthdate;
	private String mb_email;
	private String mb_gender;
	private Double mb_target_weight;
	private Double mb_height;
	private Double mb_weight;
	private Double mb_bmi;
	private String mb_diet_purpose;
	
}
