<template>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="布点模型" name="1">
        <three-loader v-if="activeName == 1"/>
      </el-tab-pane>
      <el-tab-pane label="Config" name="2">Config</el-tab-pane>
      <el-tab-pane label="Role" name="3">Role</el-tab-pane>
      <el-tab-pane label="Task" name="4">Task</el-tab-pane>
    </el-tabs>
    <!-- <three /> -->
   
    <!-- <three-loader-fbx /> -->
    <!-- 圣诞卡 -->
    <!-- <poject /> -->
</template>

<script lang="ts" setup>
import Three from "./components/Three.vue"
import ThreeLoader from "./components/ThreeLoader.vue"
import ThreeLoaderFbx from "./components/ThreeLoaderFbx.vue"
import poject from "./components/poject.vue"
import { ref } from "vue"
const activeName = ref("1")
</script>
<style>
.table-warp{
  width: 1920px;
  height: 1080px;
  border: 1px solid #bfa;
  margin: auto;
  overflow: auto;
}

.table-hover{

}

</style>
