<template>
    <div ref="canvas" class="canvas"></div>
</template>

<script setup >
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"//加载模型
const canvas = ref()
onMounted(()=>{
  nextTick(()=>{

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    // 设置相机位置
    camera.position.set(0, 0, 10);
    //创建渲染器
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
    canvas.value.appendChild(renderer.domElement)
    // 使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera);
    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    // 添加物体
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);// 创建几何体
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });// 创建材质
    // 根据几何体和材质创建物体
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // 修改物体的位置
    // cube.position.set(3, 0, 0);
    //添加到场景
    scene.add(cube); 
    
    //渲染
    function render() {
      renderer.render(scene, camera);
      //渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }
    render();
    
    // const light = new THREE.AmbientLight( 0xffffff, 1);
    // scene.add( light );
    // // 添加坐标轴辅助器
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    
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
  
    gui.add(obj,"FullScreen").name("全屏")
    gui.add(cube.position,"x").min(-10).max(10).step(1).name("设置x轴").onChange(()=>{
  
    })
    gui.add(cubeMaterial, "wireframe").name("材质")
    let folder = gui.addFolder("位置")
    folder.add(cube.position,"y").min(-10).max(10).step(1).name("设置y轴")
  })
})

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

.canvas {
    width: 100vw;
    height: 100vh;
}
</style>