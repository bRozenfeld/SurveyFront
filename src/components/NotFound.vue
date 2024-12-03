<script setup>

  const name = 'NotFound';

  console.log("allo");
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-9xl font-extrabold text-red-600">404</h1>
      <p class="text-2xl font-semibold text-gray-800 md:text-3xl">
        Oops! Page not found.
      </p>
      <p class="mt-4 text-gray-500">The page you’re looking for doesn’t exist.</p>
      <button
        @click="$router.push('/')"
        class="px-4 py-2 mt-6 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
      >
        Go Home
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
