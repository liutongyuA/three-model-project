<template>
    <div ref="canvas" class="canvas"></div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"//加载模型
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"//解压器
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Water } from 'three/examples/jsm/objects/Water2';
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
// 设置相机位置
camera.position.set(-3.23, 2.98, 4.06);


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

// 创建轨道控制器 设置阻尼 旋转
const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;//重置相机宽高比
  camera.updateProjectionMatrix();//更新相机投影矩阵
  renderer.setSize(window.innerWidth, window.innerHeight);//重置渲染器宽高比
});
const gltfLoader = new GLTFLoader()
gltfLoader.load('./3d/scene.glb',(gltf)=>{
  scene.add(gltf.scene)
})
//解压
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("./draco/")
gltfLoader.setDRACOLoader(dracoLoader)
//平行光
const light = new THREE.DirectionalLight( 0xffffff, 1);
light.position.set( 50, 50, 50 );
scene.add( light );
// 添加点光源
// const pointLight = new THREE.PointLight(0xffffff, 50);
// pointLight.position.set(0.1, 2.4, 0);
// pointLight.castShadow = true;
// scene.add(pointLight);

function render() {
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
  controls.update()
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
// 加载环境贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/sky.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;//360全景映射
  // 设置环境贴图
  scene.environment = envMap;
  scene.background = envMap;
});
//创建水面
const waterGeometry = new THREE.CircleGeometry(300, 32);
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 100,
});
water.rotation.x = -Math.PI / 2;
water.position.y = -0.4;
scene.add(water)
</script>

<style scoped>
canvas {
    width: 100vw;
    height: 100vh;
}
</style>