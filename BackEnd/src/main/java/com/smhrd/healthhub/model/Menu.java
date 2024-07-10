package com.smhrd.healthhub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Menu {
	private int menu_idx;
	private String meal_type;
	private int diet_idx;
	private int food_idx;
	private int input_amount;
}
