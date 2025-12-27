function switchSection(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.target === id);
  });
}

document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => switchSection(a.dataset.target));
});

// Certification handling
const certForm = document.getElementById('certForm');
const certTable = document.querySelector('#certTable tbody');
certForm.addEventListener('submit', e => {
  e.preventDefault();
  const skill = document.getElementById('skill').value.trim();
  const status = document.getElementById('status').value;
  const expiry = document.getElementById('expiry').value;
  if (!skill || !status || !expiry) return;
  const row = `<tr><td>${skill}</td><td>${status}</td><td>${expiry}</td></tr>`;
  certTable.insertAdjacentHTML('beforeend', row);
  certForm.reset();
});

// Profiles
let profiles = [];
let editingIndex = null;
const profileForm = document.getElementById('profileForm');
const profileList = document.getElementById('profileList');
const currentProfileCard = document.getElementById('currentProfileCard');

function renderProfiles() {
  profileList.innerHTML = '';
  if (profiles.length === 0) {
    profileList.innerHTML = '<li>No profiles added yet.</li>';
    clearCurrentProfile();
    return;
  }
  profiles.forEach((p, i) => {
    const li = document.createElement('li');
    li.textContent = `${p.name} (${p.profession || 'No profession'})`;
    li.style.cursor = 'pointer';
    li.onclick = () => editProfile(i);
    profileList.appendChild(li);
  });
}

function editProfile(i) {
  const p = profiles[i];
  profileForm.name.value = p.name;
  profileForm.email.value = p.email;
  profileForm.profession.value = p.profession;
  editingIndex = i;
  switchSection('profile');
}

function clearCurrentProfile() {
  currentProfileCard.querySelector('h2').textContent = "No Profile Selected";
  currentProfileCard.querySelectorAll('p').forEach(p => p.textContent = "");
}

function updateCurrentProfileCard(p) {
  currentProfileCard.querySelector('h2').textContent = p.name;
  currentProfileCard.querySelectorAll('p')[0].textContent = `DOB: ${p.dob || '-'} | Phone: ${p.phone || '-'}`;
  currentProfileCard.querySelectorAll('p')[1].textContent = `Stream: ${p.stream || '-'} | 10th: ${p.marks10th || '-'}% | 12th: ${p.marks12th || '-'}%`;
}

profileForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = profileForm.name.value.trim();
  const email = profileForm.email.value.trim();
  const profession = profileForm.profession.value.trim();
  if (!name || !email) return alert('Name and email required.');
  if (editingIndex !== null) {
    profiles[editingIndex] = { ...profiles[editingIndex], name, email, profession };
    editingIndex = null;
    alert('Profile updated!');
  } else {
    if (profiles.length >= 2) return alert('Max 2 profiles.');
    profiles.push({ name, email, profession });
    alert('Profile added!');
  }
  renderProfiles();
  updateCurrentProfileCard(profiles[profiles.length - 1]);
  profileForm.reset();
  switchSection('home');
});

// Home profile form
document.getElementById('homeProfileForm').addEventListener('submit', e => {
  e.preventDefault();
  if (profiles.length >= 2) return alert('Max 2 profiles.');
  const data = {
    name: document.getElementById('nameHome').value.trim(),
    dob: document.getElementById('dobHome').value,
    phone: document.getElementById('phoneHome').value,
    stream: document.getElementById('streamHome').value.trim(),
    marks10th: document.getElementById('marks10thHome').value,
    marks12th: document.getElementById('marks12thHome').value,
    email: '',
    profession: ''
  };
  profiles.push(data);
  renderProfiles();
  updateCurrentProfileCard(data);
  alert('Profile created!');
  e.target.reset();
});

// Initialize
renderProfiles();
clearCurrentProfile();
