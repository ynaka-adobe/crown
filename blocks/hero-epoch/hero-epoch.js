function setBackgroundFocus(img) {
  const { title } = img.dataset;
  if (!title?.includes('data-focal')) return;
  delete img.dataset.title;
  const [x, y] = title.split(':')[1].split(',');
  img.style.objectPosition = `${x}% ${y}%`;
}

function decorateBackground(bg) {
  const bgPic = bg.querySelector('picture');
  if (!bgPic) return;

  const img = bgPic.querySelector('img');
  setBackgroundFocus(img);

  const vidLink = bgPic.closest('a[href*=".mp4"]');
  if (vidLink) {
    const video = document.createElement('video');
    video.src = vidLink.href;
    video.loop = true;
    video.muted = true;
    video.inert = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'none');
    video.load();
    video.addEventListener('canplay', () => {
      video.play();
      bgPic.remove();
    });
    vidLink.parentElement.append(video, bgPic);
    vidLink.remove();
  }
}

function decorateForeground(fg) {
  const children = [...fg.children];
  children.forEach((child) => {
    const heading = child.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      heading.classList.add('hero-epoch-heading');
      const detail = heading.previousElementSibling;
      if (detail) {
        detail.classList.add('hero-epoch-detail');
      }
    }
    const links = child.querySelectorAll('a');
    if (links.length >= 2) {
      child.classList.add('hero-epoch-buttons');
    }
    if (heading || child.querySelector('p, a, ul')) {
      child.classList.add('hero-epoch-text');
    }
  });
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const fg = rows.pop();
  fg.classList.add('hero-epoch-foreground');
  decorateForeground(fg);
  if (rows.length) {
    const bg = rows.pop();
    bg.classList.add('hero-epoch-background');
    decorateBackground(bg);
  }
}
