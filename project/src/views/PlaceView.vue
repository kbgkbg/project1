<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <main>
    <h1>상세 페이지</h1>
    <p>선택된 장소 id: {{ route.params.id }}</p>
  </main>
</template>