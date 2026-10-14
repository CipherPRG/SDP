// Family Members form — validation, list rendering, toast
const form = document.getElementById("memberForm");
const members = [];
const $ = (id) => document.getElementById(id);

/* ---------- Live input cleanup ---------- */
$("pan").addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
});
["mobile", "pincode"].forEach((id) =>
  $(id).addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")))
);
$("aadhaar").addEventListener("input", (e) => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 12);
  e.target.value = d.replace(/(\d{4})(?=\d)/g, "$1 ");
});
$("dob").max = new Date().toISOString().split("T")[0];

/* ---------- Helpers ---------- */
function age(dob) {
  const b = new Date(dob), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  if (t < new Date(t.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}

function esc(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* ---------- Validation rules ---------- */
// Each validator returns an error string, or "" if valid
const rules = {
  name: (v) =>
    !v ? "Name is required" :
    !/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v) ? "Use letters and spaces only (2–50 characters)" : "",

  relation: (v) => {
    if (!v) return "Select a relationship";
    if (v === "Self" && members.some((m) => m.relation === "Self")) return "'Self' has already been added";
    return "";
  },

  dob: (v) => {
    if (!v) return "Date of birth is required";
    if (new Date(v) > new Date()) return "Date of birth cannot be in the future";
    if (age(v) > 120) return "Please enter a valid date of birth";
    return "";
  },

  gender: (v) => (!v ? "Select a gender" : ""),

  pan: (v) => {
    if (!v) return "PAN is required";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v)) return "Invalid PAN. Format: ABCPE1234F";
    if (v[3] !== "P") return "4th character must be 'P' for an individual PAN";
    if (members.some((m) => m.pan === v)) return "This PAN is already added";
    return "";
  },

  aadhaar: (v) => {
    const d = v.replace(/\s/g, "");
    if (!d) return "Aadhaar is required";
    if (!/^[2-9][0-9]{11}$/.test(d)) return "Must be 12 digits and not start with 0 or 1";
    if (members.some((m) => m.aadhaar === d)) return "This Aadhaar is already added";
    return "";
  },

  mobile: (v) =>
    !v ? "Mobile number is required" :
    !/^[6-9][0-9]{9}$/.test(v) ? "Enter a valid 10-digit number starting with 6–9" : "",

  email: (v) =>
    v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email address" : "",

  occupation: (v) => (!v ? "Select an occupation" : ""),

  income: (v) => {
    const earning = ["Salaried", "Self-employed", "Business"].includes($("occupation").value);
    if (earning && v === "") return "Income is required for this occupation";
    if (v !== "" && (Number(v) < 0 || Number(v) > 1e10)) return "Enter a valid amount";
    return "";
  },

  address: (v) =>
    !v ? "Address is required" :
    v.length < 10 ? "Address must be at least 10 characters" : "",

  pincode: (v) =>
    !v ? "PIN code is required" :
    !/^[1-9][0-9]{5}$/.test(v) ? "Enter a valid 6-digit PIN code" : "",
};

function validateField(id) {
  const el = $(id);
  const field = el.closest(".field");
  const msg = rules[id](el.value.trim());
  field.classList.toggle("invalid", !!msg);
  field.querySelector(".error-msg").textContent = msg;
  return !msg;
}

// Validate on blur; re-validate while typing once a field is marked invalid
Object.keys(rules).forEach((id) => {
  $(id).addEventListener("blur", () => validateField(id));
  $(id).addEventListener("input", () => {
    if ($(id).closest(".field").classList.contains("invalid")) validateField(id);
  });
});
$("occupation").addEventListener("change", () => {
  if ($("income").closest(".field").classList.contains("invalid")) validateField("income");
});

/* ---------- Submit / reset ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const results = Object.keys(rules).map(validateField);
  if (results.includes(false)) {
    form.querySelector(".invalid input, .invalid select, .invalid textarea").focus();
    return;
  }

  const m = {
    id: Date.now(),
    name: $("name").value.trim(),
    relation: $("relation").value,
    dob: $("dob").value,
    gender: $("gender").value,
    pan: $("pan").value,
    aadhaar: $("aadhaar").value.replace(/\s/g, ""),
    mobile: $("mobile").value,
    email: $("email").value.trim(),
    occupation: $("occupation").value,
    income: $("income").value,
    address: $("address").value.trim(),
    pincode: $("pincode").value,
  };

  members.push(m);
  render();
  form.reset();
  showToast(`${m.name} added successfully`);
  $("name").focus();
});

form.addEventListener("reset", () =>
  document.querySelectorAll(".field.invalid").forEach((f) => f.classList.remove("invalid"))
);

/* ---------- Render members ---------- */
function render() {
  $("count").textContent = members.length;
  $("empty").style.display = members.length ? "none" : "block";
  $("memberList").innerHTML = members.map((m) => `
    <div class="member">
      <div class="member-top">
        <div class="avatar">${esc(m.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase())}</div>
        <div><h3>${esc(m.name)}</h3><span>${m.relation} · ${m.gender} · ${age(m.dob)} yrs</span></div>
      </div>
      <dl>
        <dt>PAN</dt><dd>${m.pan}</dd>
        <dt>Aadhaar</dt><dd>XXXX XXXX ${m.aadhaar.slice(-4)}</dd>
        <dt>Mobile</dt><dd>${m.mobile}</dd>
        ${m.email ? `<dt>Email</dt><dd>${esc(m.email)}</dd>` : ""}
        <dt>Occupation</dt><dd>${m.occupation}</dd>
        ${m.income ? `<dt>Income</dt><dd>₹${Number(m.income).toLocaleString("en-IN")}</dd>` : ""}
        <dt>PIN</dt><dd>${m.pincode}</dd>
      </dl>
      <button class="remove" data-id="${m.id}">Remove</button>
    </div>`).join("");
}

// Event delegation for Remove buttons (no inline onclick needed)
$("memberList").addEventListener("click", (e) => {
  const btn = e.target.closest(".remove");
  if (!btn) return;
  const i = members.findIndex((m) => m.id === Number(btn.dataset.id));
  if (i > -1) members.splice(i, 1);
  render();
});

/* ---------- Toast ---------- */
let toastTimer;
function showToast(text) {
  $("toastMsg").textContent = text;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2800);
}
