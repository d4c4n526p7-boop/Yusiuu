const cards = document.querySelector('#cards');
const posts = Array.isArray(window.POSTS) ? window.POSTS : [];
const defaultImage = window.DEFAULT_CARD_IMAGE || 'assets/default-card.png';
const placeholderCount = Math.max(0, 10 - posts.length);

function cardImage(post) {
  const src = post.images && post.images.length ? post.images[0] : defaultImage;
  return `<img src="${src}" alt="${post.title} 대표 이미지" onerror="this.src='${defaultImage}'">`;
}

function bubbles() {
  return `<span class="bubble b1" aria-hidden="true"></span><span class="bubble b2" aria-hidden="true"></span><span class="bubble b3" aria-hidden="true"></span><span class="bubble b4" aria-hidden="true"></span>`;
}

posts.forEach((post, i) => {
  const a = document.createElement('a');
  a.className = 'card';
  a.href = `detail.html?id=${encodeURIComponent(post.id)}`;
  a.innerHTML = `${cardImage(post)}<div class="card-body"><h3>${post.title}</h3><time>${post.date}</time><p>${post.excerpt || '카드를 눌러 이야기를 열어보세요.'}</p></div>${bubbles()}`;
  a.style.setProperty('--delay', `${i * 35}ms`);
  cards.appendChild(a);
});

for (let i = 0; i < placeholderCount; i += 1) {
  const div = document.createElement('div');
  div.className = 'card placeholder-card';
  div.innerHTML = `<img src="${defaultImage}" alt="아직 비어 있는 마니또 미션 기본 이미지"><div class="card-body"><h3>곧 올라올 미션</h3><time>Yusiuuu</time><p>/admin에서 새 글을 쓰면 이 자리에 카드가 채워집니다.</p></div>${bubbles()}`;
  div.style.setProperty('--delay', `${(posts.length + i) * 35}ms`);
  cards.appendChild(div);
}

const splash = document.querySelector('.splash-word');
const tube = document.querySelector('.tube');
function activateSplash(){ splash.classList.add('is-splashing'); }
function deactivateSplash(){ splash.classList.remove('is-splashing'); }
splash.addEventListener('mouseenter', activateSplash);
splash.addEventListener('mouseleave', deactivateSplash);
splash.addEventListener('focus', activateSplash);
splash.addEventListener('blur', deactivateSplash);
splash.addEventListener('touchstart', () => { activateSplash(); setTimeout(deactivateSplash, 1200); }, {passive:true});

tube.addEventListener('mouseenter', () => tube.classList.add('is-drifting'));
tube.addEventListener('mouseleave', () => tube.classList.remove('is-drifting'));
tube.addEventListener('focus', () => tube.classList.add('is-drifting'));
tube.addEventListener('blur', () => tube.classList.remove('is-drifting'));
tube.addEventListener('touchstart', () => { tube.classList.add('is-drifting'); setTimeout(() => tube.classList.remove('is-drifting'), 1500); }, {passive:true});

if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user && window.location.hash.includes('invite_token')) {
      window.netlifyIdentity.open('signup');
    }
  });
}
