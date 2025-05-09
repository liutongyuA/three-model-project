<template>
  <div ref="canvas" class="canvas"></div>
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
  renderDom()
  loaderModel()

 })
})
const initScene = ()=>{
  scene = new THREE.Scene()
  const loaderbox = new THREE.CubeTextureLoader() // 加载贴图
  let type = "day"
  const cubeTexture = loaderbox.load([
    `/images/skybox/${type}/posx.jpg`,
    `/images/skybox/${type}/negx.jpg`,
    `/images/skybox/${type}/posy.jpg`,
    `/images/skybox/${type}/negy.jpg`,
    `/images/skybox/${type}/posz.jpg`,
    `/images/skybox/${type}/negz.jpg`
  ])
  scene.background = cubeTexture
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


const renderDom = ()=>{
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
  controls.update()
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(renderDom);
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;//重置相机宽高比
  camera.updateProjectionMatrix();//更新相机投影矩阵
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
});


//多个模型加载
const loaderModel = ()=>{
  const gltfLoader = new GLTFLoader()
 
  gltfLoader.load("./3d/officeBuild.glb",(gltf)=>{
    const model = gltf.scene
    scene.add(model)
  })
  //解压
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("./draco/")
  gltfLoader.setDRACOLoader(dracoLoader)
  
  //平行光
  const light = new THREE.AmbientLight( 0xffffff, 1);
  // light.position.set( 50, 50, 50 );
  scene.add( light );

}

</script>

<style>
.canvas {
  width: 80vw;
  height: 80vh;
}
</style>