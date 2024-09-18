<script setup>
defineProps({
  label: String,
  items: Array,
})
</script>

<template>
  <AppSelect
    :items="items"
    :label="label"
    placeholder="Select Item"
  />
</template>
