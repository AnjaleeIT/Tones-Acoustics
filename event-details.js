(function () {
  if (typeof EVENTS === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  let id = parseInt(params.get('id'), 10);
  let event = EVENTS.find(e => e.id === id) || EVENTS[0];

  if (!event) return;

  document.title = event.venue + ' — TONES ACOUSTIC';

  // CSS Class එකක් දෙනවා වෙනුවට කෙලින්ම HTML <img> ටැග් එකක් පසුබිමට එකතු කරනවා
  const cover = document.getElementById('detailCover');
  if (cover) {
    cover.className = 'detail-cover'; // පැරණි grad ක්ලාස් අයින් කරනවා
    cover.innerHTML = `<img src="${event.img}" alt="${event.venue}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`;
  }

  const statusEl = document.getElementById('detailStatus');
  if (statusEl) {
    statusEl.textContent = event.statusLabel;
    statusEl.className = 'detail-status status-' + event.status;
  }

  const venueEl = document.getElementById('detailVenue');
  if (venueEl) venueEl.textContent = event.venue;

  const cityEl = document.getElementById('detailCity');
  if (cityEl) cityEl.textContent = event.city;

  const quickfactsEl = document.getElementById('detailQuickfacts');
  if (quickfactsEl) {
    quickfactsEl.innerHTML =
      '<span>' + event.day + ' ' + event.month + ' ' + event.year + '</span>' +
      '<span>&bull;</span><span>' + event.time + '</span>' +
      '<span>&bull;</span><span>' + event.price + '</span>';
  }

  const descEl = document.getElementById('detailDescription');
  if (descEl) descEl.textContent = event.description;

  const factsList = document.getElementById('detailFacts');
  if (factsList) {
    factsList.innerHTML = '';
    event.details.forEach(item => {
      factsList.innerHTML += `<dt>${item.label}</dt><dd>${item.value}</dd>`;
    });
  }
})();