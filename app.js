// Birthday Club - App Logic
const SUPABASE_URL = 'https://htuthqzhqqskcjijnyxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dXRocXpocXFza2NqaWpueXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Nzc2MTgsImV4cCI6MjA4OTQ1MzYxOH0.4uHitOU7Li_DBzVZwqEkmVaae-nqmYTZZWn7HZxX_-g';

// Defer Supabase client init so CDN load doesn't block the rest of the script
let db = null;
function getSupabase() {
  if (!db && window.supabase) {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return db;
}

let familyCount = 0;
const MAX_FAMILY = 4;
const MIN_FAMILY = 1;

// ---------- Modal open/close ----------

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  launchEntranceConfetti();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(event) {
  if (event.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// No auto-add — family members are optional

// ---------- Multi-step navigation ----------

function goToStep(step) {
  if (step === 2 && !validateStep1()) return;

  // Add first family entry when arriving at step 2 for the first time
  if (step === 2 && familyCount === 0) {
    addFamilyMember();
  }

  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');

  // Launch confetti on success screen
  if (step === 3) launchConfetti();

  // Update progress dots
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot-${i}`);
    dot.classList.remove('active', 'completed');
    if (i < step) dot.classList.add('completed');
    else if (i === step) dot.classList.add('active');
  }

  // Update progress lines
  document.getElementById('line-1').classList.toggle('active', step >= 2);
  document.getElementById('line-2').classList.toggle('active', step >= 3);
}

// ---------- Validation ----------

function validateStep1() {
  let valid = true;
  const fields = [
    { id: 'firstName', msg: 'First name is required' },
    { id: 'lastName', msg: 'Last name is required' },
    { id: 'email', msg: 'Valid email is required' },
    { id: 'birthday', msg: 'Birthday is required' },
  ];

  clearErrors('step-1');

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const val = input.value.trim();
    let fieldValid = true;

    if (!val) {
      fieldValid = false;
    } else if (f.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      f.msg = 'Please enter a valid email address';
      fieldValid = false;
    } else if (f.id === 'birthday' && !isValidDate(val)) {
      f.msg = 'Please enter a valid date';
      fieldValid = false;
    }

    if (!fieldValid) {
      input.classList.add('invalid');
      input.closest('.form-group').querySelector('.error-msg').textContent = f.msg;
      valid = false;
    }
  });

  return valid;
}

function validateStep2() {
  let valid = true;
  clearErrors('step-2');

  // Family is optional — if no entries, that's fine
  if (document.querySelectorAll('.family-entry').length === 0) {
    return true;
  }

  document.querySelectorAll('.family-entry').forEach(entry => {
    const idx = entry.dataset.index;
    const fields = [
      { id: `fam-first-${idx}`, msg: 'First name is required' },
      { id: `fam-email-${idx}`, msg: 'Valid email is required' },
      { id: `fam-birthday-${idx}`, msg: 'Birthday is required' },
      { id: `fam-relationship-${idx}`, msg: 'Relationship is required' },
    ];

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const val = input.value.trim();
      let fieldValid = true;

      if (!val) {
        fieldValid = false;
      } else if (f.id.startsWith('fam-email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        f.msg = 'Please enter a valid email';
        fieldValid = false;
      } else if (f.id.startsWith('fam-birthday') && !isValidDate(val)) {
        f.msg = 'Please enter a valid date';
        fieldValid = false;
      }

      if (!fieldValid) {
        input.classList.add('invalid');
        input.closest('.form-group').querySelector('.error-msg').textContent = f.msg;
        valid = false;
      }
    });
  });

  return valid;
}

function clearErrors(stepId) {
  const step = document.getElementById(stepId);
  step.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  step.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  step.querySelectorAll('.error-banner').forEach(el => el.classList.remove('visible'));
}

function showBanner(id, msg) {
  const banner = document.getElementById(id);
  banner.textContent = msg;
  banner.classList.add('visible');
}

function isValidDate(str) {
  const d = new Date(str);
  return !isNaN(d.getTime());
}

// ---------- Family members ----------

function addFamilyMember() {
  if (familyCount >= MAX_FAMILY) return;
  familyCount++;
  const idx = familyCount;

  const html = `
    <div class="family-entry" data-index="${idx}" id="family-${idx}">
      <div class="family-entry-header">
        <h3>Family Member ${idx}</h3>
        ${idx > MIN_FAMILY ? `<button class="btn-remove" onclick="removeFamilyMember(${idx})">Remove</button>` : ''}
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="fam-first-${idx}">First Name</label>
          <input type="text" id="fam-first-${idx}" placeholder="Name">
          <div class="error-msg"></div>
        </div>
        <div class="form-group">
          <label for="fam-email-${idx}">Email</label>
          <input type="email" id="fam-email-${idx}" placeholder="email@example.com">
          <div class="error-msg"></div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="fam-birthday-${idx}">Birthday</label>
          <input type="date" id="fam-birthday-${idx}">
          <div class="error-msg"></div>
        </div>
        <div class="form-group">
          <label for="fam-relationship-${idx}">Relationship</label>
          <select id="fam-relationship-${idx}">
            <option value="">Select...</option>
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="other">Other</option>
          </select>
          <div class="error-msg"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('familyList').insertAdjacentHTML('beforeend', html);
  updateAddButton();
}

function removeFamilyMember(idx) {
  document.getElementById(`family-${idx}`).remove();
  familyCount--;
  // Re-number remaining entries
  const entries = document.querySelectorAll('.family-entry');
  entries.forEach((entry, i) => {
    entry.querySelector('h3').textContent = `Family Member ${i + 1}`;
  });
  updateAddButton();
}

function updateAddButton() {
  const btn = document.getElementById('btnAddFamily');
  btn.disabled = familyCount >= MAX_FAMILY;
  btn.textContent = familyCount >= MAX_FAMILY ? 'Maximum 4 family members' : '+ Add Family Member';
}

// ---------- Submit ----------

async function submitForm() {
  if (!validateStep1()) return;

  // If on step 2, also validate family entries
  const onStep2 = document.getElementById('step-2').classList.contains('active');
  if (onStep2 && !validateStep2()) return;

  const supabase = getSupabase();
  const errorBannerId = onStep2 ? 'error-2' : 'error-1';
  if (!supabase) {
    showBanner(errorBannerId, 'Unable to connect. Please check your internet connection and refresh.');
    return;
  }

  const btn = document.getElementById(onStep2 ? 'btnSubmit' : 'btnJoin');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Submitting...';

  try {
    // Insert primary member
    const memberData = {
      first_name: document.getElementById('firstName').value.trim(),
      last_name: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim().toLowerCase(),
      birthday: document.getElementById('birthday').value,
    };

    const { data: member, error: memberError } = await supabase
      .from('members')
      .insert(memberData)
      .select()
      .single();

    if (memberError) {
      if (memberError.code === '23505') {
        throw new Error('This email is already registered in the Birthday Club.');
      }
      throw memberError;
    }

    // Insert family members (if any were added)
    const familyEntries = document.querySelectorAll('.family-entry');
    if (familyEntries.length > 0) {
      const familyData = [];
      familyEntries.forEach(entry => {
        const idx = entry.dataset.index;
        familyData.push({
          member_id: member.id,
          first_name: document.getElementById(`fam-first-${idx}`).value.trim(),
          email: document.getElementById(`fam-email-${idx}`).value.trim().toLowerCase(),
          birthday: document.getElementById(`fam-birthday-${idx}`).value,
          relationship: document.getElementById(`fam-relationship-${idx}`).value,
        });
      });

      const { error: familyError } = await supabase
        .from('family_members')
        .insert(familyData);

      if (familyError) throw familyError;
    }

    // Fire-and-forget: send welcome email
    fetch(`${SUPABASE_URL}/functions/v1/send-welcome-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: member.id }),
    }).catch(() => {}); // silently ignore errors

    // Success
    goToStep(3);
  } catch (err) {
    showBanner(errorBannerId, err.message || 'Something went wrong. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Join the Club';
  }
}

// ---------- Confetti systems ----------

const CONFETTI_COLORS = ['#e68b3c', '#5b2512', '#f4c542', '#e85d75', '#6bc5d2', '#a8e06c', '#d4a0e8', '#ff6b9d', '#ffd93d'];
const PARTY_EMOJI = ['🎂', '🧁', '🎁', '🎈', '🎉', '🎊', '⭐', '✨', '🍰', '💛'];

function createConfettiPiece(container, opts = {}) {
  const count = opts.count || 80;
  const useEmoji = opts.emoji || false;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');

    const left = Math.random() * 100;
    const delay = Math.random() * (opts.delaySpread || 1);
    const duration = (opts.baseDuration || 2) + Math.random() * 2;
    const drift = (Math.random() - 0.5) * 160;
    const spin = 360 + Math.random() * 720;

    piece.style.left = `${left}%`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.setProperty('--drift', `${drift}px`);
    piece.style.setProperty('--spin', `${spin}deg`);

    if (useEmoji && Math.random() > 0.6) {
      piece.textContent = PARTY_EMOJI[Math.floor(Math.random() * PARTY_EMOJI.length)];
      piece.style.fontSize = `${14 + Math.random() * 18}px`;
      piece.style.width = 'auto';
      piece.style.height = 'auto';
      piece.style.background = 'none';
    } else {
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size = 6 + Math.random() * 10;
      const shapes = ['circle', 'square', 'star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      piece.style.width = `${size}px`;
      piece.style.height = `${size}px`;
      piece.style.backgroundColor = color;

      if (shape === 'circle') piece.style.borderRadius = '50%';
      else if (shape === 'star') {
        piece.style.backgroundColor = 'transparent';
        piece.textContent = '★';
        piece.style.fontSize = `${size + 4}px`;
        piece.style.color = color;
        piece.style.width = 'auto';
        piece.style.height = 'auto';
      }
    }

    container.appendChild(piece);
  }
}

function launchEntranceConfetti() {
  const container = document.getElementById('entranceConfetti');
  if (!container) return;
  container.innerHTML = '';
  createConfettiPiece(container, { count: 100, emoji: true, delaySpread: 1.2, baseDuration: 2 });
  // Auto-cleanup
  setTimeout(() => { container.innerHTML = ''; }, 4000);
}

function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;
  container.innerHTML = '';
  createConfettiPiece(container, { count: 120, emoji: true, delaySpread: 1, baseDuration: 2.5 });
  // Second wave
  setTimeout(() => {
    createConfettiPiece(container, { count: 60, emoji: true, delaySpread: 0.8, baseDuration: 2 });
  }, 800);
}
