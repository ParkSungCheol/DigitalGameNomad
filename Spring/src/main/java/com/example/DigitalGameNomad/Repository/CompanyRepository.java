package com.example.DigitalGameNomad.Repository;

import com.example.DigitalGameNomad.Entity.Companyinfo;
import com.example.DigitalGameNomad.Entity.PostInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Companyinfo,Long> {

//   Companyinfo findBycompany_key (Long company_key);
    List<Companyinfo> findBycompanykey(Long companykey);
    List<Companyinfo> deleteByCompanykey (Long companykey);
    List<Companyinfo> findByuserKey_userKey(Long userKey);
}
