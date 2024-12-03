<script setup>
// Function to fetch data from the API

import {useRoute} from "vue-router";
import {reactive, ref, watch} from "vue";

const route = useRoute(); // Access the current route
const loading = ref(false); // Reactive variable to track loading state
const error = ref(null); // Reactive variable to track errors

const jsonData = reactive({
  title: "",
  results: []
}); // JSON data from the API

const port = 8091;
const base_url = `http://localhost:${port}/api/surveys`;


const fetchData = async (id) => {
  console.log("fetching data " + id);
  loading.value = true;
  error.value = null; // Reset error state
  try {
    const response = await fetch(base_url + `/${id}/results`);
    if (!response.ok) {
      // throw new Error(`Error fetching data: ${response.statusText}`);
      // console.log(response.json());
      const errorData = await response.json();
      alert(`Error fetching data: ${errorData.message}`)
      return;
    }
    const fetchData = await response.json(); // Parse JSON data
    console.log(fetchData);
    jsonData.value = fetchData;
  } catch (err) {
    error.value = err.message;
    alert(`Network Error: ${err.message}`)
  } finally {
    loading.value = false;
  }
};

// Watch for changes in the `link` parameter and fetch data
watch(
  () => route.params.id,
  (id) => {
    if (id) {
      fetchData(id);
    }
  },
  { immediate: true } // Trigger the watch on component mount
);

</script>

<template>
  <div>
    <h1>Survey Data</h1>
    <!-- Display JSON data -->
    <pre>{{ jsonData.value }}</pre>
  </div>
</template>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1rem;
  overflow-x: auto;
}
</style>
