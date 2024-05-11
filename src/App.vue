<!--App.vue 关键就是引入子组件的，弄到根组件上面，
    其实本质就是组件嵌套组件的形式，这个子组件也可以嵌套pages内的组件，都会在根组件显示
-->
<script setup lang="ts">
import BasicLayout from './layouts/BasicLayout.vue';
</script>

<template>

  <BasicLayout />

</template>

<style scoped>

</style>
