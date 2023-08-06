package com.example.DigitalGameNomad.Repository;

import com.example.DigitalGameNomad.Entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    UserInfo findByUserKey(Long userKey);
    UserInfo findByUserId(String userId);
}
