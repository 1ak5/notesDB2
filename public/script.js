async function register() {
  const username = document.getElementById("username").value;
  const pin = document.getElementById("pin").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, pin }),
  });

  const data = await res.json();
  alert(data.message);
}

async function login() {
  const username = document.getElementById("username").value;
  const pin = document.getElementById("pin").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, pin }),
  });

  const data = await res.json();
  if (data.notes) {
    localStorage.setItem("username", username);
    localStorage.setItem("pin", pin);
    window.location.href = "notes.html";
  } else {
    alert(data.message);
  }
}
