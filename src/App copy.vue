

<template>
  <el-button type="primary" class="upload-button" @click="uploads">上传</el-button>
        <!-- <input ref="fileRef" type="file" name="file" accept="image/png, image/jpeg, image/jpg" style="display: none;" @change="handleFileUpload"> -->
   <input multiple id="fileInput" ref="fileRef" type="file" name="file" style="display: none;" @change="handleFileUpload">

  <!-- <div ref="domRef" class="dom"></div> -->
  <div id="cad-view"></div>
</template>
<script setup lang="ts">
import DxfParser from 'dxf-parser'

import { Viewer } from "./threedxf/threedxf.js";

import * as PIXI from "pixi.js"

import { ref, onMounted } from 'vue'

const fileRef = ref(null)

const uploads =()=>{
  fileRef.value.dispatchEvent(new MouseEvent('click'))
  
}
const handleFileUpload = (event: any)=>{
  const file = event.target.files[0]
  let reader = new FileReader()
  reader.readAsText(file)
  reader.onload = function(e){
    let parser = new DxfParser()
    let dxf = parser.parseSync(e.target?.result)
    Viewer(dxf, document.getElementById('cad-view'), 400, 400);
  }

  // const viewer = new dxf.Viewer(files);
  // const svg = viewer.toSVG();

  // // 将SVG元素插入到页面中的某个元素里
  // document.getElementById('dxf-container').innerHTML = svg;

}
const domRef =ref()
let app: any 
const initPixi =()=>{
app = new PIXI.Application({ resizeTo: domRef.value, backgroundColor: 0x000000 })
 app.stage.sortableChildren = true
 domRef.value.appendChild(app.view)
}
 onMounted(() => {
  initPixi()
 })
 const loadPlan = (url: any)=>{
  console.log(url)
  drawDXF(url)
  // PIXI.Assets.load('/xx.dxf')
  // .then((texture) => {
  //   console.log(texture)
  //   // const newPlanSprite = PIXI.Sprite.from(texture)
  //   // app.stage.addChild(newPlanSprite)
  // })
 }
 function drawDXF(dxfData) {
  const graphics = new PIXI.Graphics();
console.log( dxfData.entities)
  dxfData.entities.forEach(entity => {
      if (entity.type === 'LINE') {
        graphics.lineStyle(1, 0xffffff)
                            .moveTo(entity.vertices[0].x, entity.vertices[0].y)
                            .lineTo(entity.vertices[1].x, entity.vertices[1].y);
      }
      // Add more entity types as needed (e.g., CIRCLE, ARC, etc.)
  });
console.log(graphics)
  app.stage.addChild(graphics);
}
</script>
<style scoped>
.dom{
  width: 1900px;
  height: 800px;
}
</style>
