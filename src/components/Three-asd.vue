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
    // 创建材质
    const pipeLength = 5; // 管道长度
    const pipeSegments = 32; // 管道分段数
    const pipeRadius = 0.5
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    // 创建垂直管道
    const verticalPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeLength, pipeSegments),
        material
    );
    verticalPipe.position.y = pipeLength / 2; // 调整位置
  
    // 创建水平管道
    const horizontalPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeLength, pipeSegments),
        material
    );
    horizontalPipe.rotation.z = Math.PI / 2; // 旋转 90 度
    horizontalPipe.position.x = pipeLength / 2; // 调整位置
  
    // 创建直角弯头（使用立方体模拟）
    const elbowSize = pipeRadius * 2; // 弯头尺寸
    const elbow = new THREE.Mesh(
        new THREE.BoxGeometry(elbowSize, elbowSize, elbowSize),
        material
    );
    elbow.position.x = pipeLength / 2; // 调整位置
    elbow.position.y = pipeLength / 2; // 调整位置
  
    // 将管道和弯头添加到场景中
    scene.add(verticalPipe);
    scene.add(horizontalPipe);
    scene.add(elbow);
  
    // 设置相机位置
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    
    //渲染
    function render() {
      renderer.render(scene, camera);
      // 旋转模型以便观察
      verticalPipe.rotation.y += 0.01;
      horizontalPipe.rotation.y += 0.01;
      elbow.rotation.y += 0.01;
      //渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }
    render();
    const gltfLoader = new GLTFLoader()
    gltfLoader.load('./3d/毛细2.glb',(gltf)=>{
      const model = gltf.scene
     
      scene.add(model)
    })
    
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;//重置相机宽高比
      camera.updateProjectionMatrix();//更新相机投影矩阵
      renderer.setSize(window.innerWidth, window.innerHeight);//重置渲染器宽高比
    });
  })
})

</script>

<style scoped>

.canvas {
    width: 100vw;
    height: 100vh;
}
</style>