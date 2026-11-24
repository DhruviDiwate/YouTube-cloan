const videos = [
  { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 beats to relax / study to', channel: 'Lofi Girl', category: 'Music', views: '18M views', age: '3 years ago', duration: 'LIVE', initials: 'LG', color: '#f1b18d', ink: '#512b21', live: true, thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=960&q=80' },
  { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', channel: 'Luis Fonsi', category: 'Music', views: '8.6B views', age: '8 years ago', duration: '4:42', initials: 'LF', color: '#e5c4a4', ink: '#523827', verified: true },
  { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)', channel: 'Rick Astley', category: 'Music', views: '1.6B views', age: '16 years ago', duration: '3:33', initials: 'RA', color: '#d3e2cf', ink: '#264c36', verified: true },
  { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE(강남스타일) M/V', channel: 'officialpsy', category: 'Music', views: '5.4B views', age: '13 years ago', duration: '4:13', initials: 'PS', color: '#c4b8ea', ink: '#372b62', verified: true },
  { id: 'hT_nvWreIhg', title: 'OneRepublic - Counting Stars (Official Music Video)', channel: 'OneRepublic', category: 'Music', views: '4.1B views', age: '12 years ago', duration: '4:44', initials: '1R', color: '#e8a871', ink: '#63391d', verified: true },
  { id: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect (Official Music Video)', channel: 'Ed Sheeran', category: 'Music', views: '4.0B views', age: '8 years ago', duration: '4:40', initials: 'ES', color: '#dfb5b1', ink: '#542825', verified: true },
  { id: 'CevxZvSJLk8', title: 'Katy Perry - Roar (Official)', channel: 'Katy Perry', category: 'Music', views: '4.0B views', age: '12 years ago', duration: '4:30', initials: 'KP', color: '#cfda99', ink: '#404b1c', verified: true },
  { id: '3JZ_D3ELwOQ', title: 'Major Lazer & DJ Snake - Lean On (feat. MØ)', channel: 'Major Lazer', category: 'Music', views: '3.7B views', age: '10 years ago', duration: '2:59', initials: 'ML', color: '#f0d477', ink: '#54430e', verified: true },
  { id: 'M7lc1UVf-VE', title: 'Building a creative coding setup that actually works', channel: 'The Coding Train', category: 'Coding', views: '846K views', age: '2 months ago', duration: '18:26', initials: 'CT', color: '#a8d7e5', ink: '#164b5b' },
  { id: 'ScMzIvxBSi4', title: 'A slow morning in the mountains | ambient travel film', channel: 'Field Notes', category: 'Travel', views: '284K views', age: '1 week ago', duration: '12:08', initials: 'FN', color: '#b8c5a1', ink: '#354229' },
  { id: 'LDU_Txk06tM', title: 'The coziest little kitchen: simple meals, no rush', channel: 'Sunday Table', category: 'Food', views: '1.2M views', age: '4 days ago', duration: '16:41', initials: 'ST', color: '#edb9a2', ink: '#603a2c' },
  { id: 'ysz5S6PUM-U', title: 'Designing a calmer digital life (and why it matters)', channel: 'Studio Practice', category: 'Design', views: '193K views', age: '3 weeks ago', duration: '9:52', initials: 'SP', color: '#c7b9d8', ink: '#423252' }
];

const videoGrid = document.querySelector('#video-grid');
const searchInput = document.querySelector('#search-input');
const searchForm = document.querySelector('#search-form');
const categoryBar = document.querySelector('#category-bar');
const feedCount = document.querySelector('#feed-count');
const emptyState = document.querySelector('#empty-state');
const resetFilters = document.querySelector('#reset-filters');
const dialog = document.querySelector('#video-dialog');
const dialogBackdrop = document.querySelector('#dialog-backdrop');
const playerFrame = document.querySelector('#player-frame');
const menuToggle = document.querySelector('#menu-toggle');

let activeCategory = 'All';
let searchTerm = '';

function renderVideos() {
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
    const searchableText = `${video.title} ${video.channel} ${video.category}`.toLowerCase();
    return matchesCategory && searchableText.includes(searchTerm.toLowerCase());
  });

  videoGrid.innerHTML = filteredVideos.map((video, index) => `
    <article class="video-card" style="animation-delay:${Math.min(index * 45, 315)}ms">
      <button class="thumbnail-button" type="button" data-video-id="${video.id}" aria-label="Play ${escapeHtml(video.title)}">
        <img src="${video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}" alt="" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${video.id}/mqdefault.jpg'">
        <span class="thumbnail-shade"></span>
        ${video.live ? '<span class="live-label"><i></i> LIVE</span>' : ''}
        <span class="duration">${video.duration}</span>
      </button>
      <div class="video-info">
        <span class="channel-avatar" style="--avatar-bg:${video.color};--avatar-ink:${video.ink}" aria-hidden="true">${video.initials}</span>
        <div class="video-copy">
          <h2 class="video-title">${escapeHtml(video.title)}</h2>
          <p class="video-channel">${escapeHtml(video.channel)}${video.verified ? '<span class="verified" aria-label="Verified">✓</span>' : ''}</p>
          <p class="video-stats">${video.views} · ${video.age}</p>
        </div>
        <button class="video-menu" type="button" aria-label="More options for ${escapeHtml(video.title)}" title="More options">⋮</button>
      </div>
    </article>
  `).join('');

  const count = filteredVideos.length;
  feedCount.textContent = `${count} ${count === 1 ? 'video' : 'videos'}`;
  videoGrid.hidden = count === 0;
  emptyState.hidden = count !== 0;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function setCategory(category) {
  activeCategory = category;
  categoryBar.querySelectorAll('.category-chip').forEach((chip) => {
    const selected = chip.dataset.category === category;
    chip.classList.toggle('is-selected', selected);
    chip.setAttribute('aria-pressed', String(selected));
  });
  renderVideos();
}

function openVideo(videoId) {
  const video = videos.find((entry) => entry.id === videoId);
  if (!video) return;

  document.querySelector('#dialog-title').textContent = video.title;
  document.querySelector('#dialog-channel').textContent = `${video.channel} · ${video.views}`;
  document.querySelector('#watch-on-youtube').href = `https://www.youtube.com/watch?v=${video.id}`;
  playerFrame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0" title="${escapeHtml(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  dialog.showModal();
  dialogBackdrop.classList.add('is-visible');
}

function closeVideo() {
  if (dialog.open) dialog.close();
  playerFrame.replaceChildren();
  dialogBackdrop.classList.remove('is-visible');
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchTerm = searchInput.value.trim();
  renderVideos();
});

searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.trim();
  renderVideos();
});

categoryBar.addEventListener('click', (event) => {
  const chip = event.target.closest('.category-chip');
  if (chip) setCategory(chip.dataset.category);
});

videoGrid.addEventListener('click', (event) => {
  const thumbnail = event.target.closest('[data-video-id]');
  if (thumbnail) openVideo(thumbnail.dataset.videoId);
});

resetFilters.addEventListener('click', () => {
  searchInput.value = '';
  searchTerm = '';
  setCategory('All');
});

document.querySelector('#close-dialog').addEventListener('click', closeVideo);
dialogBackdrop.addEventListener('click', closeVideo);
dialog.addEventListener('close', () => {
  playerFrame.replaceChildren();
  dialogBackdrop.classList.remove('is-visible');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeVideo();
});
menuToggle.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-collapsed');
});

document.querySelectorAll('.nav-item[data-category]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setCategory(link.dataset.category);
    document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('is-current'));
    link.classList.add('is-current');
  });
});

renderVideos();
