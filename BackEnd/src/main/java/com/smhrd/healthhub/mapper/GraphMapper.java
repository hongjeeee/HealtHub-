package com.smhrd.healthhub.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface GraphMapper {

    Map<String, Object> memberValue(@Param("mb_id") String mb_id);

    Map<String, Object> standardValue(@Param("mb_id") String mb_id);
    
    Map<String, Object> majorValue(@Param("mb_id") String mb_id);
}
