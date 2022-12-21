let language = "en";
let interestRate,
  time,
  answer,
  downpayment,
  amortization,
  totalMonths,
  amorPower,
  principal,
  selection,
  totalPrice,
  totalInterest;
let monthArray = [];
let monthlyInterest = [];
let monthlyPrincipal = [];
let monthlyNewPrincipal = [];
let monthlyAmortization = [];
let formerPrincipal = [];
let newPrincipal = [];
let principalArray = [];

const currencyFr = "fr-CA";
const currencyEn = "en-CA";

// FIELDS & SLIDERS
const principalField = document.getElementById("principalField");
const downpaymentField = document.getElementById("downpaymentField");
const interestField = document.getElementById("interestField");
const timeField = document.getElementById("timeField");
const principalSlider = document.getElementById("principalSlider");
const downpaymentSlider = document.getElementById("downpaymentSlider");
const interestSlider = document.getElementById("interestSlider");
const timeSlider = document.getElementById("timeSlider");
const interestElement = document.getElementById("interestElement");
const pieElement = document.getElementById("pieElement");
const calculationsField = document.getElementById("calculations");

$('[lang="fr"]').hide();
language = "en";

function numOnly(str) {
  let res = str.replace(/\D/g, "");
  return Number(res);
}

function principalFunction(val) {
  currencyFormatter();

  principalField.value = formatter.format(val);
  principal = Number(val);

  if (Number(downpayment) > Number(principal)) {
    principalField.value = formatter.format(downpayment);
    principal = downpayment;
    downpaymentAlert();
  }
  calculation();
}

function downpaymentAlert() {
  if (language == "fr") {
    alert(
      "La mise de fonds doit être inférieur au coût de votre voiure moins la mise de fonds."
    );
  } else {
    alert("Your downpayment must be less than the value of your car.");
  }
}

function downpaymentFunction(val) {
  currencyFormatter();
  downpaymentField.value = formatter.format(val);
  downpayment = val;
  if (Number(downpayment) > Number(principal)) {
    downpaymentField.value = formatter.format(principal);
    downpayment = principal;
    downpaymentAlert();
  }
  calculation();
}

function interestFunction(val) {
  interestField.value = val + "%";
  interestRate = val / 100;

  calculation();
}

function timeFunction(val) {
  timeField.value = Number(val);
  time = Number(val);
  calculation();
}

// Graphing functions and variables

function addData(chart, dataset, data) {
  chart.data.datasets[dataset].push({
    data: data,
    barThickness: 200,
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

const colors = [
  "rgba(0, 102, 231, 0.7)",
  "rgba(255, 205, 86, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(201, 203, 207, 0.8)",
];

Chart.defaults.plugins.legend.position = "bottom";

let interestChart = null;
let pieChart = null;

// MAIN FUNCTION

function calculation() {
  monthArray = [];
  monthlyInterest = [];
  monthlyPrincipal = [];
  monthlyNewPrincipal = [];
  monthlyAmortization = [];

  totalMonths = time * 12;
  totalInterest = 0;

  amorPower = (1 + interestRate / 12) ** totalMonths;
  amortization =
    ((principal - downpayment) * (interestRate / 12) * amorPower) /
    (amorPower - 1);

  document.getElementById("amortizationTotal").innerHTML = `${formatter.format(
    amortization
  )}`;

  // Month 0

  monthArray.push(0);
  monthlyAmortization.push(0);
  monthlyInterest.push(0);
  monthlyPrincipal.push(principal - downpayment);
  monthlyNewPrincipal.push(principal - downpayment);

  // After month 1
  for (let i = 1; i < totalMonths + 1; i++) {
    monthArray.push(i);
    monthlyAmortization.push(amortization);
    monthlyPrincipal.push(monthlyNewPrincipal[i - 1]);
    monthlyInterest.push((interestRate / 12) * monthlyPrincipal[i]);
    monthlyNewPrincipal.push(
      monthlyPrincipal[i] + monthlyInterest[i] - amortization
    );
    totalInterest += monthlyInterest[i];
  }

  totalPrice = principal + totalInterest;

  document.getElementsByName("totalPrice")[0].innerHTML = `${formatter.format(
    totalPrice
  )}`;

  for (let i = 0; i < 2; i++) {
    document.getElementsByName("totalInterest")[
      i
    ].innerHTML = `${formatter.format(totalInterest)}`;
  }

  currencyFormatter();
  if (
    principal != undefined &&
    interestRate != undefined &&
    time != undefined &&
    downpayment != undefined
  ) {
    if (language == "fr") {
      calculationsField.innerHTML = `
      Étape 1: Utiliser la formule d'amortissement <br><br>
     $$A = {P (1 + r)^{n} \\over (1 + r)^{n} - 1} $$ <br> $$\\textrm{"A" représente l'amortissement ou les paiements mensuels} $$$$\\textrm{"P" représente le coût de l'auto} $$ $$\\textrm{"r" représente le taux d'intérêt mensuel} $$ $$\\textrm{"n" représente la période d'amortissement en mois} $$
     <br><br> Étape 2: Calculer le taux d'intérêt mensuel (r)<br><br>
  $$r = {\\textrm{Taux d'intérêt annuel} \\over 12} = {${interestRate} \\over 12} = {${parseFloat(
        interestRate / 12
      ).toFixed(
        5
      )}} $$  <br><br> Étape 3: Calculer la période d'amortissement en mois <br><br> 
  $$\\textrm{Nombre de mois (n)} = ${time}\\textrm{ ans} * 12 = ${
        time * 12
      }\\textrm{ mois} $$ <br><br> Étape 4: Entrer les variables dans la formule <br><br> $$A = ${formatter.format(
        principal - downpayment
      )} { (1 + ${parseFloat(interestRate / 12).toFixed(
        5
      )})^{${totalMonths}} \\over (1 + ${parseFloat(interestRate / 12).toFixed(
        5
      )})^{${totalMonths}} - 1} $$<br><br> Étape 5: Résoudre <br><br> $$A={${formatter.format(
        amortization
      )}}\\textrm { mensuellement}$$
    `;
    } else {
      calculationsField.innerHTML = `
      Step 1: Use the amortization formula <br><br>
     $$A = {P (1 + r)^{n} \\over (1 + r)^{n} - 1} $$ <br> $$\\textrm{"A" is amortization or monthly payments} $$$$\\textrm{"P" is the cost of car minus downpayment} $$ $$\\textrm{"r" is the monthly interest} $$ $$\\textrm{"n" is the total number of months} $$
     <br><br> Step 2: Calculate monthly interest (r)<br><br>
  $$r = {\\textrm{Annual Interest} \\over 12} = {${interestRate} \\over 12} = {${parseFloat(
        interestRate / 12
      ).toFixed(
        5
      )}} $$  <br><br> Step 3: Calculate total number of months <br><br> 
  $$\\textrm{Number of months (n)} = ${time}\\textrm{ years} * 12 = ${
        time * 12
      }\\textrm{ months} $$ <br><br> Step 4: Input variables in formula <br><br> $$A = ${formatter.format(
        principal - downpayment
      )} { (1 + ${parseFloat(interestRate / 12).toFixed(
        5
      )})^{${totalMonths}} \\over (1 + ${parseFloat(interestRate / 12).toFixed(
        5
      )})^{${totalMonths}} - 1} $$<br><br> Step 5: Solve <br><br> $$A={${formatter.format(
        amortization
      )}}\\textrm { per month}$$
    `;
    }
    MathJax.typeset();

    graphing();

    createTable();
  }
}

// Event listeners for input fields
interestField.addEventListener("blur", userInputFunction);
downpaymentField.addEventListener("blur", userInputFunction);

principalField.addEventListener("blur", userInputFunction);
timeField.addEventListener("blur", userInputFunction);

function userInputFunction() {
  currencyFormatter();
  principalField.value = formatter.format(numOnly(principalField.value));
  downpaymentField.value = formatter.format(numOnly(downpaymentField.value));
  principalSlider.value = numOnly(principalField.value);
  downpaymentSlider.value = numOnly(downpaymentField.value);
  principal = numOnly(principalField.value);
  downpayment = numOnly(downpaymentField.value);
  interestSlider.value = parseFloat(interestField.value);
  interestRate = parseFloat(interestSlider.value) / 100;

  if (
    parseFloat(interestField.value) < 0 ||
    numOnly(principalField.value) < 0
  ) {
    if (language == "fr") {
      alert(
        "Cette calculatrice accepte uniquement les taux d'intérêt positifs. Les valeurs négatives existent dans la vie réelle."
      );
    } else {
      alert(
        "This calculator only accepts positive interest rate values. Please note that negative values can exist."
      );
    }
  }

  if (!interestField.value.includes("%")) {
    interestField.value += "%";
  }

  timeSlider.value = timeField.value;
  time = timeField.value;
  calculation();
}

document.body.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && parseFloat(interestField.value) > 0) {
    userInputFunction();
  }
});

function formatAsPercent(num) {
  return new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

function currencyFormatter() {
  let currency;
  if (language == "fr") {
    currency = currencyFr;
  } else {
    currency = currencyEn;
  }
  formatter = new Intl.NumberFormat(currency, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return formatter;
}

const languageButton = document.getElementById("languageButton");
languageButton.innerHTML = `<i class="fa-solid fa-earth-americas"></i> FR`;
languageButton.addEventListener("click", function () {
  $('[lang="fr"]').toggle();
  $('[lang="en"]').toggle();

  if (language == "en") {
    language = "fr";
    languageButton.innerHTML = `<i class="fa-solid fa-earth-americas"></i> EN`;

    setPopovers();
  } else if (language == "fr") {
    language = "en";
    languageButton.innerHTML = `<i class="fa-solid fa-earth-americas"></i> FR`;

    setPopovers();
  }

  currencyFormatter();
  if (principal != null) {
    principalField.value = formatter.format(parseFloat(principal));
  } else {
    principalField.value = formatter.format(0);
  }

  if (downpayment != null) {
    downpaymentField.value = formatter.format(parseFloat(downpayment));
  } else {
    downpaymentField.value = formatter.format(0);
  }

  calculation();
});

// Input fields for money

$("input[data-type='currency']").on({
  keyup: function () {
    formatCurrency($(this));
  },
  blur: function () {
    formatCurrency($(this), "blur");
  },
});

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") {
    return;
  }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    if (language == "fr") {
      input_val = left_side + "." + right_side + "$";
    } else {
      input_val = "$" + left_side + "." + right_side;
    }
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    if (language == "fr") {
      input_val = input_val + "$";
    } else {
      input_val = "$" + input_val;
    }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}

function labelMaker(word) {
  if (language == "fr") {
    if (word == "Month") {
      label = "Mois";
    }
    if (word == "Months") {
      label = "Mois";
    }
    if (word == "Principal") {
      label = "Capital";
    }
    if (word == "Interest") {
      label = "Intérêts";
    }
    if (word == "year") {
      label = "an";
    }
    if (word == "years") {
      label = "ans";
    }
    if (word == "Year") {
      label = "année";
    }
    if (word == "Years") {
      label = "Années";
    }
    if (word == "Remaining") {
      label = "Montant restant";
    }
  } else {
    label = word;
  }
  return label;
}

function graphing() {
  // Interest and payment chart
  const data = {
    labels: monthArray,
    datasets: [
      {
        label: labelMaker("Principal"),
        data: monthlyNewPrincipal,
        backgroundColor: colors[0],
      },
      {
        label: labelMaker("Interest"),
        data: monthlyInterest,
        backgroundColor: colors[1],
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      interaction: {
        mode: "index",
      },
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: `${labelMaker("Months")}` },
          stacked: true,
        },
        y: {
          min: 0,
          beginAtZero: true,
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              return formatter.format(value);
            },
          },
          stacked: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          boxPadding: 4,

          callbacks: {
            title: function (chart) {
              var item = chart[0].dataIndex;
              return `${labelMaker("Month")} ${item}`;
            },

            label: function (context) {
              let label = context.dataset.label || "";

              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += formatter.format(context.parsed.y);
              }
              return label;
            },
            footer: function (tooltipItems) {
              let sum = 0;

              tooltipItems.forEach(function (tooltipItem) {
                sum += tooltipItem.parsed.y;
              });
              return `${labelMaker("Remaining")}: ${formatter.format(sum)}`;
            },
          },
        },

        title: {
          display: false,
          padding: 20,
          text: "test",
        },
      },
    },
  };

  if (interestChart != null) {
    interestChart.destroy();
  }
  interestChart = new Chart(interestElement, config);
  interestChart.update();

  // Pie Chart
  const pieData = {
    labels: [`${labelMaker("Principal")}`, `${labelMaker("Interest")}`],
    datasets: [
      {
        data: [principal, totalInterest],
        backgroundColor: [colors[0], colors[1]],
        hoverOffset: 4,
      },
    ],
  };
  const pieConfig = {
    type: "pie",
    data: pieData,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return " " + formatter.format(context.parsed);
            },
          },
        },
      },
    },
  };

  if (pieChart != null) {
    pieChart.destroy();
  }
  pieChart = new Chart(pieElement, pieConfig);
  pieChart.update();

  Chart.defaults.font.size = 16;
  Chart.defaults.font.lineHeight = 1.5;
}

// On startup
MathJax.typeset();
userInputFunction();

// Table functionality
function createTable() {
  var tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  for (let i = 0; i < monthArray.length; i++) {
    var row = tableBody.insertRow(-1);
    row.setAttribute("id", `row${i}`);
    var cell1 = document.createElement("th");
    document.getElementById(`row${i}`).appendChild(cell1);
    cell1.setAttribute("scope", "row");
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = monthArray[i];
    cell2.innerHTML = formatter.format(monthlyPrincipal[i]);
    cell3.innerHTML = formatter.format(monthlyInterest[i]);
    cell4.innerHTML = `-${formatter.format(monthlyAmortization[i])}`;
    cell5.innerHTML = formatter.format(monthlyNewPrincipal[i]);
  }
}

// POPOVERS
function createPopover(eName, titleContent, bodyContent) {
  const e = document.getElementsByName(eName);
  for (let i = 0; i < e.length; i++) {
    e[i].setAttribute("title", titleContent);
    e[i].setAttribute("data-content", bodyContent);
    new bootstrap.Popover(e[i], {
      title: titleContent,
      content: bodyContent,
      trigger: "hover",
    });
  }
}

function setPopoversFr() {
  currencyFormatter();

  createPopover(
    "carCostPopover",
    "Prix d'auto",
    "Il faut multiplier le coût de l'auto par 1.15 pour calculer la valeur d'une nouvelle auto au N-B après taxe. Si on achète une voiture d'occasion, il faut se servir de la valeur 'Black Book' de l'auto et non le prix d'achat pour calculer les taxes."
  );

  createPopover(
    "principalPopover",
    "Capital",
    "Le montant original investi ou emprunté."
  );

  createPopover(
    "downpaymentPopover",
    "Mise de fonds",
    "Le montant d'argent que vous versez au moment de l'achat (10-20 % est une recommandation)."
  );

  createPopover(
    "interestPopover",
    "Taux d'intérêt",
    "Pourcentage demandé en taux annuel"
  );
  createPopover(
    "termPopover",
    "Terme",
    "Durée, en années, d'un investissement ou d'un prêt"
  );
  createPopover(
    "compoundPopover",
    "Période de calcul de l'intérêt",
    "Temps entre chaque période de calcul de l'intérêt, également appelé période d'intérêt"
  );
  createPopover(
    "amortizationPopover",
    "Amortisation",
    "Le montant versé pour diminuer son prêt."
  );
}

function setPopoversEn() {
  createPopover(
    "principalPopover",
    "Principal",
    "The amount invested or borrowed"
  );

  createPopover(
    "carCostPopover",
    "Car Cost",
    "To determine the car price with tax in New Brunswick, you must multiply the car's price by 1.15. If you buy a used car, you must multiply the car's 'Black Book' price by 0.15, and add this to the price you paid for your car."
  );

  createPopover(
    "downpaymentPopover",
    "Down payment",
    "The amount of money you pay at the moment of purchase. It is recommended to make a downpayment of 10-20% of the car's sale price."
  );
  createPopover(
    "interestPopover",
    "Interest",
    "The percentage charged annually to borrow money."
  );
  createPopover(
    "termPopover",
    "Term",
    "The time in years for an investment or loan"
  );
  createPopover(
    "amortizationPopover",
    "Amortization",
    "The amount you pay to lower your loan."
  );
}

function setPopovers() {
  $(document).ready(function () {
    // Showing and hiding tooltip with different speed
    $('[data-toggle="tooltip"]').tooltip({
      delay: { show: 50, hide: 200 },
      placement: "right",
      html: true,
    });
  });

  if (language == "fr") {
    setPopoversFr();
  } else {
    setPopoversEn();
  }
}

setPopovers();
