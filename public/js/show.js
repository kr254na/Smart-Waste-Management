const ct = document.getElementById("comparisonChart").getContext("2d");
let dustbin = document.getElementById('server-dustbin-data');
dustbin = JSON.parse(dustbin.textContent);
console.log(dustbin);
const chrt = new Chart(ct, {
    type: "line",
    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7",],
      datasets: [
        {
          label: dustbin.location,
            data:dustbin.filled,
              borderColor: "rgb(0,255,0)",
                backgroundColor: "#f00",
                  tension: 0.4,
        }],
    },
    options: {
      responsive: true,
    },
  });