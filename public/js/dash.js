let allDustbins = document.getElementById('server-data');
let full_bin = document.querySelector(".fullBinCount");
let allBins = document.querySelectorAll('.bin');
let allFill = document.querySelectorAll('.bin a .fill_level');
console.log(allFill);
allDustbins = JSON.parse(allDustbins.textContent);
const ctx = document.getElementById("trendChart").getContext("2d");
let diff,i=0;
let label=[];
let dustbins = [];
let colors = ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8","#00f"];
i = 0;
let fullBins = 0;
for (let dustbin of allDustbins) {
  if (dustbin.filled[dustbin.filled.length-1] == 100) {
    fullBins++
  }
  const bin = {
    label: dustbin.location,
    data: dustbin.filled,
    borderColor: "rgb(255,255,255)",
    backgroundColor: colors[i],
    tension:0.4,
  }
  dustbins.push(bin);
  i++;
}
let j = 0;
for (let fill of allFill) {
  fill=fill.innerHTML.substring(0,3);
  if (fill == "100" || parseInt(fill.substring(0, 2)) >= 90) {
    allBins[j].style.backgroundImage = "linear-gradient(black,black),linear-gradient(black,red)";
  }
  else { 
    allBins[j].style.backgroundImage = "linear-gradient(black,black),lime";
  }
  j++;
}
console.log("label:" + label);
full_bin.textContent = fullBins;
const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7",],
    datasets: dustbins/* [
      {
        label: "Saharaganj",
          data: [20, 40, 10, 80, 90, 65, 86],
            borderColor: "black",
              backgroundColor: "#14919b",
                tension: 0.4,
      },
      {
        label: "NPGC Main Gate",
        data: [70, 10, 10, 90, 40,25,56],
        borderColor: "black",
        backgroundColor: "#80ed99",
        tension: 0.4,
      },
      {
        label: "SBI Bank",
        data: [70, 100, 70, 90, 10,45,33],
        borderColor: "black",
        backgroundColor: "#45dfb1",
        tension: 0.4,
      },
    ],*/
  },
  options: {
    responsive: true,
  },
});
// Initialize the map
const map = L.map("map").setView([26.8467, 80.9462], 13); // Initial location (lat, lng)

// Add the OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Add sample markers for bins
/*const bins = [
  { id: 1, location: [26.846695, 80.946167], fillLevel: 100 },
  { id: 2, location: [26.826257, 80.91482], fillLevel: 45 },
];*/
const bins = [];
for(let dustbin of allDustbins){
  bins.push(dustbin);
}
console.log(bins);
bins.forEach((bin) => {
  const marker = L.marker([bin.latitude, bin.longitude],).addTo(map);
  marker.bindPopup(
    `<b>Bin Location:</b> ${bin.location}<br><b>Fill Level:</b> ${bin.filled[bin.filled.length-1]}%`
  );
});
    