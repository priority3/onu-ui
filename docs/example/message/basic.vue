<script lang="ts" setup>
import { OMessage as message } from 'onu-ui'
const open = () => {
  message('This is a message')
}
</script>

<template>
  <o-button @click="open">
    Show Message
  </o-button>
</template>
