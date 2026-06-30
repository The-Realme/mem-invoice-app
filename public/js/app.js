const tableBody = document.querySelector("#itemsTable tbody");

const addButton = document.getElementById("addItem");

addButton.addEventListener("click", addRow);

function addRow(){

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>
        <input type="text" class="description">
    </td>

    <td>
        <input type="number" class="qty" value="1" min="1">
    </td>

    <td>
        <input type="number" class="rate" value="0" min="0">
    </td>

    <td class="amount">
        ₹0
    </td>
`;

    tableBody.appendChild(row);
    const qtyInput = row.querySelector(".qty");
const rateInput = row.querySelector(".rate");

qtyInput.addEventListener("input", calculateRow);
rateInput.addEventListener("input", calculateRow);

}

function calculateGrandTotal(){

    let total = 0;

    const amounts = document.querySelectorAll(".amount");

    amounts.forEach(amount =>{

        total += Number(amount.textContent.replace("₹",""));

    });

    document.getElementById("grandTotal").textContent = total;

}


function calculateRow(event){

    const row = event.target.closest("tr");

    const qty = Number(row.querySelector(".qty").value);

    const rate = Number(row.querySelector(".rate").value);

    const amount = qty * rate;

    row.querySelector(".amount").textContent = "₹" + amount;

    calculateGrandTotal();

}

const quotationForm = document.getElementById("quotationForm");

quotationForm.addEventListener("submit", async function(event){

    event.preventDefault();

    const items = [];

    document.querySelectorAll("#itemsTable tbody tr").forEach(row=>{

        items.push({

            description: row.querySelector(".description").value,

            quantity: row.querySelector(".qty").value,

            rate: row.querySelector(".rate").value,

            amount: row.querySelector(".amount").textContent.replace("₹","")

        });

    });

    document.getElementById("itemsData").value = JSON.stringify(items);

    const formData = new URLSearchParams(
    new FormData(quotationForm)
);

const response = await fetch("/quotation", {

    method: "POST",

    headers: {

        "Content-Type": "application/x-www-form-urlencoded"

    },

    body: formData

});

    const result = await response.json();

    if(result.success){

        window.location.href =
        `/pdf/quotation/${result.documentId}`;

    }

    else{

        alert(result.message);

    }

});