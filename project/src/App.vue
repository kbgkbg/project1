<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">홈</RouterLink> |
      <RouterLink to="/pick">뽑기</RouterLink> |
      <RouterLink to="/place/1">상세</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>