const tableBody = document.querySelector("#itemsTable tbody");

const addButton = document.getElementById("addItem");

addButton.addEventListener("click", addRow);

// ================= ADD ROW =================

function addRow() {

    const row = document.createElement("tr");

    row.innerHTML = `

<td>

<input
type="text"
class="description">

</td>

<td>

<input
type="text"
class="hsn">

</td>

<td>

<input
type="number"
class="qty"
value="1"
min="1">

</td>

<td>

<input
type="number"
class="rate"
value="0"
min="0">

</td>

<td>

<input
type="number"
class="gst"
value="18"
min="0">

</td>

<td class="amount">

₹0

</td>

`;

    tableBody.appendChild(row);

    row.querySelector(".qty")
        .addEventListener("input", calculateRow);

    row.querySelector(".rate")
        .addEventListener("input", calculateRow);

    row.querySelector(".gst")
        .addEventListener("input", calculateRow);

}

// ================= CALCULATE ROW =================

function calculateRow(event) {

    const row = event.target.closest("tr");

    const qty =
        Number(row.querySelector(".qty").value);

    const rate =
        Number(row.querySelector(".rate").value);

    const amount =
        qty * rate;

    row.querySelector(".amount").textContent =
        "₹" + amount.toFixed(2);

    calculateGrandTotal();

}

// ================= GRAND TOTAL =================

function calculateGrandTotal() {

    let total = 0;

    document.querySelectorAll(".amount")
        .forEach(amount => {

            total += Number(

                amount.textContent.replace("₹", "")

            );

        });

    document.getElementById("grandTotal")
        .textContent = total.toFixed(2);

}

// ================= FORM =================

const invoiceForm = document.getElementById("invoiceForm");

invoiceForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const items = [];

//     document.querySelectorAll("#itemsTable tbody tr")
//         .forEach(row => {

            
//             description: row.querySelector(".description").value,
//             //     if(description.trim() === "") {
//                 //     return;
//                 // }
//                 items.push({

//             hsn: row.querySelector(".hsn").value,

//                 quantity: row.querySelector(".qty").value,

//                     rate: row.querySelector(".rate").value,

//                         gst: row.querySelector(".gst").value,

//                             amount: row.querySelector(".amount")
//                                 .textContent
//                                 .replace("₹", "")

//         });

// });


document.querySelectorAll("#itemsTable tbody tr").forEach(row => {

    const description = row.querySelector(".description").value;

    if (description.trim() === "") {
        return;      // Skip empty row
    }

    items.push({

        description: description,

        quantity: row.querySelector(".qty").value,

        rate: row.querySelector(".rate").value,

        amount: row.querySelector(".amount").textContent.replace("₹","")

    });

});


document.getElementById("itemsData").value =
    JSON.stringify(items);

const formData = new URLSearchParams(
    new FormData(invoiceForm)
);

const response = await fetch("/invoice", {

    method: "POST",

    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },

    body: formData

});

const result = await response.json();

if (result.success) {

    window.location.href =
        `/pdf/invoice/${result.documentId}`;

}
else {

    alert(result.message);

}

});
