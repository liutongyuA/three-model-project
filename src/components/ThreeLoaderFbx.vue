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
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
// 设置相机位置
camera.position.set(0, 40, 100);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

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
  // scene.add(cube); 
// 创建轨道控制器 设置阻尼 旋转
const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

function render() {
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
  controls.update()
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;//重置相机宽高比
  camera.updateProjectionMatrix();//更新相机投影矩阵
  renderer.setSize(window.innerWidth, window.innerHeight);//重置渲染器宽高比
});
//全屏
// renderer.domElement.requestFullscreen(); 退出全屏 exitFullscreen()
const obj = {
  FullScreen: ()=>{
    renderer.domElement.requestFullscreen();
  }
}

scene.background = new THREE.Color(0x999999)
const fbxLoader = new FBXLoader();
fbxLoader.load('./3d/A.fbx', (object) => {
  scene.add(object);
});

let rgbeLoader = new RGBELoader();
rgbeLoader.load("./3d/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图
  scene.environment = envMap;
});
</script>

<style scoped>
canvas {
    width: 100vw;
    height: 100vh;
}
</style>