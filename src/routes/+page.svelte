<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { addDot } from "$lib/utils";
  import { formatCurrency } from "$lib/utils";

  import Card from "../lib/Card.svelte";
  import Transaction from "../lib/Transaction.svelte";
  import Titlebar from "$lib/Titlebar.svelte";
  

  interface CardInfo {
    balance: number,
    cashbackType: string,
    creditLimit: number,
    currencyCode: number,
    iban: string,
    id: string,
    maskedPan: string[],
    sendId: string,
    type: string
  }
  
  interface Transaction {
    amount: number,
    balance: number,
    cashbackAmount: number,
    commisionRate: number,
    counterName: string,
    currencyCode: number,
    description: string,
    hold: boolean,
    id: string,
    mcc: number,
    operationAmount: number,
    originalMcc: number,
    time: number
  }


  let API: string = $state("");
  let cards: CardInfo[] = $state([]);
  let currCard: number = $state(0);
  let transes: Transaction[] = $state([]);
  let balance: number = $state(-1);
  let card: CardInfo = $state({} as CardInfo)


  let lastAPIfetch: number = 0;
  const API_LIMIT_TIME = 60 * 1000; 

  async function getClientInfo(): Promise<any> {
    const url = "https://api.monobank.ua/personal/client-info";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'X-Token': API,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          const waitMs = Math.max(0, API_LIMIT_TIME - (Date.now() - lastAPIfetch));
          console.log(`Превышен лимит. Повторный запрос через ${Math.ceil(waitMs / 1000)} секунд`);

          return new Promise((resolve) => {
            setTimeout(async () => {
              const data = await getClientInfo();
              resolve(data);
            }, waitMs);
          });
        }

        console.error("Ошибка API:", response.status);
        return null;
      } else {
        const data = await response.json();
        lastAPIfetch = Date.now();
        return data;
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
      return null;
    }
  }



  async function loadCards() {
    const clientInfo = await getClientInfo();

    if (clientInfo && clientInfo.accounts) {
      cards = clientInfo.accounts;
      card = cards[currCard];
      console.log("Карточки:", cards);
      balance = cards[currCard].balance;
    } else {
      console.error("Не вийшло :(");
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const from = now - 31 * 24 * 60 * 60;

  async function loadTrans(card: string) {
    const url = `https://api.monobank.ua/personal/statement/${card}/${from}/${now}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
          'X-Token': API,
          'Accept': 'application/json'
      }
    });

    const data = await response.json()
    transes = data;
  }

  $effect(() => {
    if (cards.length > 0) {
      loadTrans(cards[currCard].id);
      balance = cards[currCard].balance;
    }
  });


  function increment() {
    currCard = (currCard + 1) % cards.length;
    card = cards[currCard];
    console.log(card);
  }

  function decrement() {
    currCard = (currCard - 1 + cards.length) % cards.length;
    card = cards[currCard];
    console.log(card);
  }



  
</script>

<Titlebar/>

<img class="monocat" src="monobank_cat.png" alt="monocat">

<p style="position: absolute; top: 90%; left: 50%; color:white; opacity:0.5; transform:translate(-50%, -50%)">
  * Виклики до API обмежені 1 разом на 60 секунд. Тому інтерфейс може не грузитись (⋟﹏⋞)
</p>

<main class="body">
  <div class="card-info-div">
    <div class="api-div container">
      <a href="https://api.monobank.ua/index.html" aria-label="mono-api" target="_blank" rel="noopener noreferrer">
        <i class="fa-solid fa-circle-question"></i>
      </a>
      <input bind:value={API} type="password" placeholder="Уведіть API-ключ">
      <button onclick={loadCards}>Загрузити</button>
    </div>
  
    <div class="card-div container">
      {#if cards.length > 0}
        <button onclick={decrement} aria-label="Prev card"><i class="fa-solid fa-arrow-left"></i></button>
        {#key card}
          <Card card_info={card}/>
        {/key}
        <button onclick={increment} aria-label="Next card"><i class="fa-solid fa-arrow-right"></i></button>
      {:else}
        <p>Тут поки що нічого немає T_T</p>
      {/if}
    </div>
  
    {#if balance !== -1}
      <div class="balance-div container" transition:fly={{y: 20, duration: 500}}>
        <p><strong>Ваш баланс: </strong> {addDot(balance, String(formatCurrency(cards[currCard].currencyCode)))}</p>
      </div>
    {/if}  
  </div>

  {#if transes.length > 0}
    <div class="trans-div container" transition:fly={{y: 20, duration: 500}}>
      {#each transes as trans}
        <Transaction trans_info={trans}/>
      {/each}   
    </div>
  {/if}

</main>

<style>
  :root {
    height: 100%;
    background: linear-gradient(
      180deg,rgb(75, 67, 147) 0%, rgb(36, 14, 95)
    );
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 500;
    user-select: none;
  }


  .body {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 8px;
  }

  .monocat {
    position: fixed;
    bottom: 10px;
    right: 10px;
    height: 64px;
    width: 64px;
    z-index: 2;
  }


  .card-info-div {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .container {
    width: 400px;
    background: rgba(109, 104, 104, 0.442);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(224, 202, 202, 0.679);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
  }


  .api-div {
    padding-top: 40px;
    border-radius: 10px;
    flex-direction: column;
    gap: 5px;
  }

  .api-div input {
    padding: 7px;
    width: 90%;
    text-align: center;
    border-radius: 8px;
    border: 2px solid #ccc;
    background-color: #1c1a1a;
    color: #eae1e1;
    font-weight: 500;
    font-size: 15px;
    transition: all 0.3s ease;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .api-div input:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 8px rgba(108, 99, 255, 0.6);
    background-color: #191818;
  }

  .api-div input::placeholder {
    color: #888;
    font-size: 14px;
  }

  
  .api-div i{
    position: absolute;
    left: 10px;
    top: 10px;
    color: white;
    font-size: 25px;
    cursor: pointer;
    transition: 300ms ease;
  }

  .api-div i:hover {
    font-size: 27px;
  }

  .api-div button {
    padding: 7px 15px;
    background-color: #1c1a1a;
    font-family:Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 500;
    color: aliceblue;
    border: 2px solid #eae1e1;
    transition: 300ms ease;
    border-radius: 5px;
  }

  .api-div button:hover {
    scale: 1.1;
    border: 2px solid #6c63ff;
    transition: 300ms ease;
  }

  .card-div {
    gap: 10px;
    color: white;
  }

  .card-div button {
    padding: 10px;
    padding-top: 11px;
    font-size: 16px;
    height: 45px;
    width: 45px;
    border: 1px solid rgba(255, 255, 255, 0.494);
    color: rgb(24, 23, 23);
    background-color: rgb(243, 237, 237);
    border-radius: 7px;
    transition: 300ms ease;
  }

  .card-div button:hover {
    scale: 1.1;
    border: 1px solid rgba(255, 255, 255, 0.759);
    box-shadow: 0px 2px 12px rgba(234, 234, 240, 0.367);
  }

  .balance-div {
    color: rgb(240, 236, 236);
  }

  .trans-div {
    display: block;
    flex-direction: column;
    max-height: 420px;
    overflow-y: auto;
    border: 1px solid #ccc;
  }

  .trans-div::-webkit-scrollbar {
    display: none;
  }

  .trans-div.container {
    padding: 0px;
    width: 420px;
  }

  



</style>