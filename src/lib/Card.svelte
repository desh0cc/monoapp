<script lang="ts">
    import { onMount } from "svelte";

    export let card_info: {
        balance: number,
        cashbackType: string,
        creditLimit: number,
        currencyCode: number,
        iban: string,
        id: string,
        maskedPan: string[],
        sendId: string,
        type: string
    };

    const card_num = card_info.maskedPan[0]

    function addSpaces(stringi: string) {
        let res = "";
        let count:number = 1;

        for (let i = 0; i < stringi.length; i++) {
            if (count === 4) {
                res += stringi[i] + " ";
                count = 1;
            } else {
                res += stringi[i];
                count += 1;
            }

        }

        return res
    }

    let cardEl: HTMLDivElement;
    let cardNum: HTMLElement;
    let visaLogo: HTMLElement;
    let monologo: HTMLElement;

    onMount(() => {
        if (card_info.type === "black") {
            cardEl.style.background = "linear-gradient(180deg, rgb(57, 55, 55) 0%, rgb(28, 27, 27) 100%)";
            cardNum.style.color = "azure";
            visaLogo.style.filter = "brightness(100)";
            monologo.style.color = "azure";
        } else {
            cardEl.style.background = "linear-gradient(180deg, rgb(232, 227, 227) 0%, rgb(139, 129, 129) 100%)";
            cardNum.style.color = "black";
            visaLogo.style.filter = "brightness(0.1)";
            monologo.style.color = "black";
        }
    });


</script>


<div bind:this={cardEl} class="card">
    <p bind:this={monologo} class="mono">monobank</p>
    <p bind:this={cardNum} class="card-number">{addSpaces(card_num)}</p>
    <img bind:this={visaLogo} class="visa" src="/visa.svg" alt="Visa" />
</div>

<style>
    .card {
        width: 300px;
        height: 180px;
        border-radius: 15px;
        background: linear-gradient(180deg,
            rgb(232, 227, 227) 0%, rgb(139, 129, 129) 100%
        );
        box-shadow: 0px 7px 10px rgba(0, 0, 0, 0.53);
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }

    .card-number {
        color: aliceblue;
        text-align: center;
        font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        letter-spacing: 3px;
        font-size: 23px;
        word-spacing: 5px;
    }

    .mono {
        position: absolute;
        top: -5px;
        left: 15px;
        font-weight: bold;
        color: azure;
    }

    .visa {
        fill: rgb(23, 21, 21);
        width: 50px;
        height: 30px;
        filter: brightness(0.1);
        position: absolute;
        color: rgb(30, 29, 29);
        right: 15px;
        bottom: 10px;
    }

</style>