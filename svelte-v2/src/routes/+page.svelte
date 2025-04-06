<script>
    let { data } = $props();
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
  
    const questions = data.questions || [];
    let showResults = $state(false);
    let categoryData = $state({});

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
      const ctx = document.getElementById('radar-chart').getContext('2d');
      const categories = Object.keys(categoryData);
      const values = Object.values(categoryData);
      
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Results by Category',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
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
    }

    function resetForm() {
      showResults = false;
      responses.name = "";
      responses.email = "";
      responses.answers = questions.map(q => ({
        id: q.id,
        question: q.question,
        category: q.category,
        chosen: null
      }));
    }
</script>
  
<h2>Venture Audit</h2>

{#if !showResults}
  <p>You have <b>{progress}</b> required fields unanswered</p>

  <form 
      method="POST" 
      use:enhance={({ formData }) => {
        isSubmitting = true;
        
        // 'formData' is what is used in +page.sever.js;
        // Add the entire responses object as JSON with key 'userData'
        formData.append('userData', JSON.stringify(responses));
        
        return async ({ result }) => {
          isSubmitting = false;
          if (result.type === 'success') {
              // Calculate and store category totals
              categoryData = calculateCategoryTotals(responses);
              showResults = true;
              
              // Render chart in next tick after DOM updates; otherwise will load without chart
              setTimeout(renderChart, 0);
          }
        };
      }}
  >
    <!-- Personal Info -->
    <div>
      <label for="name">Name:</label>
      <input id="name" name="name" type="text" bind:value={responses.name} required />
    </div>
    <div>
      <label for="email">Email:</label>
      <input id="email" name="email" type="email" bind:value={responses.email} required />
    </div>

    <!-- Questions -->
    {#each questions as q, idx}
        <div>
        <p>{idx + 1}) <b>Question:</b> {q.question}</p>
        <input type="hidden" name={`question_${idx}_id`} value={q.id}>
        {#if responses.answers[idx].chosen !== null}
            <p>You selected: <span class="text-green-600">{responses.answers[idx].chosen.text}</span>
            </p>
        {:else}
            <p class="text-red-500">Please select an answer</p>
        {/if}
        <fieldset id={q.id}>
            {#each q.answers as answer}
            <label>
                <input
                type="radio"
                name={`answer_${idx}`}
                bind:group={responses.answers[idx].chosen}
                value={answer}
                required
                />
                {answer.text}
            </label>
            <br>
            {/each}
        </fieldset>
        <br>
        </div>
    {/each}
    {#if progress == 0}
        <p>You can now submit!</p>
    {:else}
        <p>Submit button will not work until you finish answering the questions</p>
    {/if}
    <button type="submit" disabled={progress > 0 || isSubmitting} class="px-4 py-2 bg-blue-500 text-white rounded">
        {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
{:else}
  <!-- Results View with Chart -->
  <div class="results-container">
    <h3>Your Venture Audit Results</h3>
    
    <div class="chart-container" style="position: relative; height:60vh; width:80vw; margin: 0 auto;">
      <canvas id="radar-chart"></canvas>
    </div>
    
    <div class="results-summary">
      <h4>Category Breakdown</h4>
      <ul>
        {#each Object.entries(categoryData) as [category, score]}
          <li><strong>{category}:</strong> {score}</li>
        {/each}
      </ul>
    </div>
    
    <button 
      onclick={resetForm} 
      class="px-4 py-2 bg-blue-500 text-white rounded mt-4"
    >
      Take Assessment Again
    </button>
  </div>
{/if}