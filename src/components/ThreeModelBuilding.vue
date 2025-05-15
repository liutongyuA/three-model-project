<template>
  <div ref="canvas" class="canvas"></div>

  <el-button type="primary" @click="handleClick">切换</el-button>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; //加载模型
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"; //解压器
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import gsap from "gsap";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer"; // 二维标签渲染器
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer"; // 三维标签渲染器
import { CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";
let camera;
let renderer;
let controls;
let axesHelper;
let labelRenderer; // 二维标签
let css3DRenderer; // 三维标签
let scene;
let objectModel;
const canvas = ref();

onMounted(() => {
  nextTick(() => {
    initScene();
    initCamera();
    initRenderer();
    initControl();
    renderDom();
    loaderModel();
    initGui();
    loadCameraPositions();
  });
});
const initScene = () => {
  scene = new THREE.Scene();
  const loaderbox = new THREE.CubeTextureLoader(); // 加载贴图
  let type = "day";
  const cubeTexture = loaderbox.load([
    `/images/skybox/${type}/posx.jpg`,
    `/images/skybox/${type}/negx.jpg`,
    `/images/skybox/${type}/posy.jpg`,
    `/images/skybox/${type}/negy.jpg`,
    `/images/skybox/${type}/posz.jpg`,
    `/images/skybox/${type}/negz.jpg`,
  ]);
  scene.background = cubeTexture;
  //创建场景雾
  // scene.fog = new THREE.Fog(0x999999, 0.1, 50 )
  // scene.background = new THREE.Color(0x999999)
};

const initRenderer = () => {
  renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
  canvas.value.appendChild(renderer.domElement);
  // 使用渲染器，通过相机将场景渲染进来
  renderer.render(scene, camera);
};
const initCamera = () => {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // 设置相机位置
  camera.position.set(0, 40, 100);
};
const initControl = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  // controls.autoRotate = true;//自动围绕旋转
  // 创建轨道控制器 设置阻尼 旋转
  controls.enableDamping = true;
};

const renderDom = () => {
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
  controls.update();
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(renderDom);
};

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight; //重置相机宽高比
  camera.updateProjectionMatrix(); //更新相机投影矩阵
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
});

//多个模型加载
const loaderModel = () => {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("./3d/officeBuild.glb", (gltf) => {
    const model = gltf.scene;
    //旋转360度
    console.log(model);
    model.rotation.y = Math.PI;
    model.position.set(16, 0, -5);
    model.scale.set(0.4, 0.4, 0.4);
    model.name = "办公大厅";
    scene.add(model);
    objectModel = model;
  });
  //解压
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  //平行光
  const light = new THREE.AmbientLight(0xffffff, 1);
  // light.position.set( 50, 50, 50 );
  scene.add(light);
};
const isFloor = ref(false);
const handleClick = () => {
  isFloor.value = !isFloor.value;
  //分离
  objectModel.children.forEach((child, index) => {
    if (index != 2 && isFloor.value) {
      // gsap.to(child.position, {
      //   z: child.position.z - 40,
      //   duration: 2,
      //   ease: 'power1.inOut',
      //   onComplete: () => {
      //     lastIndex = index
      //   }
      // })

      child.visible = false;
    } else if (!isFloor.value && index != 2) {
      child.visible = true;
    }
  });
  if (isFloor.value) {
    gsap.to(camera.position, {
      x: 1.6,
      y: 53,
      z: 53,
      duration: 2,
      ease: "power1.inOut",
      onComplete: () => {},
    });
    gsap.to(controls.target, {
      x: 1.6,
      y: -3.2,
      z: 9,
      duration: 2,
      ease: "power1.inOut",
      onComplete: () => {},
    });
  } else {
    gsap.to(controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
      ease: "power1.inOut",
      onComplete: () => {},
    });
    gsap.to(camera.position, {
      x: 0,
      y: 40,
      z: 100,
      duration: 2,
      ease: "power1.inOut",
      onComplete: () => {},
    });
  }
};
const initGui = () => {
  const gui = new GUI();
  // 1. 相机控制
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", -100, 100).name("Position X");
  cameraFolder.add(camera.position, "y", -100, 100).name("Position Y");
  cameraFolder.add(camera.position, "z", -100, 100).name("Position Z");
  const controlFolder = gui.addFolder("Controls");
  controlFolder.add(controls.target, "x", -100, 100).name("Position X");
  controlFolder.add(controls.target, "y", -100, 100).name("Position Y");
  controlFolder.add(controls.target, "z", -100, 100).name("Position Z");
};

const createCameraIcon = (type) => {
  if (type == "3D") {
    let cameraIconModel;
    // 预加载摄像头图标模型(3D)
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("camera_icon.gltf", (gltf) => {
      cameraIconModel = gltf.scene;
      cameraIconModel.scale.set(0.1, 0.1, 0.1);
      cameraIconModel.userData.isCamera = true;
      return cameraIconModel;
    });
  } else {
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load("/image/摄像头.png");
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.userData.isCamera = true;
    return sprite;
  }
};
const addCameraLabel = (cameraIcon) => {
  const labelDiv = document.createElement("div");
  labelDiv.className = "camera-label";
  labelDiv.textContent = "摄像头";
  labelDiv.style.color = "white";
  labelDiv.style.backgroundColor = "rgba(0,0,0,0.7)";
  labelDiv.style.padding = "5px 10px";
  labelDiv.style.borderRadius = "5px";
  labelDiv.style.pointerEvents = "none";
  const label = new CSS2DObject(labelDiv);
  label.position.set(0, 2, 0); // 在图标上方
  cameraIcon.add(label);
};
const loadCameraPositions = () => {
  const cameraIcon = createCameraIcon();
  const point = new THREE.Vector3(-1, 11, 16);
  console.log(point, "point");
  cameraIcon.position.copy(point);
  // cameraIcon.position.set(camData.position.x, camData.position.y, camData.position.z);
  scene.add(cameraIcon);

  console.log("摄像头位置已加载");
};
</script>

<style>
.canvas {
  width: 80vw;
  height: 80vh;
}
</style>
