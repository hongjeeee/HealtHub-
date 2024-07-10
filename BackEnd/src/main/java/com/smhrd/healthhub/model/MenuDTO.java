package com.smhrd.healthhub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuDTO {
    private int menu_idx;
    private String meal_type;
    private int diet_idx;
    private int food_idx;
    private int input_amount;
    private String food_name;
    private double calories;
}
