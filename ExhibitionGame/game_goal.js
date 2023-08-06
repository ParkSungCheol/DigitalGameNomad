import * as THREE from 'https://cdn.skypack.dev/three@0.129/build/three.module.js';

import {FBXLoader} from 'https://cdn.skypack.dev/three@0.129/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.129/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://cdn.skypack.dev/three@0.129/examples/jsm/controls/PointerLockControls.js';
// import {FontLoader} from 'https://cdn.jsdelivr.net/npm/three@0.129/examples/jsm/loaders/FontLoader.js';
// import {TextGeometry} from 'https://cdn.jsdelivr.net/npm/three@0.129/examples/jsm/geometries/TextGeometry.js';
import { CSS3DRenderer, CSS3DObject } from 'https://cdn.skypack.dev/three@0.129/examples/jsm/renderers/CSS3DRenderer.js';

import fontData from './data/NanumSquare ExtraBold_Regular.json' assert {type: 'json'};

import {CannonDebugRenderer} from './data/CannonDebugRenderer.js';

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

  Enter() {}
  Exit() {}
  Update() {}
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
    if(moveShift && (moveForward || moveBackward || moveLeft || moveRight)) {
      this._parent.SetState('run');
    }
    else if ((moveForward || moveBackward || moveLeft || moveRight)) {
      this._parent.SetState('walk');
    }
  }
};

class BasicCharacterControllerInput {
  constructor() {
    this._Init();    
  }

  _Init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = true;
        break;
      case 65: // a
        this._keys.left = true;
        break;
      case 83: // s
        this._keys.backward = true;
        break;
      case 68: // d
        this._keys.right = true;
        break;
      case 32: // SPACE
        this._keys.space = true;
        break;
      case 16: // SHIFT
        this._keys.shift = true;
        break;
    }
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this._keys.forward = false;
        break;
      case 65: // a
        this._keys.left = false;
        break;
      case 83: // s
        this._keys.backward = false;
        break;
      case 68: // d
        this._keys.right = false;
        break;
      case 32: // SPACE
        this._keys.space = false;
        break;
      case 16: // SHIFT
        this._keys.shift = false;
        break;
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
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new CharacterFSM(
        new BasicCharacterControllerProxy(this._animations));

    this._LoadModels();
  }
  _LoadModels() {
    const loader = new FBXLoader();
    const Font_loader = new THREE.FontLoader();
    const textureLoader = new THREE.TextureLoader();

    const renderTarget = new THREE.WebGLCubeRenderTarget(1024, {
      format : THREE.RGBFormat,
      generateMipmaps : true,
      minFilter : THREE.LinearMipmapLinearFilter
    });

    renderTarget._pmremGen = new THREE.PMREMGenerator(renderer);

    const glass_material = new THREE.MeshPhysicalMaterial({
      color : 0xffffff,
      metalness : .1,
      roughness : 0.05,
      ior : 2.5,
      thickness : 0.2,
      transmission : 1,
      // side : THREE.DoubleSide,
      envMap : renderTarget.texture,
      envMapIntensity : 1,
      clearcoat: 1,
      transparent: true,
      opacity: .5,
      reflectivity: 0.2,
      refractionRatio: 0.985,
    });

    let glass_geometry = new THREE.BoxGeometry(75,20,1,256,256,256);

    const glass_1 = new THREE.Mesh(glass_geometry, glass_material);
    glass_1.position.set(-87.5,10,-86.1);
    // glass_1.add(glassCamera);
    this._params.scene.add(glass_1);
    this.glass_1 = glass_1;

    const glass1Shape = new CANNON.Box(new CANNON.Vec3(glass_1.scale.x * 37.2, glass_1.scale.y*10, glass_1.scale.z));
    const glass1Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_1.position.x, glass_1.position.y, glass_1.position.z),
          shape : glass1Shape,
          material: concreteMaterial,
        });
        glass1Body.collisionResponse = 0.1;
        glass1Body.addEventListener("collide", () => {
          // console.log("collide");
        })
        world.addBody(glass1Body);
    
    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_2 = new THREE.Mesh(glass_geometry, glass_material);
    glass_2.position.set(-75.5 ,10,-96.1);
    this._params.scene.add(glass_2);
    const glass2Shape = new CANNON.Box(new CANNON.Vec3(glass_2.scale.x, glass_2.scale.y*10, glass_2.scale.z * 9.5));
    const glass2Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_2.position.x, glass_2.position.y, glass_2.position.z),
          shape : glass2Shape,
          material: concreteMaterial,
        });
    glass2Body.collisionResponse = 0.1;
    world.addBody(glass2Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_3 = new THREE.Mesh(glass_geometry, glass_material);
    glass_3.position.set(-50.5,10,-96.1);
    this._params.scene.add(glass_3);
    const glass3Shape = new CANNON.Box(new CANNON.Vec3(glass_3.scale.x, glass_3.scale.y*10, glass_3.scale.z * 9.5));
    const glass3Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_3.position.x, glass_3.position.y, glass_3.position.z),
          shape : glass3Shape,
          material: concreteMaterial,
        });
    glass3Body.collisionResponse = 0.1;
    world.addBody(glass3Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_4 = new THREE.Mesh(glass_geometry, glass_material);
    glass_4.position.set(-38,10,-105.7);
    this._params.scene.add(glass_4);
    const glass4Shape = new CANNON.Box(new CANNON.Vec3(glass_4.scale.x * 12.4, glass_4.scale.y*10, glass_4.scale.z));
    const glass4Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_4.position.x, glass_4.position.y, glass_4.position.z),
          shape : glass4Shape,
          material: concreteMaterial,
        });
    glass4Body.collisionResponse = 0.1;
    world.addBody(glass4Body);

    glass_geometry = new THREE.BoxGeometry(1,20,57.6,256,256,256);
    const glass_5 = new THREE.Mesh(glass_geometry, glass_material);
    glass_5.position.set(-25.5,10,-76.9);
    this._params.scene.add(glass_5);
    const glass5Shape = new CANNON.Box(new CANNON.Vec3(glass_5.scale.x, glass_5.scale.y*10, glass_5.scale.z * 28.5));
    const glass5Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_5.position.x, glass_5.position.y, glass_5.position.z),
          shape : glass5Shape,
          material: concreteMaterial,
        });
    glass5Body.collisionResponse = 0.1;
    world.addBody(glass5Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_6 = new THREE.Mesh(glass_geometry, glass_material);
    glass_6.position.set(-0.5,10,-115.3);
    this._params.scene.add(glass_6);
    const glass6Shape = new CANNON.Box(new CANNON.Vec3(glass_6.scale.x, glass_6.scale.y*10, glass_6.scale.z * 9.5));
    const glass6Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_6.position.x, glass_6.position.y, glass_6.position.z),
          shape : glass6Shape,
          material: concreteMaterial,
        });
    glass6Body.collisionResponse = 0.1;
    world.addBody(glass6Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_7 = new THREE.Mesh(glass_geometry, glass_material);
    glass_7.position.set(24.5,10,-115.3);
    this._params.scene.add(glass_7);
    const glass7Shape = new CANNON.Box(new CANNON.Vec3(glass_7.scale.x, glass_7.scale.y*10, glass_7.scale.z * 9.5));
    const glass7Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_7.position.x, glass_7.position.y, glass_7.position.z),
          shape : glass7Shape,
          material: concreteMaterial,
        });
    glass7Body.collisionResponse = 0.1;
    world.addBody(glass7Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_8 = new THREE.Mesh(glass_geometry, glass_material);
    glass_8.position.set(24.5,10,-76.9);
    this._params.scene.add(glass_8);
    const glass8Shape = new CANNON.Box(new CANNON.Vec3(glass_8.scale.x, glass_8.scale.y*10, glass_8.scale.z * 9.5));
    const glass8Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_8.position.x, glass_8.position.y, glass_8.position.z),
          shape : glass8Shape,
          material: concreteMaterial,
        });
    glass8Body.collisionResponse = 0.1;
    world.addBody(glass8Body);

    glass_geometry = new THREE.BoxGeometry(1,20,38.4,256,256,256);
    const glass_9 = new THREE.Mesh(glass_geometry, glass_material);
    glass_9.position.set(49.5,10,-86.5);
    this._params.scene.add(glass_9);
    const glass9Shape = new CANNON.Box(new CANNON.Vec3(glass_9.scale.x, glass_9.scale.y*10, glass_9.scale.z * 19));
    const glass9Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_9.position.x, glass_9.position.y, glass_9.position.z),
          shape : glass9Shape,
          material: concreteMaterial,
        });
    glass9Body.collisionResponse = 0.1;
    world.addBody(glass9Body);

    glass_geometry = new THREE.BoxGeometry(1,20,76.8,256,256,256);
    const glass_10 = new THREE.Mesh(glass_geometry, glass_material);
    glass_10.position.set(74.5,10,-67.3);
    this._params.scene.add(glass_10);
    const glass10Shape = new CANNON.Box(new CANNON.Vec3(glass_10.scale.x, glass_10.scale.y*10, glass_10.scale.z * 38));
    const glass10Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_10.position.x, glass_10.position.y, glass_10.position.z),
          shape : glass10Shape,
          material: concreteMaterial,
        });
    glass10Body.collisionResponse = 0.1;
    world.addBody(glass10Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_11 = new THREE.Mesh(glass_geometry, glass_material);
    glass_11.position.set(99.5,10,-96.1);
    this._params.scene.add(glass_11);
    const glass11Shape = new CANNON.Box(new CANNON.Vec3(glass_11.scale.x, glass_11.scale.y*10, glass_11.scale.z * 9.5));
    const glass11Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_11.position.x, glass_11.position.y, glass_11.position.z),
          shape : glass11Shape,
          material: concreteMaterial,
        });
    glass11Body.collisionResponse = 0.1;
    world.addBody(glass11Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_12 = new THREE.Mesh(glass_geometry, glass_material);
    glass_12.position.set(-13,10,-86);
    this._params.scene.add(glass_12);
    const glass12Shape = new CANNON.Box(new CANNON.Vec3(glass_12.scale.x * 12.4, glass_12.scale.y*10, glass_12.scale.z));
    const glass12Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_12.position.x, glass_12.position.y, glass_12.position.z),
          shape : glass12Shape,
          material: concreteMaterial,
        });
    glass12Body.collisionResponse = 0.1;
    world.addBody(glass12Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_13 = new THREE.Mesh(glass_geometry, glass_material);
    glass_13.position.set(-13,10,-66.8);
    this._params.scene.add(glass_13);
    const glass13Shape = new CANNON.Box(new CANNON.Vec3(glass_13.scale.x * 12.4, glass_13.scale.y*10, glass_13.scale.z));
    const glass13Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_13.position.x, glass_13.position.y, glass_13.position.z),
          shape : glass13Shape,
          material: concreteMaterial,
        });
    glass13Body.collisionResponse = 0.1;
    world.addBody(glass13Body);

    glass_geometry = new THREE.BoxGeometry(50,20,1,256,256,256);
    const glass_14 = new THREE.Mesh(glass_geometry, glass_material);
    glass_14.position.set(-0.5,10,-47.6);
    this._params.scene.add(glass_14);
    const glass14Shape = new CANNON.Box(new CANNON.Vec3(glass_14.scale.x * 24.8, glass_14.scale.y*10, glass_14.scale.z));
    const glass14Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_14.position.x, glass_14.position.y, glass_14.position.z),
          shape : glass14Shape,
          material: concreteMaterial,
        });
    glass14Body.collisionResponse = 0.1;
    world.addBody(glass14Body);

    glass_geometry = new THREE.BoxGeometry(50,20,1,256,256,256);
    const glass_15 = new THREE.Mesh(glass_geometry, glass_material);
    glass_15.position.set(49.5,10,-28.4);
    this._params.scene.add(glass_15);
    const glass15Shape = new CANNON.Box(new CANNON.Vec3(glass_15.scale.x * 24.8, glass_15.scale.y*10, glass_15.scale.z));
    const glass15Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_15.position.x, glass_15.position.y, glass_15.position.z),
          shape : glass15Shape,
          material: concreteMaterial,
        });
    glass15Body.collisionResponse = 0.1;
    world.addBody(glass15Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_16 = new THREE.Mesh(glass_geometry, glass_material);
    glass_16.position.set(-0.5,10,-38.5);
    this._params.scene.add(glass_16);
    const glass16Shape = new CANNON.Box(new CANNON.Vec3(glass_16.scale.x, glass_16.scale.y*10, glass_16.scale.z * 9.5));
    const glass16Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_16.position.x, glass_16.position.y, glass_16.position.z),
          shape : glass16Shape,
          material: concreteMaterial,
        });
    glass16Body.collisionResponse = 0.1;
    world.addBody(glass16Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_17 = new THREE.Mesh(glass_geometry, glass_material);
    glass_17.position.set(24.5,10,-38.5);
    this._params.scene.add(glass_17);
    const glass17Shape = new CANNON.Box(new CANNON.Vec3(glass_17.scale.x, glass_17.scale.y*10, glass_17.scale.z * 9.5));
    const glass17Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_17.position.x, glass_17.position.y, glass_17.position.z),
          shape : glass17Shape,
          material: concreteMaterial,
        });
    glass17Body.collisionResponse = 0.1;
    world.addBody(glass17Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_18 = new THREE.Mesh(glass_geometry, glass_material);
    glass_18.position.set(62,10,-47.6);
    this._params.scene.add(glass_18);
    const glass18Shape = new CANNON.Box(new CANNON.Vec3(glass_18.scale.x * 12.4, glass_18.scale.y*10, glass_18.scale.z));
    const glass18Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_18.position.x, glass_18.position.y, glass_18.position.z),
          shape : glass18Shape,
          material: concreteMaterial,
        });
    glass18Body.collisionResponse = 0.1;
    world.addBody(glass18Body);

    glass_geometry = new THREE.BoxGeometry(75,20,1,256,256,256);
    const glass_19 = new THREE.Mesh(glass_geometry, glass_material);
    glass_19.position.set(62,10,-86);
    this._params.scene.add(glass_19);
    const glass19Shape = new CANNON.Box(new CANNON.Vec3(glass_19.scale.x * 37.2, glass_19.scale.y*10, glass_19.scale.z));
    const glass19Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_19.position.x, glass_19.position.y, glass_19.position.z),
          shape : glass19Shape,
          material: concreteMaterial,
        });
    glass19Body.collisionResponse = 0.1;
    world.addBody(glass19Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_20 = new THREE.Mesh(glass_geometry, glass_material);
    glass_20.position.set(87,10,-66.8);
    this._params.scene.add(glass_20);
    const glass20Shape = new CANNON.Box(new CANNON.Vec3(glass_20.scale.x * 12.4, glass_20.scale.y*10, glass_20.scale.z));
    const glass20Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_20.position.x, glass_20.position.y, glass_20.position.z),
          shape : glass20Shape,
          material: concreteMaterial,
        });
    glass20Body.collisionResponse = 0.1;
    world.addBody(glass20Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_21 = new THREE.Mesh(glass_geometry, glass_material);
    glass_21.position.set(112,10,-47.6);
    this._params.scene.add(glass_21);
    const glass21Shape = new CANNON.Box(new CANNON.Vec3(glass_21.scale.x * 12.4, glass_21.scale.y*10, glass_21.scale.z));
    const glass21Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_21.position.x, glass_21.position.y, glass_21.position.z),
          shape : glass21Shape,
          material: concreteMaterial,
        });
    glass21Body.collisionResponse = 0.1;
    world.addBody(glass21Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_22 = new THREE.Mesh(glass_geometry, glass_material);
    glass_22.position.set(112,10,-9.2);
    this._params.scene.add(glass_22);
    const glass22Shape = new CANNON.Box(new CANNON.Vec3(glass_22.scale.x * 12.4, glass_22.scale.y*10, glass_22.scale.z));
    const glass22Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_22.position.x, glass_22.position.y, glass_22.position.z),
          shape : glass22Shape,
          material: concreteMaterial,
        });
    glass22Body.collisionResponse = 0.1;
    world.addBody(glass22Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_23 = new THREE.Mesh(glass_geometry, glass_material);
    glass_23.position.set(99.5,10,-19.3);
    this._params.scene.add(glass_23);
    const glass23Shape = new CANNON.Box(new CANNON.Vec3(glass_23.scale.x, glass_23.scale.y*10, glass_23.scale.z * 9.5));
    const glass23Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_23.position.x, glass_23.position.y, glass_23.position.z),
          shape : glass23Shape,
          material: concreteMaterial,
        });
    glass23Body.collisionResponse = 0.1;
    world.addBody(glass23Body);

    glass_geometry = new THREE.BoxGeometry(100,20,1,256,256,256);
    const glass_24 = new THREE.Mesh(glass_geometry, glass_material);
    glass_24.position.set(74.5,10,10);
    this._params.scene.add(glass_24);
    const glass24Shape = new CANNON.Box(new CANNON.Vec3(glass_24.scale.x * 24.8, glass_24.scale.y*10, glass_24.scale.z));
    const glass24Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_24.position.x, glass_24.position.y, glass_24.position.z),
          shape : glass24Shape,
          material: concreteMaterial,
        });
    glass24Body.collisionResponse = 0.1;
    world.addBody(glass24Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_25 = new THREE.Mesh(glass_geometry, glass_material);
    glass_25.position.set(74.5,10,-0.1);
    this._params.scene.add(glass_25);
    const glass25Shape = new CANNON.Box(new CANNON.Vec3(glass_25.scale.x, glass_25.scale.y*10, glass_25.scale.z * 9.5));
    const glass25Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_25.position.x, glass_25.position.y, glass_25.position.z),
          shape : glass25Shape,
          material: concreteMaterial,
        });
    glass25Body.collisionResponse = 0.1;
    world.addBody(glass25Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_26 = new THREE.Mesh(glass_geometry, glass_material);
    glass_26.position.set(49.5,10,-0.1);
    this._params.scene.add(glass_26);
    const glass26Shape = new CANNON.Box(new CANNON.Vec3(glass_26.scale.x, glass_26.scale.y*10, glass_26.scale.z * 9.5));
    const glass26Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_26.position.x, glass_26.position.y, glass_26.position.z),
          shape : glass26Shape,
          material: concreteMaterial,
        });
    glass26Body.collisionResponse = 0.1;
    world.addBody(glass26Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_27 = new THREE.Mesh(glass_geometry, glass_material);
    glass_27.position.set(24.5,10,-0.1);
    this._params.scene.add(glass_27);
    const glass27Shape = new CANNON.Box(new CANNON.Vec3(glass_27.scale.x, glass_27.scale.y*10, glass_27.scale.z * 9.5));
    const glass27Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_27.position.x, glass_27.position.y, glass_27.position.z),
          shape : glass27Shape,
          material: concreteMaterial,
        });
    glass27Body.collisionResponse = 0.1;
    world.addBody(glass27Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_28 = new THREE.Mesh(glass_geometry, glass_material);
    glass_28.position.set(-0.5,10,-0.1);
    this._params.scene.add(glass_28);
    const glass28Shape = new CANNON.Box(new CANNON.Vec3(glass_28.scale.x, glass_28.scale.y*10, glass_28.scale.z * 9.5));
    const glass28Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_28.position.x, glass_28.position.y, glass_28.position.z),
          shape : glass28Shape,
          material: concreteMaterial,
        });
    glass28Body.collisionResponse = 0.1;
    world.addBody(glass28Body);

    glass_geometry = new THREE.BoxGeometry(1,20,57.6,256,256,256);
    const glass_29 = new THREE.Mesh(glass_geometry, glass_material);
    glass_29.position.set(-50.5,10,-0.1);
    this._params.scene.add(glass_29);
    const glass29Shape = new CANNON.Box(new CANNON.Vec3(glass_29.scale.x, glass_29.scale.y*10, glass_29.scale.z * 28.5));
    const glass29Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_29.position.x, glass_29.position.y, glass_29.position.z),
          shape : glass29Shape,
          material: concreteMaterial,
        });
    glass29Body.collisionResponse = 0.1;
    world.addBody(glass29Body);

    glass_geometry = new THREE.BoxGeometry(1,20,57.6,256,256,256);
    const glass_30 = new THREE.Mesh(glass_geometry, glass_material);
    glass_30.position.set(-75.5,10,-38.5);
    this._params.scene.add(glass_30);
    const glass30Shape = new CANNON.Box(new CANNON.Vec3(glass_30.scale.x, glass_30.scale.y*10, glass_30.scale.z * 28.5));
    const glass30Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_30.position.x, glass_30.position.y, glass_30.position.z),
          shape : glass30Shape,
          material: concreteMaterial,
        });
    glass30Body.collisionResponse = 0.1;
    world.addBody(glass30Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_31 = new THREE.Mesh(glass_geometry, glass_material);
    glass_31.position.set(-25.5,10,19.1);
    this._params.scene.add(glass_31);
    const glass31Shape = new CANNON.Box(new CANNON.Vec3(glass_31.scale.x, glass_31.scale.y*10, glass_31.scale.z * 9.5));
    const glass31Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_31.position.x, glass_31.position.y, glass_31.position.z),
          shape : glass31Shape,
          material: concreteMaterial,
        });
    glass31Body.collisionResponse = 0.1;
    world.addBody(glass31Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_32 = new THREE.Mesh(glass_geometry, glass_material);
    glass_32.position.set(-50.5,10,-57.7);
    this._params.scene.add(glass_32);
    const glass32Shape = new CANNON.Box(new CANNON.Vec3(glass_32.scale.x, glass_32.scale.y*10, glass_32.scale.z * 9.5));
    const glass32Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_32.position.x, glass_32.position.y, glass_32.position.z),
          shape : glass32Shape,
          material: concreteMaterial,
        });
    glass32Body.collisionResponse = 0.1;
    world.addBody(glass32Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_33 = new THREE.Mesh(glass_geometry, glass_material);
    glass_33.position.set(-100.5,10,-76.9);
    this._params.scene.add(glass_33);
    const glass33Shape = new CANNON.Box(new CANNON.Vec3(glass_33.scale.x, glass_33.scale.y*10, glass_33.scale.z * 9.5));
    const glass33Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_33.position.x, glass_33.position.y, glass_33.position.z),
          shape : glass33Shape,
          material: concreteMaterial,
        });
    glass33Body.collisionResponse = 0.1;
    world.addBody(glass33Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_34 = new THREE.Mesh(glass_geometry, glass_material);
    glass_34.position.set(-100.5,10,-38.5);
    this._params.scene.add(glass_34);
    const glass34Shape = new CANNON.Box(new CANNON.Vec3(glass_34.scale.x, glass_34.scale.y*10, glass_34.scale.z * 9.5));
    const glass34Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_34.position.x, glass_34.position.y, glass_34.position.z),
          shape : glass34Shape,
          material: concreteMaterial,
        });
    glass34Body.collisionResponse = 0.1;
    world.addBody(glass34Body);

    glass_geometry = new THREE.BoxGeometry(100,20,1,256,256,256);
    const glass_35 = new THREE.Mesh(glass_geometry, glass_material);
    glass_35.position.set(-25.5,10,-9.2);
    this._params.scene.add(glass_35);
    const glass35Shape = new CANNON.Box(new CANNON.Vec3(glass_35.scale.x * 49.6, glass_35.scale.y*10, glass_35.scale.z));
    const glass35Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_35.position.x, glass_35.position.y, glass_35.position.z),
          shape : glass35Shape,
          material: concreteMaterial,
        });
    glass35Body.collisionResponse = 0.1;
    world.addBody(glass35Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_36 = new THREE.Mesh(glass_geometry, glass_material);
    glass_36.position.set(-38,10,-28.9);
    this._params.scene.add(glass_36);
    const glass36Shape = new CANNON.Box(new CANNON.Vec3(glass_36.scale.x * 12.4, glass_36.scale.y*10, glass_36.scale.z));
    const glass36Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_36.position.x, glass_36.position.y, glass_36.position.z),
          shape : glass36Shape,
          material: concreteMaterial,
        });
    glass36Body.collisionResponse = 0.1;
    world.addBody(glass36Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_37 = new THREE.Mesh(glass_geometry, glass_material);
    glass_37.position.set(-63,10,-67.3);
    this._params.scene.add(glass_37);
    const glass37Shape = new CANNON.Box(new CANNON.Vec3(glass_37.scale.x * 12.4, glass_37.scale.y*10, glass_37.scale.z));
    const glass37Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_37.position.x, glass_37.position.y, glass_37.position.z),
          shape : glass37Shape,
          material: concreteMaterial,
        });
    glass37Body.collisionResponse = 0.1;
    world.addBody(glass37Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_38 = new THREE.Mesh(glass_geometry, glass_material);
    glass_38.position.set(-88,10,-28.9);
    this._params.scene.add(glass_38);
    const glass38Shape = new CANNON.Box(new CANNON.Vec3(glass_38.scale.x * 12.4, glass_38.scale.y*10, glass_38.scale.z));
    const glass38Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_38.position.x, glass_38.position.y, glass_38.position.z),
          shape : glass38Shape,
          material: concreteMaterial,
        });
    glass38Body.collisionResponse = 0.1;
    world.addBody(glass38Body);

    glass_geometry = new THREE.BoxGeometry(1,20,38.4,256,256,256);
    const glass_39 = new THREE.Mesh(glass_geometry, glass_material);
    glass_39.position.set(-100.5,10, 9.5);
    this._params.scene.add(glass_39);
    const glass39Shape = new CANNON.Box(new CANNON.Vec3(glass_39.scale.x, glass_39.scale.y*10, glass_39.scale.z * 19));
    const glass39Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_39.position.x, glass_39.position.y, glass_39.position.z),
          shape : glass39Shape,
          material: concreteMaterial,
    });
    glass39Body.collisionResponse = 0.1;
    world.addBody(glass39Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_40 = new THREE.Mesh(glass_geometry, glass_material);
    glass_40.position.set(-113,10,9.5);
    this._params.scene.add(glass_40);
    const glass40Shape = new CANNON.Box(new CANNON.Vec3(glass_40.scale.x * 12.4, glass_40.scale.y*10, glass_40.scale.z));
    const glass40Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_40.position.x, glass_40.position.y, glass_40.position.z),
          shape : glass40Shape,
          material: concreteMaterial,
        });
    glass40Body.collisionResponse = 0.1;
    world.addBody(glass40Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_41 = new THREE.Mesh(glass_geometry, glass_material);
    glass_41.position.set(-63,10,9.5);
    this._params.scene.add(glass_41);
    const glass41Shape = new CANNON.Box(new CANNON.Vec3(glass_41.scale.x * 12.4, glass_41.scale.y*10, glass_41.scale.z));
    const glass41Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_41.position.x, glass_41.position.y, glass_41.position.z),
          shape : glass41Shape,
          material: concreteMaterial,
        });
    glass41Body.collisionResponse = 0.1;
    world.addBody(glass41Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_42 = new THREE.Mesh(glass_geometry, glass_material);
    glass_42.position.set(-38,10,28.7);
    this._params.scene.add(glass_42);
    const glass42Shape = new CANNON.Box(new CANNON.Vec3(glass_42.scale.x * 12.4, glass_42.scale.y*10, glass_42.scale.z));
    const glass42Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_42.position.x, glass_42.position.y, glass_42.position.z),
          shape : glass42Shape,
          material: concreteMaterial,
        });
    glass42Body.collisionResponse = 0.1;
    world.addBody(glass42Body);

    glass_geometry = new THREE.BoxGeometry(1,20,38.4,256,256,256);
    const glass_43 = new THREE.Mesh(glass_geometry, glass_material);
    glass_43.position.set(-75.5,10, 47.9);
    this._params.scene.add(glass_43);
    const glass43Shape = new CANNON.Box(new CANNON.Vec3(glass_43.scale.x, glass_43.scale.y*10, glass_43.scale.z * 19));
    const glass43Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_43.position.x, glass_43.position.y, glass_43.position.z),
          shape : glass43Shape,
          material: concreteMaterial,
    });
    glass43Body.collisionResponse = 0.1;
    world.addBody(glass43Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_44 = new THREE.Mesh(glass_geometry, glass_material);
    glass_44.position.set(-88,10,28.7);
    this._params.scene.add(glass_44);
    const glass44Shape = new CANNON.Box(new CANNON.Vec3(glass_44.scale.x * 12.4, glass_44.scale.y*10, glass_44.scale.z));
    const glass44Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_44.position.x, glass_44.position.y, glass_44.position.z),
          shape : glass44Shape,
          material: concreteMaterial,
        });
    glass44Body.collisionResponse = 0.1;
    world.addBody(glass44Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_45 = new THREE.Mesh(glass_geometry, glass_material);
    glass_45.position.set(-88,10,47.9);
    this._params.scene.add(glass_45);
    const glass45Shape = new CANNON.Box(new CANNON.Vec3(glass_45.scale.x * 12.4, glass_45.scale.y*10, glass_45.scale.z));
    const glass45Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_45.position.x, glass_45.position.y, glass_45.position.z),
          shape : glass45Shape,
          material: concreteMaterial,
        });
    glass45Body.collisionResponse = 0.1;
    world.addBody(glass45Body);

    glass_geometry = new THREE.BoxGeometry(1,20,38.4,256,256,256);
    const glass_46 = new THREE.Mesh(glass_geometry, glass_material);
    glass_46.position.set(-25.5,10, 67.1);
    this._params.scene.add(glass_46);
    const glass46Shape = new CANNON.Box(new CANNON.Vec3(glass_46.scale.x, glass_46.scale.y*10, glass_46.scale.z * 19));
    const glass46Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_46.position.x, glass_46.position.y, glass_46.position.z),
          shape : glass46Shape,
          material: concreteMaterial,
    });
    glass46Body.collisionResponse = 0.1;
    world.addBody(glass46Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_47 = new THREE.Mesh(glass_geometry, glass_material);
    glass_47.position.set(-100.5,10,57.5);
    this._params.scene.add(glass_47);
    const glass47Shape = new CANNON.Box(new CANNON.Vec3(glass_47.scale.x, glass_47.scale.y*10, glass_47.scale.z * 9.5));
    const glass47Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_47.position.x, glass_47.position.y, glass_47.position.z),
          shape : glass47Shape,
          material: concreteMaterial,
        });
    glass47Body.collisionResponse = 0.1;
    world.addBody(glass47Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_48 = new THREE.Mesh(glass_geometry, glass_material);
    glass_48.position.set(-100.5,10,95.9);
    this._params.scene.add(glass_48);
    const glass48Shape = new CANNON.Box(new CANNON.Vec3(glass_48.scale.x, glass_48.scale.y*10, glass_48.scale.z * 9.5));
    const glass48Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_48.position.x, glass_48.position.y, glass_48.position.z),
          shape : glass48Shape,
          material: concreteMaterial,
        });
    glass48Body.collisionResponse = 0.1;
    world.addBody(glass48Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_49 = new THREE.Mesh(glass_geometry, glass_material);
    glass_49.position.set(-50.5,10,95.9);
    this._params.scene.add(glass_49);
    const glass49Shape = new CANNON.Box(new CANNON.Vec3(glass_49.scale.x, glass_49.scale.y*10, glass_49.scale.z * 9.5));
    const glass49Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_49.position.x, glass_49.position.y, glass_49.position.z),
          shape : glass49Shape,
          material: concreteMaterial,
        });
    glass49Body.collisionResponse = 0.1;
    world.addBody(glass49Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_50 = new THREE.Mesh(glass_geometry, glass_material);
    glass_50.position.set(-25.5,10,115.1);
    this._params.scene.add(glass_50);
    const glass50Shape = new CANNON.Box(new CANNON.Vec3(glass_50.scale.x, glass_50.scale.y*10, glass_50.scale.z * 9.5));
    const glass50Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_50.position.x, glass_50.position.y, glass_50.position.z),
          shape : glass50Shape,
          material: concreteMaterial,
        });
    glass50Body.collisionResponse = 0.1;
    world.addBody(glass50Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_51 = new THREE.Mesh(glass_geometry, glass_material);
    glass_51.position.set(24.5,10,95.9);
    this._params.scene.add(glass_51);
    const glass51Shape = new CANNON.Box(new CANNON.Vec3(glass_51.scale.x, glass_51.scale.y*10, glass_51.scale.z * 9.5));
    const glass51Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_51.position.x, glass_51.position.y, glass_51.position.z),
          shape : glass51Shape,
          material: concreteMaterial,
        });
    glass51Body.collisionResponse = 0.1;
    world.addBody(glass51Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_52 = new THREE.Mesh(glass_geometry, glass_material);
    glass_52.position.set(74.5,10,95.9);
    this._params.scene.add(glass_52);
    const glass52Shape = new CANNON.Box(new CANNON.Vec3(glass_52.scale.x, glass_52.scale.y*10, glass_52.scale.z * 9.5));
    const glass52Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_52.position.x, glass_52.position.y, glass_52.position.z),
          shape : glass52Shape,
          material: concreteMaterial,
        });
    glass52Body.collisionResponse = 0.1;
    world.addBody(glass52Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_53 = new THREE.Mesh(glass_geometry, glass_material);
    glass_53.position.set(49.5,10,76.7);
    this._params.scene.add(glass_53);
    const glass53Shape = new CANNON.Box(new CANNON.Vec3(glass_53.scale.x, glass_53.scale.y*10, glass_53.scale.z * 9.5));
    const glass53Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_53.position.x, glass_53.position.y, glass_53.position.z),
          shape : glass53Shape,
          material: concreteMaterial,
        });
    glass53Body.collisionResponse = 0.1;
    world.addBody(glass53Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_54 = new THREE.Mesh(glass_geometry, glass_material);
    glass_54.position.set(99.5,10,76.7);
    this._params.scene.add(glass_54);
    const glass54Shape = new CANNON.Box(new CANNON.Vec3(glass_54.scale.x, glass_54.scale.y*10, glass_54.scale.z * 9.5));
    const glass54Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_54.position.x, glass_54.position.y, glass_54.position.z),
          shape : glass54Shape,
          material: concreteMaterial,
        });
    glass54Body.collisionResponse = 0.1;
    world.addBody(glass54Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_55 = new THREE.Mesh(glass_geometry, glass_material);
    glass_55.position.set(99.5,10,38.3);
    this._params.scene.add(glass_55);
    const glass55Shape = new CANNON.Box(new CANNON.Vec3(glass_55.scale.x, glass_55.scale.y*10, glass_55.scale.z * 9.5));
    const glass55Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_55.position.x, glass_55.position.y, glass_55.position.z),
          shape : glass55Shape,
          material: concreteMaterial,
        });
    glass55Body.collisionResponse = 0.1;
    world.addBody(glass55Body);

    glass_geometry = new THREE.BoxGeometry(1,20,19.2,256,256,256);
    const glass_56 = new THREE.Mesh(glass_geometry, glass_material);
    glass_56.position.set(24.5,10,38.3);
    this._params.scene.add(glass_56);
    const glass56Shape = new CANNON.Box(new CANNON.Vec3(glass_56.scale.x, glass_56.scale.y*10, glass_56.scale.z * 9.5));
    const glass56Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_56.position.x, glass_56.position.y, glass_56.position.z),
          shape : glass56Shape,
          material: concreteMaterial,
        });
    glass56Body.collisionResponse = 0.1;
    world.addBody(glass56Body);

    glass_geometry = new THREE.BoxGeometry(1,20,96,256,256,256);
    const glass_57 = new THREE.Mesh(glass_geometry, glass_material);
    glass_57.position.set(-0.5,10,76.7);
    this._params.scene.add(glass_57);
    const glass57Shape = new CANNON.Box(new CANNON.Vec3(glass_57.scale.x, glass_57.scale.y*10, glass_57.scale.z * 47.5));
    const glass57Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_57.position.x, glass_57.position.y, glass_57.position.z),
          shape : glass57Shape,
          material: concreteMaterial,
        });
    glass57Body.collisionResponse = 0.1;
    world.addBody(glass57Body);

    glass_geometry = new THREE.BoxGeometry(50,20,1,256,256,256);
    const glass_58 = new THREE.Mesh(glass_geometry, glass_material);
    glass_58.position.set(74.5,10,29.2);
    this._params.scene.add(glass_58);
    const glass58Shape = new CANNON.Box(new CANNON.Vec3(glass_58.scale.x * 24.8, glass_58.scale.y*10, glass_58.scale.z));
    const glass58Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_58.position.x, glass_58.position.y, glass_58.position.z),
          shape : glass58Shape,
          material: concreteMaterial,
        });
    glass58Body.collisionResponse = 0.1;
    world.addBody(glass58Body);

    glass_geometry = new THREE.BoxGeometry(50,20,1,256,256,256);
    const glass_59 = new THREE.Mesh(glass_geometry, glass_material);
    glass_59.position.set(-50.5,10,86.8);
    this._params.scene.add(glass_59);
    const glass59Shape = new CANNON.Box(new CANNON.Vec3(glass_59.scale.x * 24.8, glass_59.scale.y*10, glass_59.scale.z));
    const glass59Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_59.position.x, glass_59.position.y, glass_59.position.z),
          shape : glass59Shape,
          material: concreteMaterial,
        });
    glass59Body.collisionResponse = 0.1;
    world.addBody(glass59Body);

    glass_geometry = new THREE.BoxGeometry(50,20,1,256,256,256);
    const glass_60 = new THREE.Mesh(glass_geometry, glass_material);
    glass_60.position.set(-75.5,10,106);
    this._params.scene.add(glass_60);
    const glass60Shape = new CANNON.Box(new CANNON.Vec3(glass_60.scale.x * 24.8, glass_60.scale.y*10, glass_60.scale.z));
    const glass60Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_60.position.x, glass_60.position.y, glass_60.position.z),
          shape : glass60Shape,
          material: concreteMaterial,
        });
    glass60Body.collisionResponse = 0.1;
    world.addBody(glass60Body);

    glass_geometry = new THREE.BoxGeometry(100,20,1,256,256,256);
    const glass_61 = new THREE.Mesh(glass_geometry, glass_material);
    glass_61.position.set(49.5,10,48.4);
    this._params.scene.add(glass_61);
    const glass61Shape = new CANNON.Box(new CANNON.Vec3(glass_61.scale.x * 49.6, glass_61.scale.y*10, glass_61.scale.z));
    const glass61Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_61.position.x, glass_61.position.y, glass_61.position.z),
          shape : glass61Shape,
          material: concreteMaterial,
        });
    glass61Body.collisionResponse = 0.1;
    world.addBody(glass61Body);

    glass_geometry = new THREE.BoxGeometry(100,20,1,256,256,256);
    const glass_62 = new THREE.Mesh(glass_geometry, glass_material);
    glass_62.position.set(74.5,10,86.8);
    this._params.scene.add(glass_62);
    const glass62Shape = new CANNON.Box(new CANNON.Vec3(glass_62.scale.x * 49.6, glass_62.scale.y*10, glass_62.scale.z));
    const glass62Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_62.position.x, glass_62.position.y, glass_62.position.z),
          shape : glass62Shape,
          material: concreteMaterial,
        });
    glass62Body.collisionResponse = 0.1;
    world.addBody(glass62Body);

    glass_geometry = new THREE.BoxGeometry(75,20,1,256,256,256);
    const glass_63 = new THREE.Mesh(glass_geometry, glass_material);
    glass_63.position.set(-13,10,67.6);
    this._params.scene.add(glass_63);
    const glass63Shape = new CANNON.Box(new CANNON.Vec3(glass_63.scale.x * 37.2, glass_63.scale.y*10, glass_63.scale.z));
    const glass63Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_63.position.x, glass_63.position.y, glass_63.position.z),
          shape : glass63Shape,
          material: concreteMaterial,
        });
    glass63Body.collisionResponse = 0.1;
    world.addBody(glass63Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_64 = new THREE.Mesh(glass_geometry, glass_material);
    glass_64.position.set(-38,10,47.9);
    this._params.scene.add(glass_64);
    const glass64Shape = new CANNON.Box(new CANNON.Vec3(glass_64.scale.x * 12.4, glass_64.scale.y*10, glass_64.scale.z));
    const glass64Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_64.position.x, glass_64.position.y, glass_64.position.z),
          shape : glass64Shape,
          material: concreteMaterial,
        });
    glass64Body.collisionResponse = 0.1;
    world.addBody(glass64Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_65 = new THREE.Mesh(glass_geometry, glass_material);
    glass_65.position.set(87,10,67.1);
    this._params.scene.add(glass_65);
    const glass65Shape = new CANNON.Box(new CANNON.Vec3(glass_65.scale.x * 12.4, glass_65.scale.y*10, glass_65.scale.z));
    const glass65Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_65.position.x, glass_65.position.y, glass_65.position.z),
          shape : glass65Shape,
          material: concreteMaterial,
        });
    glass65Body.collisionResponse = 0.1;
    world.addBody(glass65Body);

    glass_geometry = new THREE.BoxGeometry(25,20,1,256,256,256);
    const glass_66 = new THREE.Mesh(glass_geometry, glass_material);
    glass_66.position.set(37,10,105.5);
    this._params.scene.add(glass_66);
    const glass66Shape = new CANNON.Box(new CANNON.Vec3(glass_66.scale.x * 12.4, glass_66.scale.y*10, glass_66.scale.z));
    const glass66Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(glass_66.position.x, glass_66.position.y, glass_66.position.z),
          shape : glass66Shape,
          material: concreteMaterial,
        });
    glass66Body.collisionResponse = 0.1;
    world.addBody(glass66Body);


    Font_loader.load("./data/NanumMyeongjo_Regular.json", (font) => {
      // const geometry_1 = new THREE.TextGeometry("부스 #1", {
      //   font : font,
      //   size : 3,
      //   height : 0.2,
      //   curveSegments : 12,
      //   bevelEnabled : true,
      //   bevelThickness : 0.03,
      //   bevelSize : 0.03,
      //   bevelOffset : 0.005,
      //   bevelSegments : 24
      // });
      // geometry_1.center();

      // const material_1 = new THREE.MeshStandardMaterial({
      //   color : "#000000",
      //   roughness : 0.3,
      //   metalness : 0.7,
      // });

      // const mesh_1 = new THREE.Mesh(geometry_1, material_1);
      // this._params.scene.add(mesh_1);
      // mesh_1.position.set(60, 10, 50);
      // mesh_1.rotation.y = -3.2;
    }); //3D font end

    loader.setPath('./resources/remy/');
    loader.load('remy.fbx', (fbx) => {
      fbx.scale.setScalar(0.01);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      this._target = fbx;
      this._params.scene.add(this._target);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._stateMachine.SetState('idle');
      };

      const _OnLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this._mixer.clipAction(clip);
  
        this._animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this._manager);
      loader.setPath('./resources/remy/');
      loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
      loader.load('run.fbx', (a) => { _OnLoad('run', a); });
      loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
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

    if ( controlObject.position.x > 245 ) {
      controlObject.position.x = 245;	
    };
    if ( controlObject.position.x < -245 ) {
      controlObject.position.x = -245;	
    };

    if ( controlObject.position.z > 145 ) {
      controlObject.position.z = 145;	
    };

    if ( controlObject.position.z < -145 ) {
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
    // this._camera.position.x = controlObject.position.x;
    // this._camera.position.y = 10;
    // this._camera.position.z = controlObject.position.z;

    this._camera.position.x = controlObject.position.x + Math.sin(this._camera.rotation.y)*10;
    this._camera.position.z = controlObject.position.z + Math.cos(this._camera.rotation.z)*10;

    if(!_R.equals(this._camera.quaternion)) {
      var qm = this._camera.quaternion.clone();
      // console.log(qm.x, qm.y, qm.z, qm.w);
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
    const x = this._camera.getWorldDirection(cameraDirection).x;
    const z = this._camera.getWorldDirection(cameraDirection).z;
    const vector = new THREE.Vector3(x, 0, z);
    const axis = new THREE.Vector3(0, 1, 0);

    if(!this._input._keys.shift) {
      speed = 0.1;
    }
    else {
      speed = 0.2;
    }
    if (this._input._keys.forward) {
      objectBody.velocity.x = x*speed;
      objectBody.velocity.z = z*speed;
      objectBody.position.x += objectBody.velocity.x;
      objectBody.position.z += objectBody.velocity.z;
      if(this._input._keys.left) {
        controlObject.rotateY(-Math.PI/4);
      }
      if(this._input._keys.right) {
        controlObject.rotateY(Math.PI/4);
      }
    }
    if (this._input._keys.backward) {
      let angle = - Math.PI;
      vector.applyAxisAngle(axis, angle);
      objectBody.velocity.x = vector.x*speed;
      objectBody.velocity.z = vector.z*speed;
      objectBody.position.x += objectBody.velocity.x;
      objectBody.position.z += objectBody.velocity.z;
      controlObject.rotateY(-Math.PI);
      if(this._input._keys.forward) {
        controlObject.rotateY(-Math.PI);
      }
      if(this._input._keys.left) {
        controlObject.rotateY(Math.PI/4);
        controlObject.rotateY(-Math.PI);
      }
      if(this._input._keys.right) {
        controlObject.rotateY(-Math.PI/4);
        controlObject.rotateY(-Math.PI);
      }
    }
      if (this._input._keys.left) {
        let angle = Math.PI / 2;
        vector.applyAxisAngle(axis, angle);
        objectBody.velocity.x = vector.x*speed;
        objectBody.velocity.z = vector.z*speed;
        objectBody.position.x += objectBody.velocity.x;
        objectBody.position.z += objectBody.velocity.z;
        controlObject.rotateY(Math.PI/2);
      }
      if (this._input._keys.right) {
        let angle = -Math.PI / 2;
        vector.applyAxisAngle(axis, angle);
        objectBody.velocity.x = vector.x*speed;
        objectBody.velocity.z = vector.z*speed;
        objectBody.position.x += objectBody.velocity.x;
        objectBody.position.z += objectBody.velocity.z;
        controlObject.rotateY(-Math.PI/2);
      }

      controlObject.position.x = objectBody.position.x;
      controlObject.position.y = objectBody.position.y - 1;
      controlObject.position.z = objectBody.position.z;

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }

    // if(this.glass_1) {
    //   this.glass_1.visible = false;
    //   const glassCamera = this.glass_1.children[0];
    //   glassCamera.update(renderer, scene);

    //   const renderTarget = glassCamera.renderTarget._pmremGen.fromCubemap(glassCamera.renderTarget.texture);
    //   this.glass_1.material.envMap = renderTarget.texture;
    //   this.glass_1.visible = true;
    // }

    if(light) {
      const smallSphere = controlObject.children[0];
      smallSphere.getWorldPosition(light.position);
      light.position.x = controlObject.position.x + Math.sin(this._camera.rotation.y)*5;
      light.position.y = 5;
      light.position.z = controlObject.position.z + Math.cos(this._camera.rotation.z)*5;
      // if(LightHelper) {
      //   LightHelper.update();
      // }
      if(light.target) {
        light.target.position.set(x*500, this._camera.getWorldDirection(cameraDirection).y*500, z*500);
      }
    }
  }
};

let camera, scene, renderer, controls;
// let renderer2, scene2; //css3d 렌더링용 변수

			const objects = [];

			let raycaster;

			let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;
      let moveShift = false;
      let new_controls;
      let previousRAF = null;
      let mixers = [];
      let oldElapsedTime = 0;
      let world;
      let wall1Body;
      let wall2Body;
      let wall3Body;
      let wall4Body;
      let wall5Body;
      let concreteMaterial;
      let plasticMaterial;
      let CannonDebugRenderer_1;
      let objectShape;
      let objectBody;
      let controlObject;
      let glass_1;
      let light;
      let LightHelper;
      let time = 0;
      let starFlag = true;
      let timer;
      let th;
      let tm;
      let ts;

			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			const vertex = new THREE.Vector3();
			const color = new THREE.Color();


			init();
			animate();

			function init() {

        // 카메라 설정
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 100.0;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(25, 10, 25);

				scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 0, 100);

				//라이트 설정
        light = new THREE.SpotLight(0xFFFFFF, 2);
        light.position.set(0, 100, 0);
        light.target.position.set(0,0,0);
        light.angle = THREE.Math.degToRad(50);
        light.penumbra = 1;
        // light.target.position.set(0, 0, 0);

        // let light = new THREE.AmbientLight(0xFFFFFF, 0.25);
        // light.castShadow = true;
        // light.shadow.bias = -0.001;
        // light.shadow.mapSize.width = 4096;
        // light.shadow.mapSize.height = 4096;
        // light.shadow.camera.near = 0.1;
        // light.shadow.camera.far = 500.0;
        // light.shadow.camera.near = 0.5;
        // light.shadow.camera.far = 500.0;

        //shadow map 범위
        // light.shadow.camera.left = 150;
        // light.shadow.camera.right = -150;
        // light.shadow.camera.top = 50;
        // light.shadow.camera.bottom = -50;
        scene.add(light.target);
        scene.add(light);

        // LightHelper = new THREE.PointLightHelper(light);
        // scene.add(LightHelper);

        //click 화면
				controls = new PointerLockControls( camera, document.body );

				const blocker = document.getElementById( 'blocker' );
				const instructions = document.getElementById( 'instructions' );

				instructions.addEventListener( 'click', function () {

					controls.lock();

				} );

				controls.addEventListener( 'lock', function () {

					instructions.style.display = 'none';
					blocker.style.display = 'none';

				} );

				controls.addEventListener( 'unlock', function () {

					blocker.style.display = 'block';
					instructions.style.display = '';

				} );

				scene.add( controls.getObject() );
        //click 화면 end

				function onKeyDown ( event ) {

					switch ( event.keyCode ) {

            case 16 :
              moveShift = true;
              break;

						case 87 :
							moveForward = true;
							break;

						case 65 :
							moveLeft = true;
							break;

						case 83 :
							moveBackward = true;
							break;

						case 68 :
							moveRight = true;
							break;

					}

				};

				function onKeyUp ( event ) {

					switch ( event.keyCode ) {

            case 16 :
              moveShift = false;
              break;

						case 87:
							moveForward = false;
							break;

						case 65:
							moveLeft = false;
							break;

						case 83:
							moveBackward = false;
							break;

						case 68:
							moveRight = false;
							break;
					}

				};

				document.addEventListener( 'keydown', (e) => onKeyDown(e), false );
				document.addEventListener( 'keyup', (e) => onKeyUp(e), false );

				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

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

        //도착지점

        let light_2 = new THREE.SpotLight(0xFF0000, 100);
        light_2.position.set(115, 1, 115);
        light_2.target.position.set(115, 0, 115);
        const lightShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        const lightBody = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(light_2.position.x, light_2.position.y, light_2.position.z),
          shape : lightShape,
          material: concreteMaterial,
        });
        lightBody.collisionResponse = 0;
        lightBody.addEventListener("collide", () => {
          if(time != 0){
            clearInterval(timer);
          }
          $("div").hide();
          const text_location = document.createElement('div');
              text_location.style.position = 'absolute';
              //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
              text_location.style.width = 100;
              text_location.style.height = 100;
              text_location.style.backgroundColor = "black";
              text_location.style.color = "white";
              text_location.style.fontSize = 50 + 'px';
              text_location.innerHTML = "Clear! " + th + ":" + tm + ":" + ts;
              text_location.style.top = 800 + 'px';
              text_location.style.left = 600 + 'px';
              document.body.appendChild(text_location);
        });
        world.addBody(lightBody);

        scene.add(light_2.target);
        scene.add(light_2);

        // floor

        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(250, 250, 10, 10),
          new THREE.MeshStandardMaterial({
              color: 0x000000,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        // CannonDebugRenderer_1 = new CannonDebugRenderer(scene, world);

        const floorShape = new CANNON.Box(new CANNON.Vec3(plane.scale.x*125, 0.1, plane.scale.z*125));
        const floorBody = new CANNON.Body();
        floorBody.mass = 0;
        floorBody.addShape(floorShape);
        floorBody.material = plasticMaterial;
        world.addBody(floorBody);

        const wall5 = new THREE.Mesh(
          new THREE.BoxGeometry(250, 0.1, 250), //x가로, y높이, z길이?
          new THREE.MeshStandardMaterial({
            color: 0x000000
          }));
        wall5.position.set(0, 20, 0); // 벽 위치
        wall5.castShadow = false;
        wall5.receiveShadow = true;
        scene.add(wall5);

        // const floorShape2 = new CANNON.Box(new CANNON.Vec3(plane2.scale.x*100, 0.1, plane2.scale.z*100));
        // const floorBody2 = new CANNON.Body();
        // floorBody2.mass = 0;
        // floorBody2.addShape(floorShape2);
        // floorBody2.material = plasticMaterial;
        // world.addBody(floorBody2);

        objectShape = new CANNON.Box(new CANNON.Vec3(1.5, 1, 1.5));
        objectBody = new CANNON.Body({
          mass : 0.000001,
          position : new CANNON.Vec3(120, 1, 120),
          shape : objectShape,
          material: plasticMaterial,
        });
        world.addBody(objectBody);

        //background

        scene.background = new THREE.Color( 0x000000 );

        //벽1
        const wall1 = new THREE.Mesh(
          new THREE.BoxGeometry(1, 20, 250), //x가로, y높이, z길이?
          new THREE.MeshStandardMaterial({
            color: 0x000000
          }));
        wall1.position.set(-125, 10, 0); // 벽 위치
        wall1.castShadow = true;
        wall1.receiveShadow = true;
        scene.add(wall1);

        const wall1Shape = new CANNON.Box(new CANNON.Vec3(wall1.scale.x, wall1.scale.y*10, wall1.scale.z*125));
        wall1Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(wall1.position.x, wall1.position.y, wall1.position.z),
          shape : wall1Shape,
          material: concreteMaterial,
        });
        wall1Body.collisionResponse = 0.1;
        wall1Body.addEventListener("collide", () => {
          // console.log("collide");
        })
        world.addBody(wall1Body);

    
        //벽2
        const wall2 = new THREE.Mesh(
          new THREE.BoxGeometry(250, 20, 1), //x가로, y높이, z길이?
          new THREE.MeshStandardMaterial({
            color: 0x000000
          }));
        wall2.position.set(0, 10, -125); // 벽 위치
        wall2.castShadow = true;
        wall2.receiveShadow = true;
        scene.add(wall2);

        const wall2Shape = new CANNON.Box(new CANNON.Vec3(wall2.scale.x * 125, wall2.scale.y*10, wall2.scale.z));
        wall2Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(wall2.position.x, wall2.position.y, wall2.position.z),
          shape : wall2Shape,
          material: concreteMaterial,
        });
        wall2Body.collisionResponse = 0.1;
        wall2Body.addEventListener("collide", () => {
          // console.log("collide");
        })
        world.addBody(wall2Body);
    
        //벽3 세워봄
        const wall3 = new THREE.Mesh(
          new THREE.BoxGeometry(1, 20, 250), //x가로, y높이, z길이?
          new THREE.MeshStandardMaterial({
            color: 0x000000
          }));
        wall3.position.set(125, 10, 0); // 벽 위치
        wall3.castShadow = true;
        wall3.receiveShadow = true;
        scene.add(wall3);

        const wall3Shape = new CANNON.Box(new CANNON.Vec3(wall3.scale.x, wall3.scale.y*10, wall3.scale.z*125));
        wall3Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(wall3.position.x, wall3.position.y, wall3.position.z),
          shape : wall3Shape,
          material: concreteMaterial,
        });
        wall3Body.collisionResponse = 0.1;
        wall3Body.addEventListener("collide", () => {
          // console.log("collide");
        })
        world.addBody(wall3Body);
    
        //벽4 세워봄
        const wall4 = new THREE.Mesh(
          new THREE.BoxGeometry(250, 20, 1), //x가로, y높이, z길이?
          new THREE.MeshStandardMaterial({
            color: 0x000000
          }));
        wall4.position.set(0, 10, 125); // 벽 위치
        wall4.castShadow = true;
        wall4.receiveShadow = true;
        scene.add(wall4);

        const wall4Shape = new CANNON.Box(new CANNON.Vec3(wall4.scale.x * 125, wall4.scale.y*10, wall4.scale.z));
        wall4Body = new CANNON.Body({
          mass : 0,
          position : new CANNON.Vec3(wall4.position.x, wall4.position.y, wall4.position.z),
          shape : wall4Shape,
          material: concreteMaterial,
        });
        wall4Body.collisionResponse = 0.1;
        wall4Body.addEventListener("collide", () => {
          // console.log("collide");
        })
        world.addBody(wall4Body);

				renderer = new THREE.WebGLRenderer( { alpha : true, antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor( 0xffffff, 0);
				document.body.appendChild( renderer.domElement );
				//

				window.addEventListener( 'resize', onWindowResize );

        const params = {
          camera: camera,
          scene: scene,
          domElement : renderer.domElement
        }
        new_controls = new BasicCharacterController(params);

        //타이머 설정
        $(document).ready(function(){
          buttonEvt();
        });


        RAF();
			}

      function buttonEvt(){
        let hour = 0;
        let min = 0;
        let sec = 0;
      
    
        if(starFlag){
          starFlag = false;
      
          timer = setInterval(function(){
              time++;
      
              min = Math.floor(time/60);
              hour = Math.floor(min/60);
              sec = time%60;
              min = min%60;
      
              th = hour;
              tm = min;
              ts = sec;
              if(th<10){
              th = "0" + hour;
              }
              if(tm < 10){
              tm = "0" + min;
              }
              if(ts < 10){
              ts = "0" + sec;
              }
              const text_location = document.createElement('div');
              text_location.style.position = 'absolute';
              //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
              text_location.style.width = 100;
              text_location.style.height = 100;
              text_location.style.backgroundColor = "black";
              text_location.style.color = "white";
              text_location.style.fontSize = 20 + 'px';
              text_location.innerHTML = "경과시간 " + th + ":" + tm + ":" + ts;
              text_location.style.top = 50 + 'px';
              text_location.style.left = 50 + 'px';
              document.body.appendChild(text_location);
            }, 1000);
          }
      };
      

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
        // renderer2.setSize( window.innerWidth / 4, window.innerHeight / 4 );

			}

			function animate() {

				requestAnimationFrame( animate );

				const time = performance.now();

				if ( controls.isLocked === true ) {

          velocity.x = 0;
          velocity.y = 0;
          velocity.z = 0;

					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;

					const intersections = raycaster.intersectObjects( objects, false );

					const onObject = intersections.length > 0;

					const delta = ( time - prevTime ) / 1000;

					velocity.x -= velocity.x * 10 * delta;
					velocity.z -= velocity.z * 10 * delta;

					velocity.y -= 9.8 * 10 * delta * 10; // 100.0 = mass

					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveRight ) - Number( moveLeft );
					direction.normalize(); // this ensures consistent movements in all directions

      
          if(moveShift) {
            if ( moveForward || moveBackward ) velocity.z -= direction.z * 40.0 * delta * 20;
					  if ( moveLeft || moveRight ) velocity.x -= direction.x * 40.0 * delta * 20;
          }
          else {
					  if ( moveForward || moveBackward ) velocity.z -= direction.z * 40.0 * delta * 10;
					  if ( moveLeft || moveRight ) velocity.x -= direction.x * 40.0 * delta * 10;
          }


					if ( onObject === true ) {

						velocity.y = Math.max( 0, velocity.y );

					}

					controls.moveRight( - velocity.x * delta );
					controls.moveForward( - velocity.z * delta );

					controls.getObject().position.y += ( velocity.y * delta ); // new behavior

					if ( controls.getObject().position.y < 10 ) {

						velocity.y = 0;
						controls.getObject().position.y = 10;


					}

      
				}

				prevTime = time;

				renderer.render( scene, camera );
        
      }

      function RAF() {
        requestAnimationFrame((t) => {

          
          if (previousRAF === null) {
            previousRAF = t;
          }
    
          RAF();
    
          renderer.render(scene, camera);

          Step(t - previousRAF);
          previousRAF = t;
        });
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