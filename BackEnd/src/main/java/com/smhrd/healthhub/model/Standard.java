package com.smhrd.healthhub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Standard {
	
	private String st_idx;
	private char st_gender;
	private int st_age_group_s;
	private int st_age_group_e;
	private double st_calories;
	private double st_protein;
	private double st_carbonhydrate;
	private double st_sugar;
	private double st_fat;
	private double st_calsium;
	private double st_fe;
	private double st_sodium;

}
