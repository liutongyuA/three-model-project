<template>

<el-table :data="tableData" style="width: 100%" ref="tableRef" id="table">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
</el-table>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const props = defineProps<{
    tableData: any
  }>()
</script>

<style scoped>

</style>