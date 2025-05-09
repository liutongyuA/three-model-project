<template>
    <div>
      <div v-if="isLoading" class="loading-container">
        <p>模型正在加载中...{{ parseInt(progress) + "%" }}</p>
        <div class="progress-bar">
          <div :style="{ width: progress + '%' }" class="progress"></div>
        </div>
      </div>
      <div ref="container" class="container"></div>
    </div>
  </template>
   
  <script>
  //封装的传参方式
   
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import TWEEN from "@tweenjs/tween.js";
  import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
  import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
  import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
  import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
  import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
  import createSprite from "../utils/spriteCreator.js";
  let renderer
  let camera
  let scene
  export default {
    name: "ThreeModel",
    data() {
      return {
        isLoading: true, // 用于控制加载提示的显示状态
        progress: 0, // 存储加载进度的数值
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        model: null,
        tween: null,
        light: null,
        light2: null,
        outlinePass: null,
        composer: null,
        selectedObjects: [],
        minFov: null,
        maxFov: null,
        onMouseMoveListener: null,
        mouse: new THREE.Vector2(),
        raycaster: new THREE.Raycaster(),
        glowMaterialList: [],
        hoverMeshTag: true,
        lastSelectedObject: null, // 新增：记录上一次选中的对象
        cameraStreamUrl: "", // 新增：存储后端返回的摄像头视频流地址
        message: "",
        css2DRenderer: null,
      };
    },
    created() {
   
    },
    mounted() {
      this.initThree();
      this.initLight();
      this.loadModel();
      this.addClickListener();
      this.clickListener();
      this.animate();
      this.initControls();
      window.addEventListener("resize", this.onWindowResize);
      this.$refs.container.addEventListener(
        "mousemove",
        this.onMouseMoveListener
      );
    },
    beforeDestroy() {
   
      window.removeEventListener("resize", this.onWindowResize);
      this.$refs.container.removeEventListener(
        "mousemove",
        this.onMouseMoveListener
      );
   
      // 销毁模型
      if (this.model) {
        scene.remove(this.model);
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        this.model = null;
      }
   
      // 清理渲染器
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement = null;
        renderer = null;
      }
   
      // 清理控制器
      if (this.controls) {
        this.controls.dispose();
        this.controls = null;
      }
   
      // 清理后期处理
      if (this.composer) {
        this.composer.passes.forEach((pass) => {
          if (pass.dispose) pass.dispose();
        });
        this.composer = null;
      }
   
      // 清空场景
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }
      scene = null;
    },
    methods: {
      initThree() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          1,
          100000
        );
        camera.position.z = 5;
        // camera.lookAt(camera.position);
        camera.position.set(0, 20000, 10000); // Y轴上方视角
        camera.lookAt(0, 0, 0); // 注视模型中心点
        renderer = new THREE.WebGLRenderer({
          antialias: true, // 确保此选项为true
        });
        // renderer.setPixelRatio(window.devicePixelRatio); // 添加像素比设置
        // renderer.setClearColor(new THREE.Color(0x003366), 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.$refs.container.appendChild(renderer.domElement);
        this.controls = new OrbitControls(camera, renderer.domElement);
      },
      initLight() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
   
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
   
        let light2 = new THREE.DirectionalLight(0xffffff);
        light2.position.set(-1, 1, -1);
        scene.add(light2);
      },
      loadModel() {
        const loader = new FBXLoader();
        loader.load(
          "./model/cs.fbx",
          (tree) => {
            // renderer = new THREE.WebGLRenderer({ antialias: true });
            const box = new THREE.Box3().setFromObject(tree);
            const center = new THREE.Vector3();
            box.getCenter(center);
            tree.position.sub(center);
            this.model = tree;
            scene.add(tree);
            this.controls.target.set(0, 0, 0); // 设置控制中心为模型原点
            this.isLoading = false; // 模型加载完成，隐藏加载提示
            // 遍历模型，根据条件创建精灵标注
            // 配置对象，存储对象名称和对应的状态
            const CAMERA_OBJECT_CONFIG = {
              "Obj3d66-14747625-136-727": {
                // 定义纹理映射
                state: "摄像头",
                // 图片大小
                scale: [10000, 10000, 1],
                // 位置
                yOffset: 2,
                // 接口视频链接
                videoUrl: "/cs.mp4",
              },
              "Obj3d66-14747625-136-726": {
                state: "摄像头",
                scale: [10000, 10000, 1],
                yOffset: 2,
                // 接口视频链接
                videoUrl: "/video.mp4",
              },
   
            };
            tree.traverse((child) => {
              // 遍历配置对象
              for (const [objectName, config] of Object.entries(
                CAMERA_OBJECT_CONFIG
              )) {
                if (child.name.includes(objectName)) {
                  // 接口里面的视频流
                  child.videoUrl = config.videoUrl;
                  // console.log(objectName, config, "objectName, config");
                  this.createAndHandleSprite(child, config);
                  break; // 找到匹配项后跳出循环
                }
              }
            });
          },
          (xhr) => {
            // 获取加载进度
            const progress = (xhr.loaded / xhr.total) * 100;
            this.progress = progress; // 更新加载进度数值
          },
          (error) => {
            // 处理加载错误
            console.error("模型加载失败:", error);
            this.isLoading = false; // 加载失败，隐藏加载提示
          }
        );
      },
      //
      // 封装创建精灵的逻辑和错误处理
      createAndHandleSprite(child, config) {
        const { state, scale, yOffset } = config;
        return createSprite(child, state, scale, yOffset)
          .then(() => {
            console.log(`${state} 精灵创建成功`);
          })
          .catch((error) => {
            console.error(`${state} 精灵创建失败:`, error);
          });
      },
      clickListener() {
        renderer.domElement.addEventListener("click", (event) => {
          const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
          );
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(
            scene.children,
            true
          );
          if (intersects.length > 0) {
            console.log(intersects);
            this.selectedObjects = [];
            this.selectedObjects.push(intersects[0].object);
            this.outlineObj(this.selectedObjects);
   
          }
        });
      },
      addClickListener() {
        renderer.domElement.addEventListener("dblclick", (event) => {
          const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
          );
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(
            scene.children,
            true
          );
   
          if (intersects.length > 0) {
            console.log(intersects);
            this.selectedObjects = [];
            this.selectedObjects.push(intersects[0].object);
            this.outlineObj(this.selectedObjects);
            const targetObject = intersects[0].point;
            this.moveToTarget(targetObject);
          }
        });
      },
   
      outlineObj(selectedObjects) {
        console.log(selectedObjects, "outlineObj");
        this.composer = new EffectComposer(renderer);
        this.renderPass = new RenderPass(scene, camera);
        this.composer.addPass(this.renderPass);
        this.outlinePass = new OutlinePass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          scene,
          camera,
          selectedObjects
        );
        this.outlinePass.edgeStrength = 8.0;
        this.outlinePass.edgeGlow = 1;
        this.outlinePass.usePatternTexture = false;
        this.outlinePass.edgeThickness = 3;
        this.outlinePass.downSampleRatio = 1;
        this.outlinePass.pulsePeriod = 2;
        this.outlinePass.visibleEdgeColor.set(parseInt(0x00f6ff));
        this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0);
        this.composer.addPass(this.outlinePass);
        this.outlinePass.selectedObjects = selectedObjects;
        // 添加FXAA抗锯齿通道
        const FXAAShader =
          require("three/examples/jsm/shaders/FXAAShader").FXAAShader;
        const fxaaPass = new ShaderPass(FXAAShader);
        const pixelRatio = renderer.getPixelRatio();
        fxaaPass.material.uniforms["resolution"].value.x =
          1 / (window.innerWidth * pixelRatio);
        fxaaPass.material.uniforms["resolution"].value.y =
          1 / (window.innerHeight * pixelRatio);
        this.composer.addPass(fxaaPass);
   
        // 确保最后一个pass渲染到屏幕
        fxaaPass.renderToScreen = true;
        this.outlinePass.renderToScreen = false; // 关闭原有pass的直接渲染
      },
      moveToTarget(targetPosition) {
        console.log(targetPosition, "坐标");
        const startPosition = camera.position.clone();
        const distance = startPosition.distanceTo(targetPosition);
        const duration = 2000;
        const tween = new TWEEN.Tween(startPosition)
          .to(
            {
              x: targetPosition.x - 1.5,
              y: targetPosition.y,
              z: targetPosition.z - 0.5,
            },
            duration
          )
          .onUpdate(() => {
            camera.position.set(
              startPosition.x,
              startPosition.y,
              startPosition.z
            );
            camera.lookAt(targetPosition);
          })
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
      },
      animate() {
        requestAnimationFrame(this.animate);
        // 只在有 Tween 动画时更新
        if (TWEEN.getAll().length > 0) {
          TWEEN.update();
        }
   
        this.controls.update();
   
        if (this.composer && this.selectedObjects.length > 0) {
          // 只在有选中对象时进行后期处理
          this.composer.render();
        } else {
          renderer.render(scene, camera);
        }
      },
      onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
      },
      initControls() {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.target.set(0, 0, 0); // 确保目标点与模型中心一致
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.zoomSpeed = 3;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 92200;
   
        // 添加垂直旋转限制（单位：弧度）
        this.controls.minPolarAngle = 0; // 正上方角度
        this.controls.maxPolarAngle = Math.PI / 2; // 限制最大俯角为水平视角
   
        this.minAzimuthAngle = -Math.PI * 2;
        this.maxAzimuthAngle = Math.PI * 2;
        this.controls.enabledPan = true;
        this.keyPanSpeed = 7.0;
      },
    },
  };
  </script>
   
  <style scoped lang="scss">
  .loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    z-index: 10001;
    font-size: 0.25rem;
  }
   
  .progress-bar {
    width: 3.75rem;
    height: 0.3125rem;
    background-color: #ccc;
    border-radius: 0.125rem;
    overflow: hidden;
    margin-top: 0.125rem;
  }
  .progress {
    height: 100%;
    background-color: #007bff;
    width: 0%;
  }
  ::v-deep {
    .container {
      width: 100%;
      cursor: pointer;
    }
  }
  </style>