<script>
    import Chart from 'chart.js/auto';
    let { data } = $props();
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { fade, fly, scale, slide } from 'svelte/transition';
  
    const questions = data.questions || [];
    let showResults = $state(false);
    let categoryData = $state({});
    let chartRendered = $state(false);

    let responses = $state({
      name: "",
      email: "",
      answers: questions.map(q => ({
        id: q.id,
        question: q.question,
        category: q.category,
        chosen: null
      }))
    });
  
    let progress = $derived.by(() => {
      let count = responses.answers.filter(r => r.chosen === null).length;
      if (responses.name === "") count++;
      if (responses.email === "") count++;
      return count;
    });
    
    let isSubmitting = $state(false);

    function calculateCategoryTotals(responses) {
      const categoryTotals = {};
      
      // Get all unique categories
      const allCategories = [...new Set(responses.answers.map(answer => answer.category))];
      allCategories.forEach(category => {
        categoryTotals[category] = 0;
      });
      
      // Sum up weights for each category
      responses.answers.forEach(answer => {
        if (answer.chosen) {
          categoryTotals[answer.category] += answer.chosen.weight;
        }
      });
      
      return categoryTotals;
    }

    // Create the chart
    function renderChart() {
      if (!showResults || chartRendered) return;
      
      const ctx = document.getElementById('radar-chart');
      if (!ctx) {
        console.error('Chart canvas element not found');
        return;
      }
      
      const categories = Object.keys(categoryData);
      const values = Object.values(categoryData);
      
      try {
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: categories,
            datasets: [{
              label: 'Results by Category',
              data: values,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 1)',
              pointBackgroundColor: 'rgba(59, 130, 246, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
            }]
          },
          options: {
            responsive: true,
            scales: {
              r: {
                beginAtZero: true
              }
            }
          }
        });
        chartRendered = true;
      } catch (error) {
        console.error('Error rendering chart:', error);
      }
    }

    function resetForm() {
      showResults = false;
      chartRendered = false;
      responses.name = "";
      responses.email = "";
      responses.answers = questions.map(q => ({
        id: q.id,
        question: q.question,
        category: q.category,
        chosen: null
      }));
    }
    
    // Use effect to ensure DOM is ready when rendering chart
    $effect(() => {
      if (showResults) {
        setTimeout(renderChart, 400); // Short delay to ensure DOM is ready
      }
    });
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="px-6 py-8">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Venture Audit</h1>

        {#if !showResults}
        <div in:fade={{ duration: 300 }}>
          <div class="mb-6 bg-blue-50 p-4 rounded-lg flex items-center justify-between">
            <p>
              <span class="font-medium">Progress:</span> 
              <span class={progress === 0 ? "text-green-600 font-bold" : "text-blue-600"}>
                {progress} {progress === 1 ? 'field' : 'fields'} remaining
              </span>
            </p>
            <div class="w-24 bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full" style="width: {Math.max(0, 100 - (progress * 100 / (questions.length + 2)))}%"></div>
            </div>
          </div>

          <form 
              method="POST" 
              use:enhance={({ formData }) => {
                isSubmitting = true;
                formData.append('userData', JSON.stringify(responses));
                
                return async ({ result }) => {
                  isSubmitting = false;
                  if (result.type === 'success') {
                      categoryData = calculateCategoryTotals(responses);
                      showResults = true;
                      setTimeout(renderChart, 0);
                  }
                };
              }}
              class="space-y-8"
          >
            <!-- Personal Info -->
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-4">
              <h2 class="text-xl font-medium text-gray-700 mb-4">Your Information</h2>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                  <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    bind:value={responses.name} 
                    required 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    bind:value={responses.email} 
                    required 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>

            <!-- Questions -->
            {#each questions as q, idx}
              <div 
                in:slide={{ delay: 100 + idx * 50, duration: 300 }} 
                class="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
              >
                <input type="hidden" name={`question_${idx}_id`} value={q.id}>
                <p class="text-lg font-medium text-gray-800 mb-3">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">{idx + 1}</span> 
                  {q.question}
                </p>
                
                {#if responses.answers[idx].chosen !== null}
                  <p class="mb-4 text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Selected: {responses.answers[idx].chosen.text}
                  </p>
                {:else}
                  <p class="mb-4 text-red-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Please select an answer
                  </p>
                {/if}
                
                <fieldset id={q.id} class="space-y-2">
                  {#each q.answers as answer}
                    <label class="flex items-start p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={`answer_${idx}`}
                        bind:group={responses.answers[idx].chosen}
                        value={answer}
                        required
                        class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span class="ml-3">{answer.text}</span>
                    </label>
                  {/each}
                </fieldset>
              </div>
            {/each}
            
            <div class="mt-8 flex justify-center">
              {#if progress === 0}
                <div in:scale={{ duration: 200 }} class="text-center">
                  <p class="text-green-600 mb-4">All questions answered! You can now submit.</p>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                  </button>
                </div>
              {:else}
                <button 
                  type="submit" 
                  disabled={true} 
                  class="px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed opacity-50"
                >
                  Please Answer All Questions
                </button>
              {/if}
            </div>
          </form>
        </div>
        {:else}
        <!-- Results View with Chart -->
        <div in:fly={{ y: 20, duration: 500 }} class="results-container">
          <h3 class="text-2xl font-bold text-center text-gray-800 mb-6">Your Venture Audit Results</h3>
          
          <div class="chart-container bg-white rounded-xl shadow-md p-6 mb-8" style="position: relative; height:50vh; width:100%; margin: 0 auto;">
            <canvas id="radar-chart"></canvas>
          </div>
          
          <div class="results-summary bg-blue-50 rounded-lg p-6 shadow-sm">
            <h4 class="text-xl font-medium text-gray-700 mb-4">Category Breakdown</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each Object.entries(categoryData) as [category, score]}
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p class="text-gray-800"><span class="font-medium">{category}:</span> {score}</p> 
                </div>
              {/each}
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <button 
              onclick={resetForm}
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Take Assessment Again
            </button>
          </div>
        </div>
        {/if}
    </div>
  </div>
</div>