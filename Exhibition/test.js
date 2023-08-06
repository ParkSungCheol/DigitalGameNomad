import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/MTLLoader.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/controls/PointerLockControls.js';
import { PositionalAudioHelper } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/helpers/PositionalAudioHelper.js';
import { CannonDebugRenderer } from './data/CannonDebugRenderer.js';

// import GifLoader from './gif-loader.js';
let manager = new THREE.LoadingManager();
let cmanager = new THREE.LoadingManager();
var playrate = 0;
var togglelink = false ;

let pointerlockmute= false;

//영상 변수선언
let video , videoImage ,videoImageContext, videoTexture;
let video1 , videoImage1 ,videoImageContext1, videoTexture1;
let video2 , videoImage2 ,videoImageContext2, videoTexture2;
let video3 , videoImage3 ,videoImageContext3, videoTexture3;
let video4 , videoImage4 ,videoImageContext4, videoTexture4;
let video5 , videoImage5 ,videoImageContext5, videoTexture5;
let videoPromise, videoPromise1, videoPromise2, videoPromise3, videoPromise4, videoPromise5, videoPromise6;

let fontData;
let fontData2;

// AJAX 요청을 통해 JSON 파일을 가져오는 함수
async function fetchFontData() {
  try {
    const response = await fetch('./data/NanumSquare ExtraBold_Regular.json');
    const response2 = await fetch('./data/Balsamiq Sans_Regular.json');
    fontData = await response.json();
    fontData2 = await response2.json();
  } catch (error) {
    console.error('Error fetching font data:', error);
  }
}

// 함수 호출
fetchFontData();


class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
};
class FiniteStateMachine {
  constructor() {
    this._states = {};
    this._currentState = null;
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }

  Update(timeElapsed, input) {
    if (this._currentState) {
      this._currentState.Update(timeElapsed, input);
    }
  }
};

class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('run', RunState);
  }
};

class State {
  constructor(parent) {
    this._parent = parent;
  }

  Enter() { }
  Exit() { }
  Update() { }
};


class WalkState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'walk';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['walk'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'run') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (moveForward || moveBackward || moveLeft || moveRight) {
      if (moveShift) {
        this._parent.SetState('run');
      }
      else {
        this._parent.SetState('walk');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};

class RunState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'run';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['run'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'walk') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (moveForward || moveBackward || moveLeft || moveRight) {
      if (!moveShift) {
        this._parent.SetState('walk');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};


class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'idle';
  }

  Enter(prevState) {
    const idleAction = this._parent._proxy._animations['idle'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Exit() {
  }

  Update(_, input) {
    if (moveShift && (moveForward || moveBackward || moveLeft || moveRight)) {
      this._parent.SetState('run');
    }
    else if ((moveForward || moveBackward || moveLeft || moveRight)) {
      this._parent.SetState('walk');
    }
  }
};



class BasicCharacterController {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this.domElement = params.domElement;
    this._camera = params.camera;
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3();

    this._animations = {};

    this._stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this._animations));

    this._LoadModels();
  }
  _LoadModels() {
    const loader = new FBXLoader(cmanager);
    const Font_loader = new THREE.FontLoader(manager);

    // Font_loader.load("./data/Balsamiq Sans_Regular.json", (font) => {

    //   const geometry_2 = new THREE.TextGeometry("unpacking", {
    //     font: font,
    //     size: 3,
    //     height: 0.2,
    //     curveSegments: 12,
    //     bevelEnabled: true,
    //     bevelThickness: 0.03,
    //     bevelSize: 0.03,
    //     bevelOffset: 0.005,
    //     bevelSegments: 24
        
    //   });
    //   geometry_2.center();

    //   const material_2 = new THREE.MeshStandardMaterial({
    //     color: "#86807d",
    //     roughness: 0.3,
    //     metalness: 0.7,
    //   });

    //   const mesh_2 = new THREE.Mesh(geometry_2, material_2);
    //   this._params.scene.add(mesh_2);
    //   mesh_2.position.set(0, 15, 50);
    //   mesh_2.rotation.y = -3.2;

    // });//3D font end

    let characterFolder;
    let fbxPath;
    
        if(characters[0] == 2) {
          characterFolder = './resources/stefani/';
          fbxPath = 'stefani.fbx';
    
        }else if(characters[0] == 1){
          characterFolder = './resources/aj/';
          fbxPath = 'aj.fbx';
        }
 
        loader.setPath(characterFolder);
        loader.load(fbxPath, (fbx) => {
          fbx.scale.setScalar(0.03);
          fbx.traverse(c => {
            c.castShadow = true;
          });
  
          this._target = fbx;
          this._params.scene.add(this._target);
  
          this._mixer = new THREE.AnimationMixer(this._target);
  
          manager.onLoad = () => {
            this._stateMachine.SetState('idle');
          
       


const instructions = document.querySelector('#loading-after');
visual = true;
$("#loading").hide();

document.querySelector("#loading-after").style.display = 'block';
instructions.addEventListener('click', function () {
  document.querySelector("#crosshair").style.display = 'inline';
  controls.lock();

    if(playrate ==0){

    ////////////////
    //오디오 리스너//
    ////////////////

    //포켓몬
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const positionalAudio = new THREE.PositionalAudio( listener );
    positionalAudio.setMediaElementSource( video);
    //소리 범위 설정
    positionalAudio.setRefDistance( 13 ) ;
    //소리 방향 설정  360도로(범위 , 줄어드는 범위 설정 , ?? )
    positionalAudio.setDirectionalCone( 70, 20, 0  );
    positionalAudio.setRolloffFactor (3);
    positionalAudio.setDistanceModel ('exponential');
    
    
    //풋볼매니저
    const positionalAudio1 = new THREE.PositionalAudio( listener );
    positionalAudio1.setMediaElementSource( video1);
    positionalAudio1.setRefDistance( 10 );
    positionalAudio1.setDirectionalCone( 70, 20, 0 );
    positionalAudio1.setRolloffFactor (2.25);
    positionalAudio1.setDistanceModel ('exponential');

    //포르자
    const positionalAudio2 = new THREE.PositionalAudio( listener );
    positionalAudio2.setMediaElementSource( video2);
    positionalAudio2.setRefDistance( 13 );
    positionalAudio2.setDirectionalCone( 70, 20, 0 );
    positionalAudio2.setRolloffFactor (2.6);
    positionalAudio2.setDistanceModel ('exponential');

    //콜오브듀티
    const positionalAudio3 = new THREE.PositionalAudio( listener );
    positionalAudio3.setMediaElementSource( video3);
    positionalAudio3.setRefDistance( 11 );
    positionalAudio3.setDirectionalCone( 70, 20, 0 );
    positionalAudio3.setRolloffFactor (2);
    positionalAudio3.setDistanceModel ('exponential');

    //언패킹
    const positionalAudio4 = new THREE.PositionalAudio( listener );
    positionalAudio4.setMediaElementSource( video4);
    positionalAudio4.setRefDistance( 13 );
    positionalAudio4.setDirectionalCone( 70, 20, 0 );
    positionalAudio4.setRolloffFactor (3);
    positionalAudio4.setDistanceModel ('exponential');

    //툰체
    const positionalAudio5 = new THREE.PositionalAudio( listener );
    positionalAudio5.setMediaElementSource( video5);
    positionalAudio5.setRefDistance( 11 );
    positionalAudio5.setDirectionalCone( 70, 20, 0 );
    positionalAudio5.setRolloffFactor (2.8);
    positionalAudio5.setDistanceModel ('exponential');


    ////////////
    // 스피커 //
    ////////////

    //포켓몬
    const pokeball1 = new GLTFLoader(manager);
    pokeball1.load('./resources/pokeball/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.set(50, 6, -80);
      model.add(positionalAudio); //포켓몬 영상 소리
      model.scale.set(10, 10, 10);
      scene.add(model);
    })

    //풋볼매니저 스피커 
    const pokeball2 = new GLTFLoader(manager);
    pokeball2.load('./resources/pokeball/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 6, -80);
      model.add(positionalAudio1); //풋볼매니저 영상 소리
      model.scale.set(10, 10, 10);
      scene.add(model);
    });

    // 포르자 스피커 
    const pokeball3 = new GLTFLoader(manager);
    pokeball3.load('./resources/pokeball/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.set(-50, 6, -80);
      model.add(positionalAudio2); //포르자 영상 소리 
      model.scale.set(10, 10, 10);
      scene.add(model);
    });

    //콜오브듀티 스피커 
    const pokeball5 = new GLTFLoader(manager);
    pokeball5.load('./resources/pokeball/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.set(-50, 6, 80);
      model.rotateY(Math.PI);
      model.add(positionalAudio3); //콜오브듀티 영상 소리 
      model.scale.set(10, 10, 10);
      scene.add(model);
    });

    //언패킹 스피커 
    const pokeball4 = new GLTFLoader(manager);
    pokeball4.load('./resources/pokeball/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 6, 80);
      model.rotateY(Math.PI);
      model.add(positionalAudio4); //언패킹 영상 소리 
      model.scale.set(10, 10, 10);
      scene.add(model);
    });

    //툰체 스피커 1번 
    const pokeball6 = new GLTFLoader(manager);
    pokeball6.load('./resources/pokeball/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.set(50, 6, 80);
      model.rotateY(Math.PI);
      model.add(positionalAudio5); //툰체 영상 소리 
      model.scale.set(10, 10, 10);
      scene.add(model);
    });


    videoPromise = video.play();
    videoPromise1 = video1.play();
    videoPromise2 = video2.play();
    videoPromise3 = video3.play();
    videoPromise4 = video4.play();
    videoPromise5 = video5.play();


    }
    playrate ++;

    });
console.log("리소스 완료")
};
          const _OnLoad = (animName, anim) => {
            const clip = anim.animations[0];
            const action = this._mixer.clipAction(clip);
  
            this._animations[animName] = {
              clip: clip,
              action: action,
            };
          };
        
          const loader = new FBXLoader(cmanager);
          loader.setPath(characterFolder);
          loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
          loader.load('run.fbx', (a) => { _OnLoad('run', a); });
          loader.load('Idle.fbx', (a) => { _OnLoad('idle', a); });
  
        
        });




  }


  



  
  

  get Position() {
    return this._position;
  }

  get Rotation() {
    if (!this._target) {
      return new THREE.Quaternion();
    }
    return this._target.quaternion;
  }

  Update(timeInSeconds) {

    controlObject = this._target;

    if (controlObject.position.x > 245) {
      controlObject.position.x = 245;
    };
    
    if (controlObject.position.x < -245) {
      controlObject.position.x = -245;
    };

    if (controlObject.position.z > 145) {
      controlObject.position.z = 145;
    };

    if (controlObject.position.z < -145) {
      controlObject.position.z = -145;
    };

    if (!this._stateMachine._currentState) {
      return;
    }

  
    this._stateMachine.Update(timeInSeconds, this._input);
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    controlObject.getWorldPosition(this._camera.position);
    // 3인칭시점



    if(visual == true){
      this._camera.position.x = controlObject.position.x ;
      this._camera.position.z = controlObject.position.z ;
      
  }else{
    this._camera.position.x = controlObject.position.x + Math.sin(this._camera.rotation.y) * 10;
    this._camera.position.z = controlObject.position.z + Math.cos(this._camera.rotation.z) * 10;
  }

        // this.camera.position.x = this.target.x + this.radius * Math.sin(this.theta * Math.PI / 180) * Math.cos(this.phi * Math.PI / 180);
        // this.camera.position.y = this.target.y + this.radius * Math.sin(this.phi * Math.PI / 180);
        // this.camera.position.z = this.target.z + this.radius * Math.cos(this.theta * Math.PI / 180) * Math.cos(this.phi * Math.PI / 180);
        // this.camera.updateMatrix();
        //  this.camera.lookAt(this.target);
  
    this._camera.position.y = 10;
        // this._camera.lookAt(controlObject.position);

    if (!_R.equals(this._camera.quaternion)) {
      var qm = this._camera.quaternion.clone();
      //  console.log("x = "+ Math.ceil(qm.x*100),"y = "+Math.ceil(qm.y*100),"z = "+ Math.ceil(qm.z*100),"w = "+ Math.ceil(qm.w*100));
      // qm.y += 0.1;
      // qm.w += 0.1;
      qm.x = _R.x;
      qm.z = _R.z;
      controlObject.quaternion.slerp(qm, 1);
      controlObject.rotateY(Math.PI);
      // this._camera.quaternion = qm;
      // this._camera.quaternion.normalize();
    }

    let speed;
    let cameraDirection = new THREE.Vector3();
  
    if(iscollide) {
      speed = 0;
    }
    else if (!moveShift) {
      speed = 0.7;
    }
    else {
      speed = 1;
    }
    if (moveForward) {
      objectBody.velocity.x = this._camera.getWorldDirection(cameraDirection).x*speed;
      objectBody.velocity.z = this._camera.getWorldDirection(cameraDirection).z*speed;

      objectBody.position.x += objectBody.velocity.x;
      objectBody.position.z += objectBody.velocity.z;
      if(moveLeft) {
        controlObject.rotateY(-Math.PI/4);
      }
      if(moveRight) {
        controlObject.rotateY(Math.PI/4);
      }
    }
    if (moveBackward) {
      let vector = new THREE.Vector3(this._camera.getWorldDirection(cameraDirection).x, this._camera.getWorldDirection(cameraDirection).y, this._camera.getWorldDirection(cameraDirection).z);
      let axis = new THREE.Vector3(0, 1, 0);
      let angle = Math.PI;
      vector.applyAxisAngle(axis, angle);
      objectBody.velocity.x = vector.x*speed;
      objectBody.velocity.z = vector.z*speed;
      objectBody.position.x += objectBody.velocity.x;
      objectBody.position.z += objectBody.velocity.z;
      controlObject.rotateY(-Math.PI);
      if(moveForward) {
        controlObject.rotateY(-Math.PI);
      }
      if(moveLeft) {
        controlObject.rotateY(Math.PI/4);
        controlObject.rotateY(-Math.PI);
      }
      if(moveRight) {
        controlObject.rotateY(-Math.PI/4);
        controlObject.rotateY(-Math.PI);
      }
    }
    if (moveLeft) {
      let vector = new THREE.Vector3(this._camera.getWorldDirection(cameraDirection).x, this._camera.getWorldDirection(cameraDirection).y, this._camera.getWorldDirection(cameraDirection).z);
      let axis = new THREE.Vector3(0, 1, 0);
      let angle = Math.PI / 2;
      vector.applyAxisAngle(axis, angle);
      objectBody.velocity.x = vector.x * speed;
      objectBody.velocity.z = vector.z * speed;
      objectBody.position.x += objectBody.velocity.x;
      objectBody.position.z += objectBody.velocity.z;
      controlObject.rotateY(Math.PI / 2);
    }
    if (moveRight) {
      let vector = new THREE.Vector3(this._camera.getWorldDirection(cameraDirection).x, this._camera.getWorldDirection(cameraDirection).y, this._camera.getWorldDirection(cameraDirection).z);
      let axis = new THREE.Vector3(0, 1, 0);
      let angle = -Math.PI / 2;
      vector.applyAxisAngle(axis, angle);
      objectBody.velocity.x = vector.x * speed;
      objectBody.velocity.z = vector.z * speed;
      objectBody.position.x += objectBody.velocity.x;
      objectBody.position.z += objectBody.velocity.z;
      controlObject.rotateY(-Math.PI / 2);
    }

    controlObject.position.x = objectBody.position.x;
    controlObject.position.y = objectBody.position.y - 2;
    controlObject.position.z = objectBody.position.z;

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }
};

let camera, scene, renderer, controls;


const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveShift = false;
let new_controls;
let previousRAF = null;
let visual;
let mixers = [];
let oldElapsedTime = 0;
let world;
let wall1, wall2, wall3, wall4;
let wall1Body, wall2Body, wall3Body, wall4Body;
let concreteMaterial;
let plasticMaterial;
let CannonDebugRenderer_1;
let objectShape;
let objectBody;
let controlObject;
let mutekey = false;
let iscollide = false;


let url = decodeURIComponent(location.href);
url = decodeURIComponent(url);
let characters;
    // url에서 '?' 문자 이후의 파라미터 문자열까지 자르기
characters = url.substring( url.indexOf('?')+1, url.length );
    // 파라미터 구분자("&") 로 분리
characters = characters.split("&&");
characters[0] = characters[0].split("=")[1];
console.log(characters[0]);

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();
const loader_ = new THREE.TextureLoader(manager);
const texture_blank = loader_.load("./img/blank.png");


init();
//animate();

function init() {

  // 카메라 설정
  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 1.0;
  const far = 200.0;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 25);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  //라이트 설정
  let light = new THREE.PointLight(0xFFFFFF, 1.0);
  light.position.set(0, 100, 0);
  // light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.bias = -0.001;
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500.0;

  //shadow map 범위
  light.shadow.camera.left = 150;
  light.shadow.camera.right = -150;
  light.shadow.camera.top = 50;
  light.shadow.camera.bottom = -50;
  scene.add(light);

  //const helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  light = new THREE.AmbientLight(0xFFFFFF, 0.25);
  scene.add(light);

  //click 화면
  controls = new PointerLockControls(camera, document.body);



  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');


  controls.addEventListener('lock', function () {

    instructions.style.display = 'none';
    blocker.style.display = 'none';

  });

  controls.addEventListener('unlock', function () {

    blocker.style.display = 'block';
    instructions.style.display = '';

  });

  scene.add(controls.getObject());
  //click 화면 end

  function onKeyDown(event) {
    if(!iscollide) {
    switch (event.keyCode) {

      case 16:
        moveShift = true;
        break;

      case 87:
        moveForward = true;
        break;

      case 65:
        moveLeft = true;
        break;

      case 83:
        moveBackward = true;
        break;

      case 68:
        moveRight = true;
        break;

        case 86:
          visual = !visual;
          break;

          case 77:
            mutekey = !mutekey;
            break;

    }
  }
  };

  function onKeyUp(event) {

    switch (event.keyCode) {

      case 16:
        moveShift = false;
        break;

      case 87:
        moveForward = false;
        iscollide = false;
        break;

      case 65:
        moveLeft = false;
        iscollide = false;
        break;

      case 83:
        moveBackward = false;
        iscollide = false;
        break;

      case 68:
        moveRight = false;
        iscollide = false;
        break;
    }

  };

  document.addEventListener('keydown', (e) => onKeyDown(e), false);
  document.addEventListener('keyup', (e) => onKeyUp(e), false);

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

  concreteMaterial = new CANNON.Material('concrete');
  plasticMaterial = new CANNON.Material('plastic');
  const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
      friction: 0.1,
      restitution: 0.7
    }
  );

  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);

  world.addContactMaterial(concretePlasticContactMaterial);


  cmanager.onLoad = function ( ) {

    console.log( 'Character Loading complete!');

  // floor

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150, 10, 10),
    new THREE.MeshStandardMaterial({
      color: 0x808080,
    
    }));
  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

//  CannonDebugRenderer_1 = new CannonDebugRenderer(scene, world);

  const floorShape = new CANNON.Box(new CANNON.Vec3(plane.scale.x * 100, 0.1, plane.scale.z * 100));
  const floorBody = new CANNON.Body();
  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  floorBody.material = plasticMaterial;
  world.addBody(floorBody);

  objectShape = new CANNON.Box(new CANNON.Vec3(1.9, 1.9, 1.9));
  objectBody = new CANNON.Body({
    mass: 0.1,
    position: new CANNON.Vec3(0, 2, 0),
    shape: objectShape,
    material: plasticMaterial,
    
  
  });
  world.addBody(objectBody);
  const loader = new THREE.CubeTextureLoader(manager);
  const texture = loader.load([
    './resources/right.jpg',
    './resources/left.jpg',
    './resources/top.jpg',
    './resources/bottom.jpg',
    './resources/front.jpg',
    './resources/back.jpg',
  ]);
  texture.encoding = THREE.sRGBEncoding;
  scene.background = texture;




  //벽1
  wall1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 20, 150), //x가로, y높이, z길이?
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  wall1.position.set(75, 10, 0); // 벽 위치
  wall1.castShadow = true;
  wall1.receiveShadow = true;
  scene.add(wall1);

  // ---------------------------------cannon
  const wall1Shape = new CANNON.Box(new CANNON.Vec3(wall1.scale.x, wall1.scale.y * 10, wall1.scale.z * 100));
  wall1Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(wall1.position.x, wall1.position.y, wall1.position.z),
    shape: wall1Shape,
    material: concreteMaterial,
  });
  wall1Body.collisionResponse = 0.1;
  wall1Body.addEventListener("collide", () => {
    iscollide = true;
  })
  world.addBody(wall1Body);
  


  //벽2
  wall2 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 20, 1), //x가로, y높이, z길이?
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  wall2.position.set(0, 10, 75); // 벽 위치
  wall2.castShadow = true;
  wall2.receiveShadow = true;
  scene.add(wall2);

  //---------------------------------cannon
  const wall2Shape = new CANNON.Box(new CANNON.Vec3(wall2.scale.x * 100, wall2.scale.y * 10, wall2.scale.z));
  wall2Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(wall2.position.x, wall2.position.y, wall2.position.z),
    shape: wall2Shape,
    material: concreteMaterial,
  });
  wall2Body.collisionResponse = 0.1;
  wall2Body.addEventListener("collide", () => {
    iscollide = true;
  })
  world.addBody(wall2Body);

  //벽3
  wall3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 20, 150), //x가로, y높이, z길이?
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  wall3.position.set(-75, 10, 0); // 벽 위치
  wall3.castShadow = true;
  wall3.receiveShadow = true;
  scene.add(wall3);

  // ---------------------------------cannon
  const wall3Shape = new CANNON.Box(new CANNON.Vec3(wall3.scale.x, wall3.scale.y * 10, wall3.scale.z * 100));
  wall3Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(wall3.position.x, wall3.position.y, wall3.position.z),
    shape: wall3Shape,
    material: concreteMaterial,
  });
  wall3Body.collisionResponse = 0.1;
  wall3Body.addEventListener("collide", () => {
    iscollide = true;
  })
  world.addBody(wall3Body);

  //벽4
  wall4 = new THREE.Mesh(
    new THREE.BoxGeometry(150, 20, 1), //x가로, y높이, z길이?
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  wall4.position.set(0, 10, -75); // 벽 위치
  wall4.castShadow = true;
  wall4.receiveShadow = true;
  scene.add(wall4);






  //---------------------------------cannon
  const wall4Shape = new CANNON.Box(new CANNON.Vec3(wall4.scale.x * 100, wall4.scale.y * 10, wall4.scale.z));
  wall4Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(wall4.position.x, wall4.position.y, wall4.position.z),
    shape: wall4Shape,
    material: concreteMaterial,
  });
  wall4Body.collisionResponse = 0.1;
  wall4Body.addEventListener("collide", () => {
    iscollide = true;
  })
  world.addBody(wall4Body);

  // ---------------------------------부스 입구
  const EnterWall1 = new CANNON.Box(new CANNON.Vec3(25, 3, 1));
  const EnterWall1Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(50, 3, 50),
    shape: EnterWall1,
    material: concreteMaterial,
  });

  EnterWall1Body.collisionResponse = 0;
  EnterWall1Body.addEventListener("collide", () => {
    console.log("collide1");

  })
  world.addBody(EnterWall1Body);

  const EnterWall2Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 3, 50),
    shape: EnterWall1,
    material: concreteMaterial,
  });
  EnterWall2Body.collisionResponse = 0;
  EnterWall2Body.addEventListener("collide", () => {
    console.log("collide2");
  })
  world.addBody(EnterWall2Body);

  const EnterWall3Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(-50, 3, 50),
    shape: EnterWall1,
    material: concreteMaterial,
  });
  EnterWall3Body.collisionResponse = 0;
  EnterWall3Body.addEventListener("collide", () => {
    console.log("collide3");
  })
  world.addBody(EnterWall3Body);

  const EnterWall4Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(-50, 3, -50),
    shape: EnterWall1,
    material: concreteMaterial,
  });
  EnterWall4Body.collisionResponse = 0;
  EnterWall4Body.addEventListener("collide", () => {
    console.log("collide4");
  })
  world.addBody(EnterWall4Body);

  const EnterWall5Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 3, -50),
    shape: EnterWall1,
    material: concreteMaterial,
  });
  EnterWall5Body.collisionResponse = 0;
  EnterWall5Body.addEventListener("collide", () => {
    console.log("collide5");
  })
  world.addBody(EnterWall5Body);

  const EnterWall6Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(50, 3, -50),
    shape: EnterWall1,
    material: concreteMaterial,
  });
  EnterWall6Body.collisionResponse = 0;
  EnterWall6Body.addEventListener("collide", () => {
    console.log("collide6");
  })
  world.addBody(EnterWall6Body);

  const EnterWall2 = new CANNON.Box(new CANNON.Vec3(1, 5, 4));
  const EnterWall7Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(-75, 3, 0),
    shape: EnterWall2,
    material: concreteMaterial,
  });
  EnterWall7Body.collisionResponse = 0;
  EnterWall7Body.addEventListener("collide", () => {
    console.log("미궁입구");

      if(characters[0] == 1) { //남자캐릭터
        //window.location.href = 'http://127.0.0.1:5501/?image=1';
        window.location.href = 'http://localhost:5501/?image=1';
      }else if(characters[0]= 2){//여자캐릭터 
        //window.location.href = 'http://127.0.0.1:5501/?image=2';
        window.location.href = 'http://localhost:5501/?image=2';
      }

  })
  world.addBody(EnterWall7Body);

  //부스가림막1
  const partition1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 20, 35),
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  partition1.position.set(25, 10, 57);
  partition1.castShadow = true;
  partition1.receiveShadow = true;
  scene.add(partition1);

  // ---------------------------------cannon
  const partition1Shape = new CANNON.Box(new CANNON.Vec3(partition1.scale.x, partition1.scale.y * 10, partition1.scale.z * 17));
  const partition1Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(partition1.position.x, partition1.position.y, partition1.position.z),
    shape: partition1Shape,
    material: concreteMaterial,
  });
  partition1Body.collisionResponse = 0.1;
  partition1Body.addEventListener("collide", () => {
    // console.log("collide");
  })
  world.addBody(partition1Body);

  //부스가림막2
  const partition2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 20, 35),
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  partition2.position.set(-25, 10, 57);
  partition2.castShadow = true;
  partition2.receiveShadow = true;
  scene.add(partition2);

  // ---------------------------------cannon
  const partition2Shape = new CANNON.Box(new CANNON.Vec3(partition2.scale.x, partition2.scale.y * 10, partition2.scale.z * 17));
  const partition2Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(partition2.position.x, partition2.position.y, partition2.position.z),
    shape: partition2Shape,
    material: concreteMaterial,
  });
  partition2Body.collisionResponse = 0.1;
  partition2Body.addEventListener("collide", () => {
    // console.log("collide");
  })
  world.addBody(partition2Body);

  //부스가림막3
  const partition3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 20, 35),
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  partition3.position.set(25, 10, -57);
  partition3.castShadow = true;
  partition3.receiveShadow = true;
  scene.add(partition3);

  // ---------------------------------cannon
  const partition3Shape = new CANNON.Box(new CANNON.Vec3(partition3.scale.x, partition3.scale.y * 10, partition3.scale.z * 17));
  const partition3Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(partition3.position.x, partition3.position.y, partition3.position.z),
    shape: partition3Shape,
    material: concreteMaterial,
  });
  partition3Body.collisionResponse = 0.1;
  partition3Body.addEventListener("collide", () => {
    // console.log("collide");
  })
  world.addBody(partition3Body);


  //부스가림막4
  const partition4 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 20, 35),
    new THREE.MeshStandardMaterial({
      color: 0xffffff
    }));
  partition4.position.set(-25, 10, -57);
  partition4.castShadow = true;
  partition4.receiveShadow = true;
   scene.add(partition4);

  // ---------------------------------cannon
  const partition4Shape = new CANNON.Box(new CANNON.Vec3(partition4.scale.x, partition4.scale.y * 10, partition4.scale.z * 17));
  const partition4Body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(partition4.position.x, partition4.position.y, partition4.position.z),
    shape: partition4Shape,
    material: concreteMaterial,
  });
  partition4Body.collisionResponse = 0.1;
  partition4Body.addEventListener("collide", () => {
    // console.log("collide");
  })
   world.addBody(partition4Body);





    
  //#13. 텍스트 생성
  function TextMaker(text, x, y, z, textColor, clks) {
    let font = new THREE.FontLoader(manager).parse(fontData)
    let textGeometry = new THREE.TextGeometry(text, { font: font, size: 2, height: 0.5 })
    const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshPhongMaterial({ color: textColor, emissive: textColor, shininess: 255, wireframe: false }))
    textMesh.position.set(x, y, z + 1)
    textMesh.name = text
    textMesh.userData.className = clks ? clks : 'text'
    textMesh.userData.data = text
    return textMesh
  }
  function TextMaker2(text, x, y, z, textColor, clks) {
    let font = new THREE.FontLoader(manager).parse(fontData2)
    let textGeometry = new THREE.TextGeometry(text, { font: font, size: 3, height: 0.5 })
    const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshPhongMaterial({ color: textColor, emissive: textColor, shininess: 200, wireframe: false }))
    textMesh.position.set(x, y, z + 1)
    textMesh.rotation.y = -3.2
    textMesh.name = text
    textMesh.userData.className = clks ? clks : 'text'
    textMesh.userData.data = text
    return textMesh
  }


  //상호작용 컨텐츠
  let group = new THREE.Group()
  
  const title1_materials = [
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/tunche_title.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/tunche_title.png"), opacity: 1, transparent: true }),
  ];
  const title1 = new THREE.Mesh(
    new THREE.BoxGeometry(20, 10, 0.1),
    title1_materials
  );
  title1.position.set(50, 15, 50);
  title1.userData.className = 'tunche';
  group.add(title1);
  scene.add(group);
  

  group = new THREE.Group()
  group.add(TextMaker2('unpacking', 10, 15, 50, '#86807d', 'unpacking'))
  group.userData.txtName = 'yesItsme'
  scene.add(group)

  const unpacking_texture = [
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/unpacking_home.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/unpacking_home.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
  ];
  const unpacking_home = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 5, 4),
    unpacking_texture
  );
  unpacking_home.position.set(-24, 3, 43);
  unpacking_home.castShadow = false;
  unpacking_home.receiveShadow = true;
  unpacking_home.userData.className = 'unpacking';
  group.add(unpacking_home);
  scene.add(group);

  group = new THREE.Group()
  const cube3_1 = new THREE.Mesh(
    new THREE.BoxGeometry(15, 4, 0.1),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/CoD_title.png"), opacity: 1, transparent: true })
  );
  cube3_1.position.set(-50, 15, 50);
  cube3_1.castShadow = false;
  cube3_1.receiveShadow = true;
  cube3_1.userData.className = 'CoD';
  group.add(cube3_1);
  scene.add(group);


  group = new THREE.Group()
  const forza_texture2 = [
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/ForzaHorizon_title.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/ForzaHorizon_title.png"), opacity: 1, transparent: true }),
  ];
  const forza_title = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 0.1),
    forza_texture2
  );
  forza_title.position.set(-50, 15, -50);
  forza_title.castShadow = false;
  forza_title.receiveShadow = true;
  forza_title.userData.className = 'FH';
  group.add(forza_title);
  scene.add(group);

  group = new THREE.Group()
  const forza_texture = [
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/forza_bubble.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/forza_bubble.png"), opacity: 1, transparent: true }),
  ];
  const forza_home = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3, 0.1),
    forza_texture
  );
  forza_home.position.set(-32, 4, -45);
  forza_home.castShadow = false;
  forza_home.receiveShadow = true;
  forza_home.userData.className = 'FH';
  group.add(forza_home);
  scene.add(group);

  group = new THREE.Group()
  const cube5_4 = new THREE.Mesh(
    new THREE.BoxGeometry(18, 3, 0.1),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/FM_title.png"), opacity: 1, transparent: true })
  );
  cube5_4.position.set(0, 15, -50);
  cube5_4.castShadow = false;
  cube5_4.receiveShadow = true;
  cube5_4.userData.className = 'FM';
  group.add(cube5_4);
  scene.add(group)

  group = new THREE.Group()
  group.add(TextMaker('PLAY', 5, 1, -70, '#ffc8c8', 'FM'))
  group.add(TextMaker('DEMO', 12.5, 1, -70, '#ffc8c8', 'FM'))
  // group.add(TextMaker('\n메일:', 0, 10, 0, '#ffc8c8', 'copy'))
  // group.lookAt(-6, 4, 8)
  group.userData.txtName = 'yesItsme'
  scene.add(group)

  group = new THREE.Group()
  const title6_materials = [
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/pokemon.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/pokemon.png"), opacity: 1, transparent: true }),
  ];
  const cube6_1 = new THREE.Mesh(
    new THREE.BoxGeometry(14, 7, 0.1),
    title6_materials
  );
  cube6_1.position.set(50, 15, -50);
  cube6_1.castShadow = false;
  cube6_1.receiveShadow = true;
  cube6_1.userData.className = 'pokemon';
  group.add(cube6_1);
  scene.add(group);
  
  group = new THREE.Group()
  const potemon_texture = [
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/pokemon_bubble3.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/pokemon_bubble3.png"), opacity: 1, transparent: true }),
  ];
  const pokemon_home = new THREE.Mesh(
    new THREE.BoxGeometry(8, 4, 0.1),
    potemon_texture
  );
  pokemon_home.position.set(73, 6, -38);
  pokemon_home.rotation.y = -1.2;
  pokemon_home.castShadow = false;
  pokemon_home.receiveShadow = true;
  pokemon_home.userData.className = 'pokemon';
  group.add(pokemon_home);
  scene.add(group);

  group = new THREE.Group()
  const logo_cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 20),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/logo_DGN.png"), opacity: 1, transparent: true })
  );
  logo_cube1.position.set(74, 10, 0);
  logo_cube1.castShadow = false;
  logo_cube1.receiveShadow = true;
  logo_cube1.userData.className = 'game';
  group.add(logo_cube1);
  scene.add(group);

  group = new THREE.Group()
  const enterMaze = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 10, 10),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/EnterMaze.png"), opacity: 1, transparent: true })
  );
  enterMaze.position.set(-74.3, 5, 0);
  enterMaze.castShadow = false;
  enterMaze.receiveShadow = true;
  enterMaze.userData.className = 'game';
  group.add(enterMaze);
  scene.add(group);

  

  //상호작용 end


//이미지
  const cube1_1 = new THREE.Mesh(
    new THREE.BoxGeometry(49, 20, 0.1),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/tunche_3.jpg") })
  );
  cube1_1.position.set(49, 10, 74);
  cube1_1.castShadow = false;
  cube1_1.receiveShadow = true;
  scene.add(cube1_1);

  const cube1_3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 13, 15),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/tunche_text1.png"), opacity: 1, transparent: true })
  );
  cube1_3.position.set(74, 11, 57);
  cube1_3.castShadow = false;
  cube1_3.receiveShadow = true;
  scene.add(cube1_3);

  const cube1_4 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 35),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/tunche_6.png"), opacity: 1, transparent: true })
  );
  cube1_4.position.set(25.6, 10, 57);
  cube1_4.castShadow = false;
  cube1_4.receiveShadow = true;
  scene.add(cube1_4);

  const cube1_5 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 5, 10),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/tunche_1.jpg") })
  );
  cube1_5.position.set(26, 15, 49);
  cube1_5.castShadow = false;
  cube1_5.receiveShadow = true;
  scene.add(cube1_5);

  const cube1_6 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 5, 10),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/tunche_4.jpg") })
  );
  cube1_6.position.set(26, 8, 49);
  cube1_6.castShadow = false;
  cube1_6.receiveShadow = true;
  scene.add(cube1_6);

  const tunche_bg1 = new THREE.Mesh(
    new THREE.BoxGeometry(49, 20, 0.1),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/tunche_bg3.png"), opacity: 1, transparent: true })
  );
  tunche_bg1.position.set(49, 10, 41);
  scene.add(tunche_bg1);


  // 부스2 unpacking 이미지
  
  const cube2_1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 8, 14),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/unpacking_title.jpg") })
  );
  cube2_1.position.set(24, 15, 49);
  cube2_1.castShadow = false;
  cube2_1.receiveShadow = true;
  scene.add(cube2_1);

  const cube2_2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 8, 14),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/unpacking_1.jpg") })
  );
  cube2_2.position.set(24, 15, 65);
  cube2_2.castShadow = false;
  cube2_2.receiveShadow = true;
  scene.add(cube2_2);

  const cube2_6 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 8, 14),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/unpacking_3.png") })
  );
  cube2_6.position.set(24, 6, 49);
  cube2_6.castShadow = false;
  cube2_6.receiveShadow = true;
  scene.add(cube2_6);

  const cube2_3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 8, 14),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/unpacking_2.jpg") })
  );
  cube2_3.position.set(24, 6, 65);
  cube2_3.castShadow = false;
  cube2_3.receiveShadow = true;
  scene.add(cube2_3);


  const cube2_4 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 15, 15),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/unpacking_text1.png"), opacity: 1, transparent: true })
  );
  cube2_4.position.set(-24, 10, 65);
  cube2_4.castShadow = false;
  cube2_4.receiveShadow = true;
  scene.add(cube2_4);

  const cube2_5 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 15, 15),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/unpacking_text2.png"), opacity: 1, transparent: true })
  );
  cube2_5.position.set(-24, 10, 48);
  cube2_5.castShadow = false;
  cube2_5.receiveShadow = true;
  scene.add(cube2_5);

  // 부스 3 Call of Duty 이미지
  

  const cube3_2 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.1),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/CoD_2.jpg") })
  );
  cube3_2.position.set(-50, 10, 74);
  cube3_2.castShadow = false;
  cube3_2.receiveShadow = true;
  scene.add(cube3_2);

  const cube3_3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 35),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/CoD_3.jpg") })
  );
  cube3_3.position.set(-74, 10, 57);
  cube3_3.castShadow = false;
  cube3_3.receiveShadow = true;
  scene.add(cube3_3);

  const cube3_4 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 35),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/CoD_1.jpg") })
  );
  cube3_4.position.set(-25.6, 10, 57);
  cube3_4.castShadow = false;
  cube3_4.receiveShadow = true;
  scene.add(cube3_4);

  
  // 부스 4 Forza Horizon 5 이미지

  const cube4_1 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.1),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/ForzaHorizon_3.jpg") })
  );
  cube4_1.position.set(-50, 10, -74);
  cube4_1.castShadow = false;
  cube4_1.receiveShadow = true;
  scene.add(cube4_1);

  const cube4_2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 35),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/ForzaHorizon_1.jpg") })
  );
  cube4_2.position.set(-74.3, 10, -57);
  cube4_2.castShadow = false;
  cube4_2.receiveShadow = true;
  scene.add(cube4_2);

  const cube4_3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 35),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/ForzaHorizon_2.jpg") })
  );
  cube4_3.position.set(-25.6, 10, -57);
  cube4_3.castShadow = false;
  cube4_3.receiveShadow = true;
  scene.add(cube4_3);


  // 부스 5 풋볼매니저 2022 이미지

  

  const cube5_1 = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.1),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/FM_1.jpg") })
  );
  cube5_1.position.set(0, 10, -74);
  cube5_1.castShadow = false;
  cube5_1.receiveShadow = true;
  scene.add(cube5_1);

  const cube5_2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 35),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/FM_2.jpg") })
  );
  cube5_2.position.set(-24.4, 10, -57);
  cube5_2.castShadow = false;
  cube5_2.receiveShadow = true;
  scene.add(cube5_2);

  const cube5_3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 20, 35),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/FM_3.jpg") })
  );
  cube5_3.position.set(24.4, 10, -57);
  cube5_3.castShadow = false;
  cube5_3.receiveShadow = true;
  scene.add(cube5_3);


  // 부스 6 포켓몬 이미지
  const cube6_6 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 12, 12),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/pokemon_1.jpg") })
  );
  cube6_6.position.set(25.6, 11, -50);
  cube6_6.castShadow = false;
  cube6_6.receiveShadow = true;
  scene.add(cube6_6);
  
  const cube6_2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 9, 12),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/pokemon_2.jpg") })
  );
  cube6_2.position.set(25.6, 11, -65);
  cube6_2.castShadow = false;
  cube6_2.receiveShadow = true;
  scene.add(cube6_2);

  const cube6_3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 13, 12),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/pokemon_3.jpg") })
  );
  cube6_3.position.set(74.4, 11, -65);
  cube6_3.castShadow = false;
  cube6_3.receiveShadow = true;
  scene.add(cube6_3);

  const cube6_4 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 15, 12),
    new THREE.MeshPhongMaterial({ map: loader_.load("./img/pokemon_4.jpg") })
  );
  cube6_4.position.set(74.4, 10, -50);
  cube6_4.castShadow = false;
  cube6_4.receiveShadow = true;
  scene.add(cube6_4);

  const title6_materials2 = [
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/pokemon_bubble1.png"), opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
  ];
  const cube6_5 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 3, 6),
    title6_materials2
  );
  cube6_5.position.set(70, 8, -51 );
  cube6_5.rotation.y = 0.8;
  cube6_5.castShadow = false;
  cube6_5.receiveShadow = true;
  scene.add(cube6_5);

  // 부스 이미지 end

 
    //----------------------------------------------------------------------

  // 복도
  const tile = [
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: loader_.load("./img/Material_baseColor.png") }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
    new THREE.MeshBasicMaterial({ map: texture_blank, opacity: 1, transparent: true }),
  ];
  const floortile1 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 39),
    tile
  );
  floortile1.position.set(55, 0, 19.5 );
  floortile1.castShadow = false;
  floortile1.receiveShadow = true;
  scene.add(floortile1);

  const floortile2 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 39),
    tile
  );
  floortile2.position.set(15, 0, 19.5 );
  floortile2.castShadow = false;
  floortile2.receiveShadow = true;
  scene.add(floortile2);

  const floortile3 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 39),
    tile
  );
  floortile3.position.set(-25, 0, 19.5 );
  floortile3.castShadow = false;
  floortile3.receiveShadow = true;
  scene.add(floortile3);

  const floortile4 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 39),
    tile
  );
  floortile4.position.set(-65, 0, 19.5 );
  floortile4.castShadow = false;
  floortile4.receiveShadow = true;
  scene.add(floortile4);

  const floortile5 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 40),
    tile
  );
  floortile5.position.set(55, 0, -20 );
  floortile5.castShadow = false;
  floortile5.receiveShadow = true;
  scene.add(floortile5);

  const floortile6 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 40),
    tile
  );
  floortile6.position.set(15, 0, -20 );
  floortile6.castShadow = false;
  floortile6.receiveShadow = true;
  scene.add(floortile6);

  const floortile7 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 40),
    tile
  );
  floortile7.position.set(-25, 0, -20 );
  floortile7.castShadow = false;
  floortile7.receiveShadow = true;
  scene.add(floortile7);

  const floortile8 = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.1, 40),
    tile
  );
  floortile8.position.set(-65, 0, -20 );
  floortile8.castShadow = false;
  floortile8.receiveShadow = true;
  scene.add(floortile8);

  
  // const floor1 = new GLTFLoader();
  // floor1.load('./resources/floor/scene.gltf', (gltf) => {

  //   const model = gltf.scene;
  //   model.position.set(50, 0.1, 24.7);
  //   model.scale.set(8.35, 1, 8.3);
  //   scene.add(model);
  // });

  // const floor2 = new GLTFLoader();
  // floor2.load('./resources/floor/scene.gltf', (gltf) => {

  //   const model = gltf.scene;
  //   model.position.set(50, 0.1, -24.5);
  //   model.scale.set(8.35, 1, 8.1);
  //   scene.add(model);
  // });

  // const floor3 = new GLTFLoader();
  // floor3.load('./resources/floor/scene.gltf', (gltf) => {

  //   const model = gltf.scene;
  //   model.position.set(0, 0.1, 24.7);
  //   model.scale.set(8.35, 1, 8.3);
  //   scene.add(model);
  // });

  // const floor4 = new GLTFLoader();
  // floor4.load('./resources/floor/scene.gltf', (gltf) => {

  //   const model = gltf.scene;
  //   model.position.set(0, 0.1, -24.5);
  //   model.scale.set(8.35, 1, 8.1);
  //   scene.add(model);
  // });

  // const floor5 = new GLTFLoader();
  // floor5.load('./resources/floor/scene.gltf', (gltf) => {

  //   const model = gltf.scene;
  //   model.position.set(-50, 0.1, 24.7);
  //   model.scale.set(8.35, 1, 8.3);
  //   scene.add(model);
  // });

  // const floor6 = new GLTFLoader();
  // floor6.load('./resources/floor/scene.gltf', (gltf) => {

  //   const model = gltf.scene;
  //   model.position.set(-50, 0.1, -24.5);
  //   model.scale.set(8.35, 1, 8.1);
  //   scene.add(model);
  // });

  const fire_extinguisher1 = new GLTFLoader(manager);
  fire_extinguisher1.load('./resources/fire_extinguisher/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(70, 0, -44);
    model.rotation.set(0, Math.PI * 1.5, 0);
    model.scale.set(0.02, 0.02, 0.02);
    scene.add(model);
  });

  const fire_extinguisher2 = new GLTFLoader(manager);
  fire_extinguisher2.load('./resources/fire_extinguisher/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(70, 0, -42);
    model.rotation.set(0, Math.PI * 1.5, 0);
    model.scale.set(0.02, 0.02, 0.02);
    scene.add(model);
  });

  const fire_extinguisher3 = new GLTFLoader(manager);
  fire_extinguisher3.load('./resources/fire_extinguisher/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-70, 0, 44);
    model.rotation.set(0, Math.PI * 0.5, 0);
    model.scale.set(0.02, 0.02, 0.02);
    scene.add(model);
  });

  const fire_extinguisher4 = new GLTFLoader(manager);
  fire_extinguisher4.load('./resources/fire_extinguisher/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-70, 0, 42);
    model.rotation.set(0, Math.PI * 0.5, 0);
    model.scale.set(0.02, 0.02, 0.02);
    scene.add(model);
  });

//   const center = new OBJLoader(manager);
//   center.load('./resources/uxrzone/source/UXR.obj', (object) => {
//     // 모델 로드가 완료되었을때 호출되는 함수
//     object.position.set(0,30,0);
//     object.scale.set(3, 3, 3);
//     scene.add(object);
// }, function (xhr) {
//     // 모델이 로드되는 동안 호출되는 함수
//     console.log(xhr.loaded / xhr.total * 100, '% loaded');
// }, function (error) {
//     // 모델 로드가 실패했을 때 호출하는 함수
//     alert('모델을 로드 중 오류가 발생하였습니다.');
// });


      ///////////
// VIDEO 포켓몬 //
///////////
video = document.createElement( 'video' );
//영상소스 주소 
video.src = "videos/poketmon.mp4";
// video.setAttribute("preload", "auto");
video.load();
video.muted = true;
videoImage = document.createElement( 'canvas' );
//영상의 사이즈 
videoImage.width = 1280;
videoImage.height = 720;
videoImageContext = videoImage.getContext( '2d' );
// background color if no video present
videoImageContext.fillStyle = '#000000';
videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

videoTexture = new THREE.Texture( videoImage );
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, side:THREE.DoubleSide } );
//영상창 크기 설정 (창크기에 맞춰 영상재생됨)
var movieGeometry = new THREE.PlaneGeometry(45, 15);
var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
movieScreen.position.set(50,11,-74);

scene.add(movieScreen);

 ///////////
  // VIDEO 풋볼매니저 //
	///////////

	// create the video element
	video1 = document.createElement( 'video' );
  //영상소스 주소 
    video1.src = "videos/football.mp4";
    video1.load(); 
    video1.muted = true;
    videoImage1 = document.createElement( 'canvas' );
    //영상의 사이즈 
    videoImage1.width = 1280;
    videoImage1.height = 720;
    videoImageContext1 = videoImage1.getContext( '2d' );
    // background color if no video present
    videoImageContext1.fillStyle = '#000000';
    videoImageContext1.fillRect( 0, 0, videoImage1.width, videoImage1.height );
    videoTexture1 = new THREE.Texture( videoImage1 );
    videoTexture1.minFilter = THREE.LinearFilter;
    videoTexture1.magFilter = THREE.LinearFilter;
    
    var movieMaterial1 = new THREE.MeshBasicMaterial( { map: videoTexture1, overdraw: true, side:THREE.DoubleSide } );
    //영상창 크기 설정 (창크기에 맞춰 영상재생됨)
    var movieGeometry1 = new THREE.PlaneGeometry(45, 15);
    var movieScreen1 = new THREE.Mesh( movieGeometry1, movieMaterial1 );
    movieScreen1.position.set(0.5,11,-73);
    scene.add(movieScreen1);

  ///////////
  // VIDEO 포르자 //
	///////////

	// create the video element
	video2 = document.createElement( 'video' );


  //영상소스 주소 
    video2.src = "videos/forza.mp4";
    video2.load(); // must call after setting/changing source
    video2.muted = true;
    videoImage2 = document.createElement( 'canvas' );
    //영상의 사이즈 
    videoImage2.width = 1280;
    videoImage2.height = 720;
    videoImageContext2 = videoImage2.getContext( '2d' );
    // background color if no video present
    videoImageContext2.fillStyle = '#000000';
    videoImageContext2.fillRect( 0, 0, videoImage2.width, videoImage2.height );
  
    videoTexture2 = new THREE.Texture( videoImage2 );
    videoTexture2.minFilter = THREE.LinearFilter;
    videoTexture2.magFilter = THREE.LinearFilter;
    
    var movieMaterial2 = new THREE.MeshBasicMaterial( { map: videoTexture2, overdraw: true, side:THREE.DoubleSide } );
    //영상창 크기 설정 (창크기에 맞춰 영상재생됨)
    var movieGeometry2 = new THREE.PlaneGeometry(45, 15);
    var movieScreen2 = new THREE.Mesh( movieGeometry2, movieMaterial2 );
    movieScreen2.position.set(-50,11,-73);
  
    scene.add(movieScreen2);

      ///////////
  // VIDEO 콜오브듀티 //
	///////////

	// create the video element
	video3 = document.createElement( 'video' );


  //영상소스 주소 
    video3.src = "videos/callofduty.mp4";

    video3.load(); // must call after setting/changing source
    video3.muted = true;
    videoImage3 = document.createElement( 'canvas' );
    //영상의 사이즈 
    videoImage3.width = 1280;
    videoImage3.height = 720;
  
    videoImageContext3 = videoImage3.getContext( '2d' );
    // background color if no video present
    videoImageContext3.fillStyle = '#000000';
    videoImageContext3.fillRect( 0, 0, videoImage3.width, videoImage3.height );
  
    videoTexture3 = new THREE.Texture( videoImage3 );
    videoTexture3.minFilter = THREE.LinearFilter;
    videoTexture3.magFilter = THREE.LinearFilter;
    
    var movieMaterial3 = new THREE.MeshBasicMaterial( { map: videoTexture3, overdraw: true, side:THREE.DoubleSide } );

    //영상창 크기 설정 (창크기에 맞춰 영상재생됨)
    var movieGeometry3 = new THREE.PlaneGeometry(45, 15);
    var movieScreen3 = new THREE.Mesh( movieGeometry3, movieMaterial3 );
    movieScreen3.position.set(-50, 11, 73);
    movieScreen3.rotateY(Math.PI);
  
    scene.add(movieScreen3);

      ///////////
  // VIDEO 언패킹 //
	///////////

	// create the video element
	video4 = document.createElement( 'video' );


  //영상소스 주소 
    video4.src = "videos/unpacking.mp4";

    video4.load(); // must call after setting/changing source
    video4.muted = true;
    videoImage4 = document.createElement( 'canvas' );
    //영상의 사이즈 
    videoImage4.width = 1280;
    videoImage4.height = 720;
    
  
    videoImageContext4 = videoImage4.getContext( '2d' );
    // background color if no video present
    videoImageContext4.fillStyle = '#000000';
    videoImageContext4.fillRect( 0, 0, videoImage4.width, videoImage4.height );
  
    videoTexture4 = new THREE.Texture( videoImage4 );
    videoTexture4.minFilter = THREE.LinearFilter;
    videoTexture4.magFilter = THREE.LinearFilter;
    
    var movieMaterial4 = new THREE.MeshBasicMaterial( { map: videoTexture4, overdraw: true, side:THREE.DoubleSide } );
    //영상창 크기 설정 (창크기에 맞춰 영상재생됨)
    var movieGeometry4 = new THREE.PlaneGeometry(45, 15);
    var movieScreen4 = new THREE.Mesh( movieGeometry4, movieMaterial4 );
    movieScreen4.position.set(0, 11, 73);
    movieScreen4.rotateY(Math.PI);
  
    scene.add(movieScreen4);

                  ///////////
  // VIDEO 툰체 //
	///////////

	// create the video element
	video5 = document.createElement( 'video' );


  //영상소스 주소 
    video5.src = "videos/tunche.mp4";
   
    video5.load(); // must call after setting/changing source
    video5.muted = true;
    videoImage5 = document.createElement( 'canvas' );
    //영상의 사이즈 
    videoImage5.width = 1280;
    videoImage5.height = 720;
    
    videoImageContext5 = videoImage5.getContext( '2d' );
    // background color if no video present
    videoImageContext5.fillStyle = '#000000';
    videoImageContext5.fillRect( 0, 0, videoImage5.width, videoImage5.height );
  
    videoTexture5 = new THREE.Texture( videoImage5 );
    videoTexture5.minFilter = THREE.LinearFilter;
    videoTexture5.magFilter = THREE.LinearFilter;
    
    var movieMaterial5 = new THREE.MeshBasicMaterial( { map: videoTexture5, overdraw: true, side:THREE.DoubleSide } );

    //영상창 크기 설정 (창크기에 맞춰 영상재생됨)
    var movieGeometry5 = new THREE.PlaneGeometry(45, 15);
    var movieScreen5 = new THREE.Mesh( movieGeometry5, movieMaterial5 );
    movieScreen5.position.set(50,11,73);
    movieScreen5.rotateY(Math.PI);
  
    scene.add(movieScreen5);




//////////
///부스///
//////////
  //부스 1 (툰체)
  const tent = new GLTFLoader(manager);
  tent.load('./resources/tent/scene.gltf', (gltf) => {

    const model = gltf.scene;
    // model.position.set(0, 2, 0);
    model.position.set(50, 2, 62);
    model.scale.set(3, 1, 1.5);
    scene.add(model);
  });

  



  //부스 2 (언패킹)
  const wood_floor = new GLTFLoader(manager);
  wood_floor.load('./resources/cherry_wood_floor/scene.gltf', (gltf) => {
    
    const model = gltf.scene;
    model.position.set(0, 0.05, 57);
    model.scale.set(0.19, 0.1, 0.14);    
    scene.add(model);
  });

  const boxes1_1 = new GLTFLoader(manager);
  boxes1_1.load('./resources/boxes1/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-27, 0, 65);
    model.rotation.set(0, Math.PI, 0);
    model.scale.set(0.5, 0.3, 0.5);
    scene.add(model);
  }, undefined, (error) => {
    console.log(error);
  });

  const boxes2_1 = new GLTFLoader(manager);
  boxes2_1.load('./resources/boxes2/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-22, 0, 60);
    model.scale.set(3, 2.5, 3);

    scene.add(model);
  })

  const boxex3_1 = new GLTFLoader(manager);
  boxex3_1.load('./resources/boxes3/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-19, 0, 70);
    model.scale.set(6, 6, 6);
    scene.add(model);
  })

  const amazon_box_1 = new GLTFLoader(manager);
  amazon_box_1.load('./resources/amazon_box/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-12, 0, 72);
    model.scale.set(0.055, 0.04, 0.055);
    scene.add(model);
  });

  const amazon_box_2 = new GLTFLoader(manager);
  amazon_box_2.load('./resources/amazon_box/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-12, 1.4, 72);
    model.scale.set(0.055, 0.04, 0.055);
    scene.add(model);
  });

  const boxes1_2 = new GLTFLoader(manager);
  boxes1_2.load('./resources/boxes1/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(15, 0, 71);
    model.rotation.set(0, Math.PI, 0);
    model.scale.set(0.5, 0.3, 0.5);
    scene.add(model);
  }, undefined, (error) => {
    console.log(error);
  });

  const boxes2_2 = new GLTFLoader(manager);
  boxes2_2.load('./resources/boxes2/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(15, 0, 71);
    model.scale.set(3, 2.5, 3);

    scene.add(model);
  })


  const amazon_box_3 = new GLTFLoader(manager);
  amazon_box_3.load('./resources/amazon_box/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(23, 0, 67);
    model.scale.set(0.055, 0.04, 0.055);
    scene.add(model);
  });

  const amazon_box_4 = new GLTFLoader(manager);
  amazon_box_4.load('./resources/amazon_box/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(23, 1.4, 67);
    model.scale.set(0.055, 0.04, 0.055);
    scene.add(model);
  });

  const amazon_box_5 = new GLTFLoader(manager);
  amazon_box_5.load('./resources/amazon_box/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(19, 0, 67);
    model.scale.set(0.055, 0.04, 0.055);
    scene.add(model);
  });

  

  const fox = new GLTFLoader(manager);
  fox.load('./resources/fox/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-10, 2, 60);
    model.rotation.set(0, Math.PI * 0.5, 0);
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);
  });

  const book = new GLTFLoader(manager);
  book.load('./resources/book/scene.gltf', (gltf) => {
    
    const model = gltf.scene;
    model.position.set(0, 1, 65);
    model.scale.set(0.07, 0.07, 0.07);
    scene.add(model);
  });

  const shiba = new GLTFLoader(manager);
  shiba.load('./resources/shiba/scene.gltf', (gltf) => {
    
    const model = gltf.scene;
    model.position.set(15, 2, 60);
    model.scale.set(1.5, 1.5, 1.5);
    model.rotation.set(0, Math.PI, 0);
    scene.add(model);
  }, undefined, (error) => {
    console.log(error);
  });

  const chestnut = new GLTFLoader(manager);
  chestnut.load('./resources/chestnut/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(10, 1.5, 63);
    model.scale.set(0.7, 0.7, 0.7);
    scene.add(model);
  });

  const message_board = new GLTFLoader(manager);
  message_board.load('./resources/message_board/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(18, 0, 47);
    scene.add(model);
  });
  // 부스 2


  // 부스 3 (콜 오브 듀티)
  const marine = new GLTFLoader(manager);
  marine.load('./resources/marine/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-47, 0, 52);
    model.rotation.set(0, Math.PI / 2, 0);
    model.scale.set(2, 2, 2);
    scene.add(model);
  });

  const grenade1 = new GLTFLoader(manager);
  grenade1.load('./resources/grenade/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-57, 0, 58);
    model.scale.set(2, 2, 2);
    scene.add(model);
  });

  const grenade2 = new GLTFLoader(manager);
  grenade2.load('./resources/grenade/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-54, 0, 61);
    model.scale.set(2, 2, 2);
    scene.add(model);
  });

  const turret = new GLTFLoader(manager);
  turret.load('./resources/turret/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-68, 0, 58);
    model.rotation.set(0, Math.PI * 2.2, 0);
    model.scale.set(0.018, 0.023, 0.018);
    scene.add(model);

  });

  const missile = new GLTFLoader(manager);
  missile.load('./resources/missile/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-63, 1.5, 65);
    model.rotation.set(0, Math.PI * 2.7, 0);
    model.scale.set(0.007, 0.01, 0.007);
    scene.add(model);
  });
  
  
 
  
  // 부스 3


  // 부스 4 (포르자 호라이즌)
  const lamborghini = new GLTFLoader(manager);
  lamborghini.load('./resources/lamborghini/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-52, 0, -54.3);
    model.rotation.set(0, Math.PI * 1.5, 0);
    model.scale.set(0.017, 0.02, 0.017);
    scene.add(model);
  });

  const flag = new GLTFLoader(manager);
  flag.load('./resources/flag/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-47, 7.5, -58);
    model.rotation.set(0, Math.PI * 1.5, Math.PI * 1.4);
    model.scale.set(2, 1.5, 2);
    scene.add(model);
  });

  const tower = new GLTFLoader(manager);
  tower.load('./resources/tower/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-47, 0, -59);
    model.scale.set(0.5, 0.7, 0.5);
    scene.add(model);
  })

  const track = new GLTFLoader(manager);
  track.load('./resources/track/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-52, 0.1, -63);
    // model.rotation.set(0, Math.PI / 2, 0);
    model.scale.set(0.7, 1.7, 0.53);
    scene.add(model);
  })

  const stop_sign_man = new GLTFLoader(manager);
  stop_sign_man.load('./resources/stop_sign_man/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-29, 1, -45);
    model.rotation.set(0, Math.PI * 3.5, 0);
    model.scale.set(1.5, 1, 1.5);
    scene.add(model);
  });
  // 부스 4


  // 부스 5  (풋볼 매니저 2022)
  const football_field = new GLTFLoader(manager);
  football_field.load('./resources/football_field/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(0.1, -0.1, -57);
    model.rotation.set(0, Math.PI / 2, 0);
    model.scale.set(0.044, 0.003, 0.041);
    scene.add(model);

  });

  const football_ball = new GLTFLoader(manager);
  football_ball.load('./resources/football_soccerball/scene.gltf', (glft) => {

    const model = glft.scene;
    model.position.set(0.2, 0.5, -57);
    model.scale.set(0.2, 0.2, 0.2);
    scene.add(model);

  }, undefined, (error) => {
    console.log(error);
    console.log("에러!");
  });

  const football_gate_1 = new GLTFLoader(manager);
  football_gate_1.load('./resources/football_gate/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(-21, 1, -57);
    model.scale.set(1.7, 4.5, 1.2);
    scene.add(model);
  });

  const football_gate_2 = new GLTFLoader(manager);
  football_gate_2.load('./resources/football_gate/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(21.5, 1, -57);
    model.rotation.set(0, Math.PI, 0);
    model.scale.set(1.7, 4.5, 1.2);
    scene.add(model);
  });
  // 부스 5


  // 부스 6 (포켓 몬스터)
  const pokemon_center = new GLTFLoader(manager);
  pokemon_center.load('./resources/pokemon_center/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(50, 0.1, -57);
    model.scale.set(3.5, 2, 4.5);
    scene.add(model);
  });

  const pikachu = new GLTFLoader(manager);
  pikachu.load('./resources/pikachu/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(70, 1, -49);
    model.rotation.set(0, Math.PI * 3.7, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
  });

  const pokeball = new GLTFLoader(manager);
  pokeball.load('./resources/pokeball/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(68.7, 5.7, -48);
    model.rotation.set(0, Math.PI * 1.2, 0);
    model.scale.set(10, 10, 10);
    scene.add(model);
  });

  const psyduck = new GLTFLoader(manager);
  psyduck.load('./resources/psyduck/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(27.5, 3.5, -50);
    model.rotation.set(0, Math.PI / 2, 0);
    model.scale.set(3, 2, 3);
    scene.add(model);
  });

  const squirtle = new GLTFLoader(manager);
  squirtle.load('./resources/squirtle/scene.gltf', (gltf) =>{

    const model = gltf.scene;
    model.position.set(70, 0, -38);
    model.rotation.set(0, Math.PI * 1.7, 0);
    model.scale.set(0.1, 0.1, 0.1);
    scene.add(model);
  });

  const charmander = new GLTFLoader(manager);
  charmander.load('./resources/charmander/scene.gltf', (gltf) => {

    const model = gltf.scene;
    model.position.set(52, 0, -68);
    model.scale.set(0.08, 0.08, 0.08);
    scene.add(model);
  });
  // 부스 6



  // 상호작용
  //#11. 클릭 이벤트



  window.addEventListener('click', function (event) {
    console.log("컨트롤 눌림?"+ togglelink);
  console.log("클릭함");
  if(togglelink == true){
    let x = (event.clientX / window.innerWidth) * 2 - 1
    let y = -(event.clientY / window.innerHeight) * 2 + 1
    let dir = new THREE.Vector3(x, y, -1)
    dir.unproject(camera)
    let ray = new THREE.Raycaster(camera.position, dir.sub(camera.position).normalize())
  
    scene.children.forEach(sphere => {
      
      if (sphere.type === 'Group') {
        sphere.children.forEach(child => {
          let intersects = ray.intersectObject(child)
          if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'tunche') {
            window.open('https://store.steampowered.com/app/887450/Tunche/?l=koreana', '_blank')
          }else if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'unpacking') {
            window.open('https://www.unpackinggame.com/', '_blank')
          }else if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'CoD') {
            window.open('https://www.callofduty.com/ko/vanguard', '_blank')
          }else if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'FH') {
            window.open('https://www.xbox.com/ko-KR/games/forza-horizon-5', '_blank')
          }else if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'FM') {
            window.open('https://www.footballmanager.com/ko/demo', '_blank')
          }else if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'pokemon') {
            window.open('https://pokemonkorea.co.kr/legends_arceus', '_blank')
          }else if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'game'&& characters[0] == 1) {
            window.open('http://localhost:5501/?image=1', '_blank')
          }else if (intersects.length > 0 && intersects[0].object && intersects[0].object.userData.className === 'game'&& characters[0] == 2)  {
            window.open('http://localhost:5501/?image=2', '_blank')
          }
        })
      }
  
  
    })
  }
  })




  }; //cmanager 로드 완료 후 실행되는 구간 






    // cmanager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    // console.log( 'Character Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    // };

    // cmanager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    //   console.log( 'Character  Loading Rate: ' + Math.ceil(itemsLoaded/itemsTotal*100) + '%');
    // };
 

    // manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    //   console.log( 'Resource Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    //   };
  
      manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        // console.log( 'Resource Loading Rate: '+ Math.ceil(itemsLoaded/itemsTotal*100) + '%' );
        document.getElementById("loadingrate").innerText = (Math.ceil(itemsLoaded/itemsTotal*100) + '%');
      };
   

//----------------------------------------------------------------------




  



  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  //

  window.addEventListener('resize', onWindowResize);

  const params = {
    camera: camera,
    scene: scene,
    domElement: renderer.domElement
  }
  new_controls = new BasicCharacterController(params);

  RAF();
}




function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function RAF() {
  setTimeout( function() {
  requestAnimationFrame((t) => {

    // CannonDebugRenderer_1.update();

    if (previousRAF === null) {
      previousRAF = t;
    }
  
  

    if ( videoPromise != undefined ) {
      videoImageContext.drawImage( video, 0, 0 );
      if(pointerlockmute == true || mutekey == true ){  
       video.muted =true;
        }else if(pointerlockmute == false){ 
        video.muted =false;
        }
        if ( videoTexture ){ 
          videoTexture.needsUpdate = true;
        
        }
      }

      if ( videoPromise1 != undefined ) {
        videoImageContext1.drawImage( video1, 0, 0 );
        if(pointerlockmute == true || mutekey == true ){  
         video1.muted =true;
          }else if(pointerlockmute == false){ 
          video1.muted =false;
          }
          if ( videoTexture1 ){ 
            videoTexture1.needsUpdate = true;
          
          }
        }

        if ( videoPromise2 != undefined ) {
          videoImageContext2.drawImage( video2, 0, 0 );
          if(pointerlockmute == true || mutekey == true ){  
           video2.muted =true;
            }else if(pointerlockmute == false){ 
            video2.muted =false;
            }
            if ( videoTexture2 ){ 
              videoTexture2.needsUpdate = true;
            
            }
          }

          if ( videoPromise3 != undefined ) {
            videoImageContext3.drawImage( video3, 0, 0 );
            if(pointerlockmute == true || mutekey == true ){  
             video3.muted =true;
              }else if(pointerlockmute == false){ 
              video3.muted =false;
              }
              if ( videoTexture3 ){ 
                videoTexture3.needsUpdate = true;
              
              }
            }

            if ( videoPromise4 != undefined ) {
              videoImageContext4.drawImage( video4, 0, 0 );
              if(pointerlockmute == true || mutekey == true ){  
               video4.muted =true;
                }else if(pointerlockmute == false){ 
                video4.muted =false;
                }
                if ( videoTexture4 ){ 
                  videoTexture4.needsUpdate = true;
                
                }
              }

              if ( videoPromise5 != undefined ) {
                videoImageContext5.drawImage( video5, 0, 0 );
                if(pointerlockmute == true || mutekey == true ){  
                 video5.muted =true;
                  }else if(pointerlockmute == false){ 
                  video5.muted =false;
                  }
                  if ( videoTexture5 ){ 
                    videoTexture5.needsUpdate = true;
                  
                  }
                }




  
      if (controls.isLocked == true) {
        Step(t - previousRAF);
        previousRAF = t;   
        pointerlockmute =false;
        video.play();
        video1.play();
        video2.play();
        video3.play();
        video4.play();
        video5.play();

togglelink =true;

      



        
    }else{
      pointerlockmute = true;
      mutekey = false;
      togglelink =false;
      if(videoPromise != undefined){
      video.pause();
      video1.pause();
      video2.pause();
      video3.pause();
      video4.pause();
      video5.pause();

      }

    

    }

 });

 if(characters[0]) {
  RAF();
 
}
  }, 1000/60); // 초당프레임 (1000/30 = 30프레임  1000/20 = 20프레임)

  
  if(characters[0]) {
    renderer.render(scene, camera);
    }
}

function Step(timeElapsed) {
  const timeElapsedS = timeElapsed * 0.001;
  if (mixers) {
    mixers.map(m => m.update(timeElapsedS));
  }

  if (new_controls) {
    new_controls.Update(timeElapsedS);
  }

  const deltaTime = timeElapsed - oldElapsedTime;
  oldElapsedTime = timeElapsed;

  world.step(1 / 60, deltaTime, 3);
}
