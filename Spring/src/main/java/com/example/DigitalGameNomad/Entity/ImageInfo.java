package com.example.DigitalGameNomad.Entity;

import com.example.DigitalGameNomad.Entity.PostInfo;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.lang.Nullable;

import javax.persistence.*;

@Entity
@Table(name = "image")
@DynamicInsert // insert 할 때 null 값인 field 제외 => DB에 설정된 default 값으로 설정된 값으로 DB 저장
public class ImageInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_key")
    private Long imageKey;
    @Column
    private String image_url;

    @Nullable
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_key")
    private PostInfo postKey;

    @Nullable
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_key")
    private Companyinfo companykey;

    public Long getImageKey() {
        return imageKey;
    }

    public void setImageKey(Long imageKey) {
        this.imageKey = imageKey;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public PostInfo getPostKey() {
        return postKey;
    }

    public void setPostKey(PostInfo postKey) {
        this.postKey = postKey;
    }

    public Companyinfo getCompanykey() {
        return companykey;
    }

    public void setCompanykey(Companyinfo companykey) {
        this.companykey = companykey;
    }
}
