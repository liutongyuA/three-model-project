<template>
  <div ref="canvas" class="canvas"></div>
  <!-- css3标签 -->
  <div id="tag" style="backface-visibility: hidden;">标签内容</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"//加载模型
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"//解压器
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import gsap from "gsap";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer" // 二维标签渲染器
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer" // 三维标签渲染器
import { CSS3DSprite } from 'three/addons/renderers/CSS3DRenderer.js';
let camera 
let renderer
let controls
let axesHelper
let labelRenderer // 二维标签
let css3DRenderer  // 三维标签
let scene
const canvas = ref()

onMounted(()=>{
 nextTick(()=>{
  initScene()
  initCamera()
  initRenderer()
  initControl()
  initGui()
  renderDom()
  loaderModel()
  // loadCameraPositions()
  //标记标注（圆锥案例）
  // addCss3Label()
  initClickListener()
 })
})
const initScene = ()=>{
  scene = new THREE.Scene()
  //创建场景雾
  // scene.fog = new THREE.Fog(0x999999, 0.1, 50 )
  // scene.background = new THREE.Color(0x999999)
}

const initRenderer = ()=>{
  renderer = new THREE.WebGLRenderer()
  // renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
  canvas.value.appendChild(renderer.domElement)
  // 使用渲染器，通过相机将场景渲染进来
  renderer.render(scene, camera);
 
  labelRenderer = new CSS2DRenderer() // 标签渲染器
  labelRenderer.domElement.style.zIndex = 2
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  labelRenderer.domElement.style.left = '0px'
  labelRenderer.domElement.style.pointerEvents = 'none'// 避免HTML标签遮挡三维场景的鼠标事件
  canvas.value.appendChild(labelRenderer.domElement)
  labelRenderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight) // 设置标签渲染器的尺寸

  css3DRenderer = new CSS3DRenderer() // 标签渲染器
  css3DRenderer.domElement.style.zIndex = 0
  css3DRenderer.domElement.style.position = 'absolute'
  css3DRenderer.domElement.style.top = '0px'
  css3DRenderer.domElement.style.left = '0px'
  css3DRenderer.domElement.style.pointerEvents = 'none'// 避免HTML标签遮挡三维场景的鼠标事件
  canvas.value.appendChild(css3DRenderer.domElement)
  css3DRenderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight) // 设置标签渲染器的尺寸

}
const initCamera = ()=>{
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  // 设置相机位置
  camera.position.set(0, 40, 100);
}
const initControl =()=>{
   controls = new OrbitControls(camera, renderer.domElement);
  // 创建轨道控制器 设置阻尼 旋转
  // enableDamping
}

const addCube = ()=>{
  // 添加物体
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);// 创建几何体
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });// 创建材质
  // 根据几何体和材质创建物体
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  
  // 修改物体的位置
  cube.position.set(3, 0, 0);
  // cube.position.x = 3;
  //设置缩放
  // cube.scale.set(2, 2, 2);
  //
  // 设置物体的旋转角度
  cube.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI);
  
  // 将几何体添加到场景中
  scene.add(cube); 
}
const addAxis = ()=>{
  // 添加坐标轴辅助器
  axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}
const renderDom = ()=>{
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
  controls.update()
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(renderDom);
  labelRenderer.render(scene, camera) // 渲染2d标签场景
  css3DRenderer.render(scene, camera) // 渲染3d标签场景
}

const addCss3Label = ()=>{
  // HTML元素转化为threejs的CSS3模型对象
  const div = document.getElementById('tag');
  const tag = new CSS3DObject(div);
  const geometry = new THREE.ConeGeometry(25, 40);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });// 创建材质
  geometry.translate(0, 0, 0);

  const mesh = new THREE.Mesh(geometry, material);
  //标签tag作为mesh子对象，默认标注在模型局部坐标系坐标原点
  console.log(tag)
  mesh.add(tag);
  scene.add(mesh); 
  // 相对父对象局部坐标原点偏移80,刚好标注在圆锥
  tag.position.y += 40;
}
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;//重置相机宽高比
  camera.updateProjectionMatrix();//更新相机投影矩阵
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
  // labelRenderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight) // 设置标签渲染器的尺寸
  css3DRenderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight) // 设置标签渲染器的尺寸
});
//工具
const initGui = ()=>{
  const gui = new GUI()
  // gui.add(cube.position,"x").min(-10).max(10).step(1).name("设置x轴").onChange(()=>{

  // })
  // gui.add(cubeMaterial, "wireframe").name("材质")
  // let folder = gui.addFolder("位置")
  // folder.add(cube.position,"y").min(-10).max(10).step(1).name("设置y轴").onFinshChange(()=>{
    
  // })
  //全屏
  // renderer.domElement.requestFullscreen(); 退出全屏 exitFullscreen()
  const obj = {
    FullScreen: ()=>{
      renderer.domElement.requestFullscreen();
    }
  }
  gui.add(obj,"FullScreen").name("全屏")

}


//创建长方体
const addBoxGeometry =()=>{
  const boxGeometry = new THREE.BoxGeometry(1, 1, 100);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });// 创建材质
  // 根据几何体和材质创建物体
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(box); 
}
//多个模型加载
const loaderModel = ()=>{
  const gltfLoader = new GLTFLoader()
  
  const glbModels = [
  './3d/NoLod_0.glb',
  './3d/NoLod_1.glb',
  './3d/NoLod_2.glb',
  './3d/NoLod_3.glb',
  './3d/NoLod_4.glb',
  './3d/NoLod_5.glb',
  './3d/NoLod_6.glb',
  ];
  glbModels.forEach((modelPath) => {
  gltfLoader.load(modelPath,(gltf)=>{
    const model = gltf.scene
    scene.add(model)
  })
  })
  //解压
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("./draco/")
  gltfLoader.setDRACOLoader(dracoLoader)
  
  const jsonModels = [
  './3d/scenetree.json',
  './3d/tileset.json'
  ];
  // // 加载 JSON 模型
  // const objectLoader = new OBJLoader()
  // jsonModels.forEach((modelPath) => {
  //   objectLoader.load(modelPath, (object) => {
  //     scene.add(object); // 将 JSON 对象添加到场景中
  //   }, undefined, (error) => {
  //     console.error('An error happened while loading the JSON model:', error);
  //   });
  // });
  
  // // 加载环境贴图
  // let rgbeLoader = new RGBELoader();
  // rgbeLoader.load("./3d/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  //   envMap.mapping = THREE.EquirectangularReflectionMapping;
  //   // 设置环境贴图
  //   scene.environment = envMap;
  // });
  //平行光
  const light = new THREE.AmbientLight( 0xffffff, 1);
  // light.position.set( 50, 50, 50 );
  scene.add( light );

}

const createCameraIcon =(type)=>{
  if(type == "3D"){
    let cameraIconModel;
    // 预加载摄像头图标模型(3D)
    const gltfLoader = new GLTFLoader()
    gltfLoader.load('camera_icon.gltf', (gltf) => {
      cameraIconModel = gltf.scene;
      cameraIconModel.scale.set(0.1, 0.1, 0.1);
      cameraIconModel.userData.isCamera = true;
      return cameraIconModel
    });
  }else{
    const texLoader= new THREE.TextureLoader();
    const texture = texLoader.load("/image/摄像头.png");
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.userData.isCamera = true;
    return sprite
  }
  
}
const addCameraLabel = (cameraIcon)=>{
  const labelDiv = document.createElement('div');
  labelDiv.className = 'camera-label';
  labelDiv.textContent = "摄像头";
  labelDiv.style.color = 'white';
  labelDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
  labelDiv.style.padding = '5px 10px';
  labelDiv.style.borderRadius = '5px';
  labelDiv.style.pointerEvents = 'none';
  const label = new CSS2DObject(labelDiv);
  label.position.set(0, 2, 0); // 在图标上方
  cameraIcon.add(label);
}
//保存和加载摄像头位置
const saveCameraPositions= () =>{
  const cameras = [];
  scene.traverse((obj) => {
    if (obj.userData.isCamera) {
      cameras.push({
        position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
        rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z }
      });
    }
  });
  
  localStorage.setItem('cameraPositions', JSON.stringify(cameras));
  console.log('摄像头位置已保存');
}

const loadCameraPositions =()=> {
  const savedData = localStorage.getItem('cameraPositions');
  if (!savedData) return;
  
  const cameras = JSON.parse(savedData);
  cameras.forEach((camData) => {
    const cameraIcon = createCameraIcon();
    cameraIcon.position.set(camData.position.x, camData.position.y, camData.position.z);
    cameraIcon.rotation.set(camData.rotation.x, camData.rotation.y, camData.rotation.z);
    scene.add(cameraIcon);
  });
  
  console.log('摄像头位置已加载');
}

//鼠标点击标记

const initClickListener = ()=>{
  renderer.domElement.addEventListener("click", (event) => {
    modelOnClick(event, scene)

  })
}

const modelOnClick = (event, object)=> {
  //获取容器相对视口的位置 从而获取鼠标点击位置基于容器的坐标
  const x = event.clientX - canvas.value.getBoundingClientRect().left
  const y = event.clientY - canvas.value.getBoundingClientRect().top
  const mouse = new THREE.Vector2(
    (x / canvas.value.clientWidth) * 2 - 1,
    -(y / canvas.value.clientHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(object, true);
  if (intersects.length <= 0) return void 0;
  const point = intersects[0].point; // 交点世界坐标
  const face = intersects[0].face; // 面的信息
  const mesh = intersects[0].object; // 被击中的网格
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  const worldNormal = new THREE.Vector3()
    .copy(face.normal)
    .applyMatrix3(normalMatrix)
    .normalize();
  const normal = intersects[0].face.normal; // 获取法向量
  // translateCamera(intersects[0].point, intersects[0].point)

  // 创建摄像头图标
  let cameraIcon;
  cameraIcon = createCameraIcon("2D");
  // 使用3D模型
  // cameraIcon = createCameraIcon("3D").clone()
  // 设置位置和朝向
  cameraIcon.position.copy(point);
  // 使图标朝向法线方向（贴在表面上 3D时）
  if (cameraIcon.isSprite) {
    cameraIcon.lookAt(new THREE.Vector3().copy(point).add(normal));
  }
  // 调整圆形物体的朝向，使其与墙壁表面对齐
  cameraIcon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  // 将圆形物体稍微向外偏移，避免穿透
  cameraIcon.position.addScaledVector(worldNormal, 0.5);
  scene.add(cameraIcon);
  // addCameraLabel(cameraIcon)
  // saveCameraPositions()
}
// 使用补间动画移动相机
let timeLine1 = gsap.timeline();
let timeline2 = gsap.timeline();

// 定义相机移动函数
const translateCamera = (position, target) => {
timeLine1.to(camera.position, {
  x: position.x,
  y: position.y,
  z: position.z,
  duration: 1,
  ease: "power2.inOut",
});
//移动相机控制器 转相机
// timeline2.to(controls.target, {
//   x: target.x,
//   y: target.y,
//   z: target.z,
//   duration: 1,
//   ease: "power2.inOut",
// });
}
</script>

<style>
.canvas {
  width: 80vw;
  height: 80vh;
}
#tag {
    padding: 0px 10px;
    border: #00ffff solid 1px;
    height: 40px;
    border-radius: 5px;
    width: 40px;
    color: #bfa;
}
</style>