package com.example.DigitalGameNomad.Repository;

import com.example.DigitalGameNomad.Entity.PostInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostInfoRepository extends JpaRepository<PostInfo, Long> {

    PostInfo findByPostTitle(String postTitle);
}
