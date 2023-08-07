# 온라인&nbsp;게임&nbsp;전시관&nbsp;프로젝트
------------
### 왜 이런 프로젝트를 기획하였나요?
> 사용자들이 **[ 직접 체험 ]** 할 수 있도록<br/>
> **[ 3D환경 ]** 을 다뤄보고자<br/>
> **[ 게임 전시관 ]** 형태의 프로젝트<br/>
------------
### 어떤 기술을 사용하였나요?
> **[ 크롤링 및 API ]**
+ [ Selenium ] 
  + 브라우저를 통해 직접 해당 페이지로 접근하는 방식으로 가장 인간의 활동과 유사
  + AWS 프리티어 메모리로는 급격한 성능저하 발생으로 **사용불가**
+ [ Jsoup ] 
  + 적은 메모리로도 사용가능
  + **이미지 로딩 불가** & 지속적인 호출 시 IP차단되거나 500번 503번 서버에러 발생 등으로 데이터 적재 로직의 **안정성 저하 우려**
+ **[ API ]** 
  + 적은 메모리로도 사용가능
  + 이미지를 포함한 상품의 모든 상세정보를 가져올 수 있으면서 최소한의 서버부하로 해결가능<br/> **=> PICK**
> **[ 스프링 배치 ]**
+ **[ Chunk ]** 
  + Tasklet 방식은 tasklet 전체가 트랜잭션으로 다뤄져서 완료되지 않는 이상 DB에 적재하지 않음
  + Chunk방식은 유연한 트랜잭션 관리를 제공해서 페이지 1단위씩 트랜잭션을 구성하여 <br/>
  언제라도 interrupt가 발생하면 이전 페이지까지는 DB에 적재
+ **[ 멀티쓰레드 ]** 
  + API방식을 채택하여 메모리가 부족하지 않은 환경에서 멀티쓰레드를 적용하여 대량의 데이터를 단시간내에 적재
+ **[ 재시도 및 알림 ]**
  + API 호출 시 제대로 된 데이터를 받지 못했을 경우 3번 재시도 <br/>
  => chunk단위가 실패하면 Decider를 설정하여 해당 chunk 3번 재시도 <br/>
  => 모두 실패 시 Slack 알림 띄우도록 설계하여 안정성 보장
> **[ ES, Logstash, RDB ]**
+ **[ ES ]** 
  + 최소 몇 백만 건 이상의 대규모 데이터를 가지고 실시간 검색 및 통계작업에 적합
  + 한국어 검색이 용이하도록 한국어형태소 분석기 Nori와 문자열을 잘라서 찾아내는 nGram 활용
  + 최소한의 검색연관도를 보장하기 위해 min_score : 20을 부여하여 질의
  + 메모리 부족으로 인한 성능저하 방지를 위해 최대 result 반환수를 800개로 한정
+ **[ RDB(MySQL) ]** 
  + 데이터의 일관성 및 무결성 보장, 정형화된 관계파악에 적합
  + MySQL은 무료이고 메모리 사용량이 적어 적합
+ **[ Logstash ]** 
  + RDB(MySQL) => ES 데이터 적재(동기화)
  + schedule에 cron 표현식으로 5초마다 SELECT 문 실행하게 설정
  + statement에 SELECT 할 때 MySQL의 timeStamp를 tracking_column으로 설정하고 <br/>WHERE 조건에 이전에 적재한 timeStamp 값을 :sql_last_value 파라미터로 받아 활용하여 <br/>데이터가 누락되거나 중복되지 않게 적재
+ **[ 데이터 흐름 ]** 
  + 스프링 배치 => RDB(MySQL) 데이터 적재 => Logstash => ES 데이터 적재
> **[ Jenkins ]**
+ **[ CI/CD ]** 
  + gitHub 커밋 => Webhooks를 이용해 Jenkins로 보냄 => Jenkins에서 빌드 전 JUnit5 단위테스트 / 통합테스트 실행 자동화
  + 빌드 후 AWS 인스턴스에 접근해서 배포 자동화
+ **[ Build Periodically ]** 
  + 매일 00:00 모든 배치서버 STOP <br/>=> 00:10 Logstash, ES 메모리 부족으로 인한 성능저하 방지를 위해 재시작 <br/>=> 01:00 모든 배치서버 자동시작
+ **[ 복호화 ]** 
  + git-secret을 이용해 GPG 알고리즘(RSA 기반)으로 암호화된 파일을 PrivateKey를 credential로 저장 후 application.yml을 복호화
> **[ 보안 ]**
+ **[ 스프링 ]** 
  + 보안측면에서 유리한 세션 방식으로 로그인 정보 저장
  + 백엔드 서버에 요청 시 인터셉터 이용해서 세션을 통한 로그인 검증
  + 비밀번호 저장 시 랜덤한 4자리의 Salt 값 생성 후 (비밀번호 + Salt)를 단방향암호화 진행
  + SQL Injection 방지를 위해 myBatis #{} 바인딩 방식 사용
+ **[ AWS ]**
  + 보안그룹과 OpenVPN을 활용하여 허용되지 않은 IP접근 차단
------------
### 프로젝트는 어떤 서비스를 제공하나요?
+ **비대면 전시관** 서비스 제공
+ 직접 오브젝트와 **상호작용**
  + 각 전시관 부스 **제목을 클릭하면 해당 웹페이지로 이동**
  + **캐릭터, 카메라의 위치에 따라 영상재생 및 볼륨크기 조절**
  + **충돌시스템을 구현하여 미궁게임** 등 직접 참여가능
------------
### 추후 수정하거나 개발하고 싶은 부분이 있나요?
+ 서버 성능저하 방지를 위해 권한검증방식을 기존의 세션방식에서 **JWT 방식**으로 변경
+ 적재된 데이터를 제공할 수 있는 **OPEN API 및 API 명세서** 제공 **(Rest API 적용)**
+ 현재 적용중인 nginx를 이용해 **무중단 배포** 구현
+ 쿠버네티스와 도커를 활용하여 **로드밸런싱** 적용
+ 서버 성능저하 방지를 위해 캐싱 목적의 **인메모리 DB** 구축
+ **크롤링IP 감지&차단**
+ 적재된 데이터를 활용한 **빅데이터분석 및 문서화** 구현
------------
### 프로젝트 설치 및 실행방법은 어떻게 되나요?
> 서버 설정 및 개인정보를 application.yml에 포함하고 있어서 현재 GIT에 올린 버전은 모두 **git-secret을 이용해 암호화**한 상태입니다.<br/>그러므로 로컬에서 실행하는 것이 아닌 **하단의 주소를 통해 서버에 접속**하여 확인해주세요.
------------
### 프로젝트 주소 및 스크린샷을 첨부해주세요.
+ **주소 : https://www.juroSpring.o-r.kr**
+ 스크린샷
  + 검색화면
    <img width="901" alt="화면 캡처 2023-07-12 172721" src="https://github.com/ParkSungCheol/ShoppingMall_vue/assets/93702296/6beb4687-8c34-4db0-85fd-f66d3fbf69a0">
  + 통계화면(시계열검색)
    <img width="904" alt="화면 캡처 2023-07-12 172846" src="https://github.com/ParkSungCheol/ShoppingMall_vue/assets/93702296/dbfea2eb-c336-478f-9aa9-8701d9830349">
  + 문자메시지 전송시스템
    <img width="914" alt="화면 캡처 2023-07-12 172920" src="https://github.com/ParkSungCheol/ShoppingMall_vue/assets/93702296/f31d9f9f-78bd-4085-908a-0bf091a76054">
------------

# :video_game:온라인&nbsp;게임&nbsp;전시관&nbsp;프로젝트:video_game:
![header](https://capsule-render.vercel.app/api?type=waving&color=auto&height=300&section=header&text=DigitalGameNomad&fontSize=80)


### <li>Main&nbsp;Page</li>
![image](https://user-images.githubusercontent.com/93702328/162620241-41851b64-1e5b-46c0-b27f-cb0bfccdb23a.png)
</br></br></br></br></br>

### <li>Exhibition&nbsp;Page</li>
![image](https://user-images.githubusercontent.com/93702328/162623318-e5c16c80-2da4-43a8-b23d-aa0c0c953b60.png)
</br></br></br></br></br>

<details>
<summary><h3>Description&nbsp;File :open_file_folder:</h3></summary>
<div markdown="1">

  [DigitalGameNomad File.pdf](https://github.com/Yooodh/DigitalGameNomad/files/8460632/DigitalGameNomad.File.pdf)

  </div>
</details>
</br></br></br>



### :pushpin:&nbsp;Purpose&nbsp;:pushpin: 

코로나 이후 사회적 거리두기로 인해 대면활동이 많은 제약을 받으면서 </br>
게임 전시관 박람 또한 오프라인 진행에 많은 차질이 생기고 있다. </br>
이에 따라 비대면 전시의 필요성이 커지고 있는 환경이다. </br>
현재 진행되고 있는 온라인 전시회의 경우 대부분 방송 형식으로 진행되고 있으며, </br>
참여자가 직접 전시관을 체험하고 관람하기 보다는 보이는 화면에 경험을 의존하다 보니 </br>
참여자들의 만족도가 현저히 낮은 상황이다. </br>
이를 보완하고 대면 행사의 문제점을 해결하기 위해 Digital Game Nomad는 </br>
온라인 게임 전시관을 주제로 직접 체험하는 경험을 제공할 수 있는 3D맵 형태로 구현하고, </br>
다양한 부분에서 참여자와의 상호작용을 구현하는 데 목적을 둔다. </br></br></br></br></br>

### :pencil2:&nbsp;Main&nbsp;Skill&nbsp;:pencil2:

<img src="https://img.shields.io/badge/React-lightgray?logo=react" data-canonical-src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&amp;logo=Vue.js&amp;logoColor=white" style="max-width: 100%;">

<img src="https://img.shields.io/badge/Three.js-white?logo=three.js&logoColor=black" data-canonical-src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&amp;logo=Vue.js&amp;logoColor=white" style="max-width: 100%;">

<img src="https://camo.githubusercontent.com/5521c01b150bd8e7a7c23ea3974b5ea8ac776e920e838d1ca73f491c9f2ed7d8/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f537072696e6720426f6f742d3644423333463f7374796c653d26666c61742d737175617265266c6f676f3d537072696e67426f6f74266c6f676f436f6c6f723d7768697465" data-canonical-src="https://img.shields.io/badge/Spring Boot-6DB33F?style=&amp;flat-square&amp;logo=SpringBoot&amp;logoColor=white" style="max-width: 100%;">

<img src="https://camo.githubusercontent.com/373d4fa9ba9245d811336f29bdca4617c00739b772ec8f2ef6ed0f9e7a42e81d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d7953514c2d3434373941313f7374796c653d666c61742d737175617265266c6f676f3d4d7953514c266c6f676f436f6c6f723d7768697465" data-canonical-src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&amp;logo=MySQL&amp;logoColor=white" style="max-width: 100%;">

<img src="https://camo.githubusercontent.com/0e3ce1a36c4a35d9416f69d96e42d89b071239b9824b752866c9d393aa582368/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f434c4f5641204f70656e204150492d3033433735413f7374796c653d666c61742d737175617265266c6f676f3d4e61766572266c6f676f436f6c6f723d7768697465" data-canonical-src="https://img.shields.io/badge/CLOVA Open API-03C75A?style=flat-square&amp;logo=Naver&amp;logoColor=white" style="max-width: 100%;"> </br> </br> </br> </br></br>        

### :triangular_ruler:&nbsp;Tools&nbsp;:triangular_ruler:

<img src="https://camo.githubusercontent.com/559725f0cca06215283b12ee9bf65c13d9de0ede1c095dd0410d016e463b4798/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f56697375616c2053747564696f20436f64652d3030374143433f7374796c653d666c61742d737175617265266c6f676f3d56697375616c53747564696f436f6465266c6f676f436f6c6f723d7768697465" data-canonical-src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat-square&amp;logo=VisualStudioCode&amp;logoColor=white" style="max-width: 100%;">

<img src="https://camo.githubusercontent.com/93bc423ef5afc1d96da90ee44d05f6c78b91ca2ec911926b4d4536077da51850/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f476974204875622d3138313731373f7374796c653d666c61742d737175617265266c6f676f3d476974487562266c6f676f436f6c6f723d7768697465" data-canonical-src="https://img.shields.io/badge/Git Hub-181717?style=flat-square&amp;logo=GitHub&amp;logoColor=white" style="max-width: 100%;">

<img src="https://camo.githubusercontent.com/f387e5d62a5ee9af7f5697c412bc3ad3d4efaed6aa22937dc72223a1545dbb68/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f45636c697073652d3243323235353f7374796c653d666c61742d737175617265266c6f676f3d45636c69707365266c6f676f436f6c6f723d7768697465" data-canonical-src="https://img.shields.io/badge/Eclipse-2C2255?style=flat-square&amp;logo=Eclipse&amp;logoColor=white" style="max-width: 100%;"> </br></br></br></br></br>


### :scissors:&nbsp;Except&nbsp;:scissors:
##### React google, kakao, naver key 제외

##### Spring amazon s3 key 제외

##### Exhibition Resources 제외
</br></br></br></br></br>



![Footer](https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=footer)
