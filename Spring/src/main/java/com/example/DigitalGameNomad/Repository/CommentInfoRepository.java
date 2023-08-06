package com.example.DigitalGameNomad.Repository;

import com.example.DigitalGameNomad.Entity.CommentInfo;
import com.example.DigitalGameNomad.Entity.ImageInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentInfoRepository extends JpaRepository<CommentInfo, Long> {

}
