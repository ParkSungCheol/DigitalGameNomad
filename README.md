# 온라인&nbsp;게임&nbsp;박람회
------------
### 왜 이런 프로젝트를 기획하였나요?
> 사용자들이 **[ 직접 체험 ]** 할 수 있도록<br/>
> **[ 3D환경 ]** 을 다뤄보고자<br/>
> **[ 게임 전시관 ]** 형태의 프로젝트<br/>
------------
### 어떤 기술을 사용하였나요?
> **[ 3D 환경 ]**
+ **[ THREE.js ]**
  + 카메라의 움직임을 구현하고 캐릭터가 카메라의 위치를 따라가도록 구현
  + 어두운 환경에서 광원의 위치 변경
  + 색상, 재질, 표면, 빛 굴절률, 두께, 투명도 등 디자인적 요소 구현
+ **[ FBX ]**
  + FBXLoader를 이용해 움직이는 캐릭터 파일을 Scene에 추가
  + AnimationMixer를 이용해 시간의 흐름에 따른 애니메이션 추가
+ **[ CANNON.js ]**
  + 캐릭터와 벽을 서로 상이한 물질로 선언하고 두 재료 간의 충돌 구현
  + 물질의 질량을 부여해 물리적 충돌로 밀려나도록 설정하여 벽을 뚫지못하도록 구현
> **[ REACT ]**
+ **[ React-Redux ]** 
  + React의 prop방식은 컴포넌트 간의 데이터 동기화를 복잡하게 만드는 단점이 있어서 Redux를 이용해 컴포넌트 간의 공유 저장소 구축
> **[ 보안 ]**
+ **[ Spring ]** 
  + 비밀번호 암호화시 BCryptPasswordEncoder를 사용하여 랜덤한 salt값을 활용
> **[ Cloud Server ]**
+ **[ Naver ObjectStorage ]** 
  + 이미지 서버로 활용
+ **[ NaverCloud MicroServer ]** 
  + DB서버로 활용
------------
### 프로젝트는 어떤 서비스를 제공하나요?
+ **비대면 전시관** 서비스 제공
+ 직접 오브젝트와 **상호작용**
  + 각 전시관 부스 **제목을 클릭**하면 해당 웹페이지로 이동
  + **캐릭터, 카메라의 위치**에 따라 영상재생 및 볼륨크기 조절
  + **충돌시스템을 구현**하여 미궁게임 등 직접 참여가능
------------
### 추후 수정하거나 개발하고 싶은 부분이 있나요?
+ Cloud Server에 자동으로 배포할 수 있는 CI/CD 환경 구축
+ 브라우저가 종료되거나 프론트 서버가 재시작될 때 로그인 정보 유실을 방지하기 위해 백엔드에서 인가시스템 구축<br/>
  (이미 백앤드에서 인증시스템은 구축완료)
------------
### 프로젝트 설치 및 실행방법은 어떻게 되나요?
+ **Exhibition** : VS LiveServer를 이용하여 5500번 포트로 실행<br/>
+ **ExhibitionGame** : VS LiveServer를 이용하여 5501번 포트로 실행<br/>
+ **React** : npm start 명령어로 3000번 포트로 실행<br/>
+ **Spring** : SpringBoot이므로 내장 톰캣을 이용해 8088번 포트로 실행 (DB연결이 필요할 시 application.yml에 DB연결정보 추가)<br/>
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
