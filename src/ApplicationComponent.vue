<template>
    <div>
        <component :is="component"></component>
    </div>
</template>

<script setup lang="ts">
import { inject } from "vue"
const component = inject("component")
</script>

<style lang="scss">
* {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

*:focus {
        outline: none;
}
</style>
