window.onload = () => {

  /* Data fetching */

  const mainContent = document.getElementById('content');
  const sections = document.getElementsByTagName('section');
  const moreContentElement = document.getElementById('more-content');

  const parser = new DOMParser();

  let lastTicketId = parseInt(sections[sections.length - 1].id, 10);

  moreContentElement.onclick = () => {
    fetch(`/ticket/${lastTicketId + 1}`, { method: 'GET' })
    .then(response => response.text())
    .then(response => {
      const htmlDocument = parser.parseFromString(response, 'text/html');
      const newSection = htmlDocument.getElementById(lastTicketId + 1);
      mainContent.appendChild(newSection);
      lastTicketId++;
    })
    .catch(() => {
      moreContentElement.classList.toggle('hidden');
    });
  };

  /* Fading */

  const body = document.getElementsByTagName('body')[0];

  setTimeout(() => body.classList.toggle('transparent'), 200);
  setTimeout(() => mainContent.classList.toggle('transparent'), 1000);
};
