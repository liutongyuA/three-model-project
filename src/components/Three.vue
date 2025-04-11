<template>
    <div ref="canvas" class="canvas"></div>
</template>

<script setup >
import { ref, reactive } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"//加载模型

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
// 设置相机位置
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);



  const gltfLoader = new GLTFLoader()
  gltfLoader.load('./3d/毛细2.glb',(gltf)=>{
    const model = gltf.scene
   
    scene.add(model)
  })

  const light = new THREE.AmbientLight( 0xffffff, 1);
  scene.add( light );



// 创建轨道控制器 设置阻尼 旋转
const controls = new OrbitControls(camera, renderer.domElement);

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render() {
  //如果后期需要控制器带有阻尼效果，或者自动旋转等效果，就需要加入controls.update()
//   controls.update()
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

//工具
const gui = new GUI()

// // 创建材质
// const pipeLength = 5; // 管道长度
// const pipeSegments = 32; // 管道分段数

// // 创建垂直管道
// const verticalPipe = new THREE.Mesh(
//     new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeLength, pipeSegments),
//     material
// );
// verticalPipe.position.y = pipeLength / 2; // 调整位置

// // 创建水平管道
// const horizontalPipe = new THREE.Mesh(
//     new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeLength, pipeSegments),
//     material
// );
// horizontalPipe.rotation.z = Math.PI / 2; // 旋转 90 度
// horizontalPipe.position.x = pipeLength / 2; // 调整位置

// // 创建直角弯头（使用立方体模拟）
// const elbowSize = pipeRadius * 2; // 弯头尺寸
// const elbow = new THREE.Mesh(
//     new THREE.BoxGeometry(elbowSize, elbowSize, elbowSize),
//     material
// );
// elbow.position.x = pipeLength / 2; // 调整位置
// elbow.position.y = pipeLength / 2; // 调整位置

// // 将管道和弯头添加到场景中
// scene.add(verticalPipe);
// scene.add(horizontalPipe);
// scene.add(elbow);

// // 设置相机位置
// camera.position.set(10, 10, 10);
// camera.lookAt(0, 0, 0);

// // 渲染循环
// function animate() {
//     requestAnimationFrame(animate);

//     // 旋转模型以便观察
//     verticalPipe.rotation.y += 0.01;
//     horizontalPipe.rotation.y += 0.01;
//     elbow.rotation.y += 0.01;

//     // 渲染场景
//     renderer.render(scene, camera);
// }

// animate();
// gui.add(obj,"FullScreen").name("全屏")
// gui.add(cube.position,"x").min(-10).max(10).step(1).name("设置x轴").onChange(()=>{

// })
// gui.add(cubeMaterial, "wireframe").name("材质")
// let folder = gui.addFolder("位置")
// folder.add(cube.position,"y").min(-10).max(10).step(1).name("设置y轴").onFinshChange(()=>{
  
// })

// //加载纹理
// let textureLoader = new THREE.TextureLoader()
// let texture = textureLoader.load("./vite.svg")
// texture.colorSpace = THREE.SRGBColorSpace //纹理的颜色空间，处理纹理出现色差问题

// //加载环境遮挡贴图
// let aoMap = textureLoader.load("")
// //透明度贴图(白色完全透明，黑色完全不透明)
// let alphaMap = textureLoader.load("")
// //光照贴图
// let lightMap = textureLoader.load("")
// //hdr 环境贴图
// let rgbeLoader = new RGBELoader()
// rgbeLoader.load("",(envMap)=>{
//   //设置球型贴图
//   envMap.mapping = THREE.EquirectangularRefractionMapping
//   //设置环境贴图
//   scene.backgorund = envMap
//   scene.enviroment = envMap
//   planeMaterial.envMap = envMap
// })
// //贴图
// let planeGeomery = new THREE.PlaneGeometry(1, 1) //设置平面(几何体)
// let planeMaterial = new THREE.MeshBasicMaterial({ //设置材质
//   color: 0xffffff,
//   map: texture,
//   transparent: true,//允许透明
//   aoMap,
//   alphaMap
// })
// let plane = new THREE.Mesh(planeGeomery, planeMaterial);
// // 根据几何体和材质创建物体
// scene.add(plane)
</script>

<style scoped>

canvas {
    width: 100vw;
    height: 100vh;
}
</style>