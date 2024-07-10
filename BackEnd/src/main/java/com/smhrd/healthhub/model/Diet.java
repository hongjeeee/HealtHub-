package com.smhrd.healthhub.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Diet {
	
	private int diet_idx;
	private String mb_id;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private java.sql.Date diet_date;
	private int total_calories;
	private double total_protein;
	private double total_carbonhydrate;
	private double total_sugar;
	private double total_fat;
	private double total_calsium;
	private double total_fe;
}
