<script>

    let { data } = $props();

    const questions = data.questions || [];


  
    // Personal info plus answers
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
  
    // If name or email is empty, count them as pending.
    let progress = $derived.by(() => {
      let count = responses.answers.filter(r => r.chosen === null).length;
      if (responses.name === "") count++;
      if (responses.email === "") count++;
      return count;
    });
  </script>
  
  
  <h2>Venture Audit</h2>
  <p>You have <b>{progress}</b> required fields unanswered</p>
  <form method="POST">
    <!-- Personal Info -->
    <div>
      <label for="name">Name:</label>
      <input id="name" type="text" bind:value={responses.name} required />
    </div>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="email" bind:value={responses.email} required />
    </div>
  
    <!-- Questions -->
    {#each questions as q, idx}
      <div>
        <p>{idx + 1}) <b>Question:</b> {q.question}</p>
        {#if responses.answers[idx].chosen !== null}
          <p>You selected: <span class="text-green-600">{responses.answers[idx].chosen}</span></p>
        {:else}
          <p class="text-red-500">Please select an answer</p>
        {/if}
        <fieldset id={q.id}>
          {#each q.answers as answer}
            <label>
              <input
                type="radio"
                bind:group={responses.answers[idx].chosen}
                value={answer.text}
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
    <button type="submit" disabled={progress > 0}>Submit</button>
  </form>

<footer>
    <br>
</footer>
  