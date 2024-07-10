package com.smhrd.healthhub;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.smhrd.healthhub.mapper.HealthHubMapper;
import com.smhrd.healthhub.model.Member;

@Controller
public class HomeController {
	
	@Autowired
	HealthHubMapper mapper;
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home() {
				
		List<Member> memberList = mapper.memberList(); 
		for(Member m : memberList) {
			System.out.println(m.getMb_id());
			System.out.println(m.getMb_pw());
		}
		return "home";
	}
	
}
