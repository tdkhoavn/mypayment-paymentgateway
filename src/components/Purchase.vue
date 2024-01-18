<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form @submit.prevent="submitForm" class="w-full max-w-md mt-5 bg-white rounded shadow-lg p-5">
        <h1 class="text-2xl font-heading mb-5 text-center">mypayment | Payment Gateway</h1>
        <div v-if="error_message" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">{{ error_message }}</span>
        </div>
        <div v-if="message" class="mb-4 bg-red-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Success!</strong>
            <span class="block sm:inline">{{ message }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="inquiry_no">
            Inquiry No
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed" id="inquiry_no" type="text" v-model="inquiry_no" readonly>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="torihiki_detail">
            Torihiki Detail
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed" id="torihiki_detail" type="text" v-model="torihiki_detail" readonly>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="torihiki_amount">
            Torihiki Amount
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed" id="torihiki_amount" type="number" v-model="torihiki_amount" readonly>
        </div>
        <!-- <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="full_name">
            Full Name
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="full_name" type="text" v-model="full_name">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email"
          v-model="email">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
            Phone
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="tel"
          v-model="phone">
        </div> -->
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="loading">
            <span v-if="loading" class="animate-spin mr-3">
                <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </span>
            Purchase
          </button>
        </div>
      </form>
    </div>
  </template>

  <script lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'

  export default {
    setup() {
      const inquiry_no = ref<string | null>(null);
      const torihiki_detail = ref<string | null>(null);
      const torihiki_amount = ref<number | null>(null);
      // const full_name = ref<string | null>(null)
      // const email = ref<string | null>(null)
      // const phone = ref<string | null>(null)

      const loading = ref(false)
      const message = ref<string | null>(null)
      const error_message = ref<string | null>(null)

      const route = useRoute()

      const fetchData = () => {
        const key = route.params.key
        axios.get(`https://mypayment-mocking-api.tdkhoa.dev/api/v1/billing/info/${key}`).then((response: any) => {
          inquiry_no.value = response.data.inquiry_no
          torihiki_detail.value = response.data.torihiki_detail
          torihiki_amount.value = response.data.torihiki_amount
        })
        .catch((error: any) => {
          console.log(error)
          error_message.value = "Fetch data error"
        })
      }

      onMounted(fetchData)

      const submitForm = () => {
        loading.value = true
        // Prepare the data
        const data = {
          inquiry_no: inquiry_no.value,
          torihiki_detail: torihiki_detail.value,
          torihiki_amount: torihiki_amount.value,
          rcpdate: new Date().toISOString().slice(0, 10), // YYYYMMDDHHMM
          cvscode: '133DBT',
          cvsname: 'Cybridge Combini',
          stocode: "CBA"
        }

        // Send a POST request
        axios.post('https://mypayment-mocking-api.tdkhoa.dev/api/v1/purchase', data)
          .then((response: any) => {
            // Handle success
            message.value = response.data.message
            loading.value = false
          })
          .catch((error: any) => {
            // Handle error
            error_message.value = error.response.data.detail.message
            loading.value = false
          })
      }

      return {
        inquiry_no,
        torihiki_detail,
        torihiki_amount,
        // full_name,
        // email,
        // phone,
        loading,
        message,
        error_message,
        submitForm,
      }
    },
  }
  </script>