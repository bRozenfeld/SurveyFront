<template>

  <div v-if="submitted" class="thank-you-message">
    <h1 class="text-2xl font-bold text-green-600">Thank you for your review!</h1>
    <p class="text-gray-700">We appreciate your feedback.</p>
  </div>

  <div v-else class="survey-container">
    <h1>{{survey.title}}</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">
      {{ error }}
      <button @click="fetchData" class="retry-button">Retry</button>
    </div>
    <div v-else class="survey-details">
      <ul class = "questions-list">
        <li v-for="(question, index) in survey.questions" :key="question.id" class="question-item">
          <p>{{ question.question }}</p>
          <div class="rating-container">
            <span
              v-for="star in 5"
              :key="star"
              :class="{ star: true, selected: star <= question.rate }"
              @click="rateQuestion(question.id, star)"
            >
              ★
            </span>
          </div>
        </li>
      </ul>
      <small>Created on: {{ new Date(survey.createdDate).toLocaleDateString() }}</small>
    </div>
    <div class="button-container">
      <button v-if="!error" @click="submitRatings" class="submit-button">Submit</button>
      <button @click="clearRatings" class="refresh-button">Refresh</button>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import { useRoute } from "vue-router";
import { watch } from 'vue';

const route = useRoute(); // Access the current route
const loading = ref(false); // Reactive variable to track loading state
const error = ref(null); // Reactive variable to track errors

const submitted = ref(false);

const port = 8091;
const base_url = `http://localhost:${port}/api/surveys`;

const question = reactive({
  id: null,
  question: "",
  rate: 0
})

const survey = reactive({
  createdDate: "2021-09-01T00:00:00.000Z",
  title: "",
  questions : []
});

// Function to fetch data from the API
const fetchData = async (link) => {
  console.log("fetching data " + link);
  loading.value = true;
  error.value = null; // Reset error state
  try {
    const response = await fetch(base_url + `/${link}`);
    if (!response.ok) {
      // throw new Error(`Error fetching data: ${response.statusText}`);
      // console.log(response.json());
      const errorData = await response.json();
      alert(`Error fetching data: ${errorData.message}`)
      return;
    }
    const fetchedData  = await response.json(); // Parse JSON data
    console.log(fetchedData);
    survey.createdDate = fetchedData.creationDate;
    survey.title = fetchedData.title;
    survey.questions = fetchedData.questions;
    console.log(survey);
  } catch (err) {
    error.value = err.message;
    alert(`Network Error: ${err.message}`)
    this.$router.push("/");
  } finally {
    loading.value = false;
  }
};

// Clear all ratings
const clearRatings = () => {
  // survey.questions.forEach(question => {
  //   question.rate = 0; // Reset all ratings to 0
  // });
  fetchData(route.params.link); // Refetch data to update the UI
};

const submitRatings = async () => {
  console.log("submitRatings() " + survey + " => " + JSON.stringify(survey));
  try {
    const response = await fetch(base_url + `/${route.params.link}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(survey)
    });
    if (!response.ok) {
      // throw new Error('Failed to submit ratings : ' + response.statusText);
      const errorData = await response.json();
      alert(`Error submitting data: ${errorData.message}`)
      return;
    }
    submitted.value = true; // Set submission state to true
    alert('Ratings submitted successfully!');
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
};

const rateQuestion = (questionId, rating) => {
  const question = survey.questions.find(q => q.id === questionId);
  if(question.rate === rating) question.rate = 0;
  else question.rate = rating;
};

// Watch for changes in the `link` parameter and fetch data
watch(
  () => route.params.link,
  (newLink) => {
    if (newLink) {
      fetchData(newLink);
    }
  },
  { immediate: true } // Trigger the watch on component mount
);

</script>

<style scoped>

.thank-you-message {
  text-align: center;
  margin-top: 2rem;
}

.survey-container {
  width: 1000px; /* Take 70% of the available width */
  max-width: 1200px; /* Optional: Limit max width for readability */
  background-color: #ffffff; /* Optional: Add background color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add subtle shadow */
  border-radius: 8px; /* Rounded corners */
  padding: 20px; /* Internal padding */
  box-sizing: border-box; /* Include padding in width calculations */
  margin: 0 auto; /* Center it horizontally */
  text-align: left; /* Align text to the left inside the container */
}

.survey-container h1 {
  text-align: center; /* Center the heading text */
  margin-bottom: 20px; /* Add spacing below the heading */
}

h1 {
  text-align: center;
  color: #333;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #555;
}

.error {
  color: red;
  text-align: center;
}

.survey-details {
  display: flex;
  flex-direction: column; /* Stack questions vertically */
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  gap: 20px; /* Add space between questions */
  text-align: center; /* Center-align text within questions */
}

.survey-item h2 {
  margin: 0;
  font-size: 1.2em;
  color: #007bff;
}

.survey-item p {
  margin: 10px 0;
  color: #555;
}

.survey-item small {
  display: block;
  color: #888;
}

.button-container {
  display: flex;
  justify-content: center; /* Center the buttons */
  gap: 20px; /* Space between the buttons */
  margin-top: 20px; /* Add space above the buttons */
}

.refresh-button,
.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.refresh-button {
  background-color: #f44336; /* Red for refresh */
  color: white;
}

.refresh-button:hover {
  background-color: #d32f2f;
}

.submit-button {
  background-color: #4caf50; /* Green for submit */
  color: white;
}

.submit-button:hover {
  background-color: #388e3c;
}

.rating-container {
  display: flex;
  justify-content: center; /* Center stars horizontally */
  gap: 5px; /* Space between stars */
  cursor: pointer;
}

.star {
  font-size: 24px;
  color: lightgray; /* Default star color */
  margin-right: 5px;
  transition: color 0.3s ease; /* Smooth transition for color change */
}

.star.selected {
  color: gold;
}
</style>

