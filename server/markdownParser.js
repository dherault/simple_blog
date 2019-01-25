function parseMarkdown(markdown, index) {

  const splittedMarkdown = markdown.split('\n');
  const articleLocations = [];
  const textLocations = [];
  const paragraphsLocations = [];

  splittedMarkdown.forEach((line, lineNumber) => {
    if (line.startsWith('#')) {
      // title processing
      let sharpCount = 1;

      for (let i = 1; i <= 5; i++) {
        if (line.charAt(i) === '#') sharpCount++;
      }

      splittedMarkdown[lineNumber] = `<h${sharpCount}>${line.substring(sharpCount + 1)}</h${sharpCount}>`;
    }
    else if (line.startsWith('--')) {
      articleLocations.push(lineNumber);
    }
    else if (line) {
      textLocations.push(lineNumber);

      // bold and italic processing
      const lineLength = line.length;
      const starsLocations = [];

      for (let i = 0; i < lineLength; i++) {
        if (line.charAt(i) === '*') starsLocations.push(i);
      }

      let nextLine = line;
      let k = 0;

      if (starsLocations.length) {
        for (let i = 0; i < starsLocations.length; i++) {
          // bold
          if (starsLocations[i + 1] === starsLocations[i] + 1) {
            nextLine = `${nextLine.substring(0, k + starsLocations[i])}<b>${nextLine.substring(k + starsLocations[i] + 2, k + starsLocations[i + 2])}</b>${nextLine.substring(k + starsLocations[i + 2] + 2)}`;
            k += 3;
            i += 3;
          }
          // italic
          else {
            nextLine = `${nextLine.substring(0, k + starsLocations[i])}<i>${nextLine.substring(k + starsLocations[i] + 1, k + starsLocations[i + 1])}</i>${nextLine.substring(k + starsLocations[i + 1] + 1)}`;
            k += 5;
            i += 1;
          }
        }

        splittedMarkdown[lineNumber] = nextLine;
      }
    }
  });

  // Articles creation
  let date = splittedMarkdown[articleLocations[0] + 1];
  splittedMarkdown[articleLocations[0]] = `<div class="article"><span>${date}</span><article>`;

  for (let i = 1; i < articleLocations.length; i++) {
    date = splittedMarkdown[articleLocations[i] + 1];
    splittedMarkdown[articleLocations[i]] = `</article></div><div class="article"><span>${date}</span><article>`;
  }

  splittedMarkdown.push('</article></div>');

  // Paragraphs creation
  paragraphsLocations.push(textLocations[0]);

  textLocations.forEach((location, i) => {
    if (textLocations[i + 1] > location + 1) paragraphsLocations.push(location, textLocations[i + 1]);
  });

  paragraphsLocations.push(textLocations[textLocations.length - 1]);

  let k = 0;

  for (let i = 0; i < paragraphsLocations.length; i += 2) {
    splittedMarkdown.splice(k + paragraphsLocations[i], 0, '<p>');
    k++;
    splittedMarkdown.splice(k + paragraphsLocations[i + 1] + 1, 0, '</p>');
    k++;
  }

  return `<section id="${index}">\n${splittedMarkdown.filter(line => line).join('\n')}\n</section>`;
}

module.exports = parseMarkdown;
