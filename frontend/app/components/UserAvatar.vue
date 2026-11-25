<script setup lang="ts">
// A round profile picture. Not every Google account shares one, so the first letter of the name stands in.
defineProps<{ name: string, avatarUrl?: string }>()
</script>

<template>
  <img v-if="avatarUrl" :src="avatarUrl" :alt="name" :title="name" referrerpolicy="no-referrer" class="size-8 rounded-full ring-2 ring-white">
  <span v-else :title="name" class="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium uppercase ring-2 ring-white">
    {{ name.charAt(0) }}
  </span>
</template>
