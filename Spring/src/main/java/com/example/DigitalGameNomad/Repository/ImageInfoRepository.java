package com.example.DigitalGameNomad.Repository;

import com.example.DigitalGameNomad.Entity.Companyinfo;
import com.example.DigitalGameNomad.Entity.ImageInfo;
import com.example.DigitalGameNomad.Entity.PostInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageInfoRepository extends JpaRepository<ImageInfo, Long> {

    ImageInfo findByPostKey(PostInfo postKey);
    ImageInfo findBycompanykey(Companyinfo companykey);
}
