const form = document.querySelector('#cv-form');
const resumeName = document.querySelector('#resume-name');
const resumeJob = document.querySelector('#resume-job');
const resumeContact = document.querySelector('#resume-contact');
const resumeHardSkills = document.querySelector('#resume-hard-skills');
const resumeSoftSkills = document.querySelector('#resume-soft-skills');
const resumeEducation = document.querySelector('#resume-education');
const resumeExperience = document.querySelector('#resume-experience');
const addEducationButton = document.querySelector('#add-education');
const educationFeedback = document.querySelector('#education-feedback');
const addExperienceButton = document.querySelector('#add-experience');
const experienceFeedback = document.querySelector('#experience-feedback');
const photoInput = document.querySelector('#photo');
const resumePhoto = document.querySelector('#resume-photo');
const resumeInitials = document.querySelector('#resume-initials');
const downloadButton = document.querySelector('#generate-button');
const downloadStatus = document.querySelector('#download-status');
let photoUrl;
const educationEntries = [];
const educationIntros = ['Formation suivie : ', 'Parcours académique : ', 'Études réalisées : ', 'Cursus : '];
const experienceEntries = [];
const experienceMissionIntros = ['Missions : ', 'Activités principales : ', 'Au quotidien : ', 'Contribution : '];

function getField(name) {
  return form.elements[name].value.trim();
}

function getSkillValues(prefix) {
  return [1, 2, 3, 4].map((number) => getField(`${prefix}${number}`)).filter(Boolean);
}

function renderList(container, value, emptyMessage, splitLines = false) {
  container.replaceChildren();
  const entries = splitLines
    ? value.split('\n').map((entry) => entry.trim()).filter(Boolean)
    : value.split(/[\n,;]+/).map((entry) => entry.trim()).filter(Boolean);

  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'resume-empty';
    empty.textContent = emptyMessage;
    container.append(empty);
    return;
  }

  for (const entry of entries) {
    const item = document.createElement(splitLines ? 'p' : 'span');
    item.className = splitLines ? '' : 'skill-chip';
    item.textContent = entry;
    container.append(item);
  }
}

function renderEducationEntries() {
  resumeEducation.replaceChildren();
  if (educationEntries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'resume-empty';
    empty.textContent = 'Ajoute tes études ou diplômes.';
    resumeEducation.append(empty);
    return;
  }

  educationEntries.forEach((entry, index) => {
    const item = document.createElement('article');
    item.className = 'resume-education-entry';
    const sentence = document.createElement('p');
    sentence.append(document.createTextNode(educationIntros[index % educationIntros.length]));
    const title = document.createElement('strong');
    title.textContent = entry.title;
    sentence.append(title);
    if (entry.school) sentence.append(document.createTextNode(` — ${entry.school}`));
    if (entry.years) sentence.append(document.createTextNode(` (${entry.years})`));
    sentence.append(document.createTextNode('.'));

    const removeButton = document.createElement('button');
    removeButton.className = 'education-remove';
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', `Supprimer ${entry.title}`);
    removeButton.setAttribute('data-html2canvas-ignore', 'true');
    removeButton.dataset.index = index;
    removeButton.textContent = '×';
    item.append(sentence, removeButton);
    resumeEducation.append(item);
  });
}

function renderExperienceEntries() {
  resumeExperience.replaceChildren();
  if (experienceEntries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'resume-empty';
    empty.textContent = 'Ton parcours professionnel apparaîtra ici.';
    resumeExperience.append(empty);
    return;
  }

  experienceEntries.forEach((entry, index) => {
    const item = document.createElement('article');
    item.className = 'resume-experience-entry';
    const sentence = document.createElement('p');
    const company = entry.company ? ` chez ${entry.company}` : '';
    const years = entry.years ? ` (${entry.years})` : '';
    const intro = index % 4 === 0
      ? `Poste occupé : ${entry.title}${company}${years}.`
      : index % 4 === 1
        ? `Expérience professionnelle en tant que ${entry.title}${company}${years}.`
        : index % 4 === 2
          ? `${entry.company ? `Au sein de ${entry.company}, ` : 'Dans cette expérience, '}j’ai exercé comme ${entry.title}${years}.`
          : `Mon parcours comprend le poste de ${entry.title}${company}${entry.years ? `, sur la période ${entry.years}` : ''}.`;
    sentence.append(document.createTextNode(intro));
    if (entry.missions) {
      const missions = entry.missions.replace(/[.!?]+$/, '');
      sentence.append(document.createTextNode(` ${experienceMissionIntros[index % experienceMissionIntros.length]}${missions}.`));
    }

    const removeButton = document.createElement('button');
    removeButton.className = 'education-remove';
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', `Supprimer ${entry.title}`);
    removeButton.setAttribute('data-html2canvas-ignore', 'true');
    removeButton.dataset.index = index;
    removeButton.textContent = '×';
    item.append(sentence, removeButton);
    resumeExperience.append(item);
  });
}

function renderResume() {
  const name = getField('name');
  resumeName.replaceChildren();
  const displayName = name || 'Ton nom ici';
  resumeName.append(document.createTextNode(displayName));
  const nameAccent = document.createElement('span');
  nameAccent.textContent = '.';
  resumeName.append(nameAccent);
  resumeInitials.textContent = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase('fr-FR'))
    .join('');
  resumeJob.textContent = getField('jobTitle') || 'Ton prochain poste';

  resumeContact.replaceChildren();
  const contactValues = [getField('email'), getField('phone')].filter(Boolean);
  for (const value of contactValues) {
    if (value) {
      const item = document.createElement('span');
      item.textContent = value;
      resumeContact.append(item);
    }
  }
  if (contactValues.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'resume-empty';
    empty.textContent = 'Ton e-mail et ton numéro apparaîtront ici.';
    resumeContact.append(empty);
  }

  renderList(resumeHardSkills, getSkillValues('hardSkill').join('\n'), 'Ajoute jusqu’à 4 compétences.', true);
  renderList(resumeSoftSkills, getSkillValues('softSkill').join('\n'), 'Ajoute jusqu’à 4 qualités.', true);
  renderEducationEntries();
  renderExperienceEntries();
}

form.addEventListener('input', renderResume);
addEducationButton.addEventListener('click', () => {
  const title = getField('educationTitle');
  if (!title) {
    educationFeedback.textContent = 'Indique au moins le nom du diplôme ou de la formation.';
    form.elements.educationTitle.focus();
    return;
  }

  educationEntries.push({
    title,
    school: getField('educationSchool'),
    years: getField('educationYears'),
  });
  for (const fieldName of ['educationTitle', 'educationSchool', 'educationYears']) {
    form.elements[fieldName].value = '';
  }
  educationFeedback.textContent = '';
  renderEducationEntries();
  form.elements.educationTitle.focus();
});

resumeEducation.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.education-remove');
  if (!removeButton) return;
  educationEntries.splice(Number(removeButton.dataset.index), 1);
  renderEducationEntries();
});

addExperienceButton.addEventListener('click', () => {
  const title = getField('experienceTitle');
  if (!title) {
    experienceFeedback.textContent = 'Indique au moins le poste occupé.';
    form.elements.experienceTitle.focus();
    return;
  }

  experienceEntries.push({
    title,
    company: getField('experienceCompany'),
    years: getField('experienceYears'),
    missions: getField('experienceMissions'),
  });
  for (const fieldName of ['experienceTitle', 'experienceCompany', 'experienceYears', 'experienceMissions']) {
    form.elements[fieldName].value = '';
  }
  experienceFeedback.textContent = '';
  renderExperienceEntries();
  form.elements.experienceTitle.focus();
});

resumeExperience.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.education-remove');
  if (!removeButton) return;
  experienceEntries.splice(Number(removeButton.dataset.index), 1);
  renderExperienceEntries();
});

photoInput.addEventListener('change', () => {
  const photo = photoInput.files[0];
  if (!photo) return;
  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = URL.createObjectURL(photo);
  resumePhoto.src = photoUrl;
  resumePhoto.hidden = false;
  resumeInitials.hidden = true;
});

downloadButton.addEventListener('click', async () => {
  if (typeof window.html2pdf !== 'function') {
    downloadStatus.textContent = 'Export indisponible : ouverture de la fenêtre d’impression.';
    window.print();
    return;
  }

  downloadButton.disabled = true;
  downloadStatus.textContent = 'Préparation de ton PDF…';
  try {
    await window.html2pdf()
      .set({
        margin: 12,
        filename: `${getField('name') || 'mon-cv'}.pdf`.replace(/[^a-z0-9._-]/gi, '-'),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#fffefa' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(document.querySelector('#resume'))
      .save();
    downloadStatus.textContent = 'Ton CV a été téléchargé en PDF.';
  } catch {
    downloadStatus.textContent = 'Le téléchargement a échoué : ouverture de la fenêtre d’impression.';
    window.print();
  } finally {
    downloadButton.disabled = false;
  }
});

renderResume();