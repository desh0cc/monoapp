<script lang="ts">
    import { onMount } from 'svelte';
    import { formatCurrency } from './utils';
    import { addDot } from './utils'

    export let trans_info: {
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

    const currency = formatCurrency(trans_info.currencyCode);
    const desc = trans_info.description;
    const amount = addDot(trans_info.amount, String(currency));

    let amountEl: HTMLParagraphElement;

    onMount(() => {
        if (amountEl.innerText[0] === "-") {
            amountEl.style.color = "salmon";
        } else {
            amountEl.style.color = "rgb(153, 203, 79)";
        }
    });

</script>

<div class="trans">
    <p class="desc">{desc}</p>
    <p bind:this={amountEl} class="amount">{amount}</p>
</div>

<style>
    .trans {
        width: 100%;
        height: 70px;
        background-color: rgb(27, 25, 25);
        color: white;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: 300ms ease;
        border-top: 2px solid rgba(87, 81, 81, 0.235);
    }

    .desc {
        margin-left: 20px;
    }

    .amount {
        margin-right: 20px;
    }
    
</style>