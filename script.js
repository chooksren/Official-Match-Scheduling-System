const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");

let currentDate = new Date();
let selectedKey = null;
let matches = JSON.parse(localStorage.getItem("ref_matches") || "{}");

function getKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  
  calendarBody.innerHTML = "";
  let date = 1;

  for (let i = 0; i < 6; i++) {
    let row = document.createElement("tr");
    
    for (let j = 0; j < 7; j++) {
      let cell = document.createElement("td");
      
      if (i === 0 && j < firstDay) {
        cell.textContent = "";
      } else if (date > lastDate) {
        cell.textContent = "";
      } else {
        const d = date;
        const key = getKey(year, month, d);
        cell.innerHTML = `<div class="date-num">${d}</div>`;
        
        if (matches[key]) {
          matches[key].forEach(m => {
            let div = document.createElement("div");
            div.className = "match";
            div.textContent = `${m.time} ${m.team} (${m.ref})`;
            cell.appendChild(div);
          });
        }
        
        cell.addEventListener("click", () => openModal(key));
        date++;
      }
      row.appendChild(cell);
    }
    
    calendarBody.appendChild(row);
    if (date > lastDate) break;
  }
}

function openModal(key) {
  selectedKey = key;
  document.getElementById("modalDate").textContent = `Matches on ${key}`;
  document.getElementById("modal").classList.remove("hidden");
  renderList();
}

function renderList() {
  const list = document.getElementById("matchList");
  list.innerHTML = "";
  
  if (matches[selectedKey]) {
    matches[selectedKey].forEach((m, i) => {
      list.innerHTML += `<div style="font-size:12px">${m.time} - ${m.team} - ${m.ref} <a href="#" onclick="deleteMatch(${i});return false" style="color:red">[x]</a></div>`;
    });
  }
}

window.deleteMatch = (i) => {
  matches[selectedKey].splice(i, 1);
  if (matches[selectedKey].length === 0) delete matches[selectedKey];
  
  localStorage.setItem("ref_matches", JSON.stringify(matches));
  renderCalendar();
  renderList();
};

document.getElementById("saveMatch").addEventListener("click", () => {
  const team = document.getElementById("matchTeam").value;
  const time = document.getElementById("matchTime").value;
  const ref = document.getElementById("matchRef").value;

  if (!team) return alert("Enter teams");

  if (!matches[selectedKey]) matches[selectedKey] = [];
  
  matches[selectedKey].push({
    team,
    time: time || "TBD",
    ref: ref || "TBD"
  });

  localStorage.setItem("ref_matches", JSON.stringify(matches));
  document.getElementById("modal").classList.add("hidden");
  
  // Clear inputs
  document.getElementById("matchTeam").value = "";
  document.getElementById("matchTime").value = "";
  document.getElementById("matchRef").value = "";

  renderCalendar();
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});

document.getElementById("prev").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("next").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();