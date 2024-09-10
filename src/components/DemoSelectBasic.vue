<script setup>
defineProps({
  label: String,
})

const items = [
  'Foo',
  'Bar',
  'Fizz',
  'Buzz',
]
</script>

<template>
  <AppSelect
    :items="items"
    :label="label"
    placeholder="Select Item"
  />
</template>
