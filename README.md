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
  + 각 전시관 부스 **제목을 클릭**하면 해당 웹페이지로 이동
  + **캐릭터, 카메라의 위치**에 따라 영상재생 및 볼륨크기 조절
  + **충돌시스템을 구현**하여 미궁게임 등 직접 참여가능
------------
### 프로젝트 설치 및 실행방법은 어떻게 되나요?
> Exhibition : VS LiveServer를 이용하여 5500번 포트로 실행
> ExhibitionGame : VS LiveServer를 이용하여 5501번 포트로 실행
> React : npm start 명령어로 3000번 포트로 실행
> Spring : SpringBoot이므로 내장 톰캣을 이용해 8088번 포트로 실행(DB연결이 필요할 시 application.yml에 DB연결정보 추가)
------------
### 프로젝트 스크린샷을 첨부해주세요.
+ 블로그
  + https://believeme.tistory.com/entry/Threejs-Cannonjs%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B2%8C%EC%9E%84-%EC%A0%84%EC%8B%9C%ED%9A%8C-%ED%94%8C%EB%9E%AB%ED%8F%BC-%EC%A0%9C%EC%9E%91
+ 스크린샷
  + Main&nbsp;Page<br/>
    ![image](https://user-images.githubusercontent.com/93702328/162620241-41851b64-1e5b-46c0-b27f-cb0bfccdb23a.png)
  + Exhibition&nbsp;Page<br/>
    ![image](https://user-images.githubusercontent.com/93702328/162623318-e5c16c80-2da4-43a8-b23d-aa0c0c953b60.png)
------------
