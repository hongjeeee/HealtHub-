package com.smhrd.healthhub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Food {
	
	private int food_idx;
	private String food_name;
	private Double calories;
	private Double protein;
	private Double fat;
	private Double carbonhydrate;
	private Double sugar;
	private Double cellulose;
	private Double calsium;
	private Double fe;
	private Double sodium;
}
