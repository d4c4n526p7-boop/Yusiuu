const params = new URLSearchParams(location.search);
const id = params.get('id');
const posts = Array.isArray(window.POSTS) ? window.POSTS : [];
const defaultImage = window.DEFAULT_CARD_IMAGE || 'assets/default-card.png';
let index = posts.findIndex(p => p.id === id);
if (index < 0) index = 0;
const post = posts[index];
const detail = document.querySelector('#detail');

if (!post) {
  document.title = 'Yusiuuu';
  detail.innerHTML = `<article class="detail-article"><div class="detail-heading"><h1>아직 글이 없어요</h1></div><p class="detail-text">/admin에서 첫 번째 마니또 미션을 작성해보세요.</p></article>`;
} else {
  document.title = `${post.title} · 유수풀로 풍덩!`;
  const images = post.images && post.images.length ? post.images : [defaultImage];
  const media = images.map((src, i) => `<figure><img src="${src}" alt="${post.title} 사진 ${i+1}" onerror="this.src='${defaultImage}'"></figure>`);
  let html = `<article class="detail-article"><div class="detail-heading"><p class="eyebrow">${post.date}</p><h1>${post.title}</h1></div>`;
  if (media[0]) html += media[0];
  const paragraphs = post.paragraphs && post.paragraphs.length ? post.paragraphs : ['아직 본문이 비어 있어요. 관리자 페이지에서 내용을 채워보세요.'];
  paragraphs.forEach((p, i) => {
    html += `<p class="detail-text">${p}</p>`;
    if (media[i+1]) html += media[i+1];
  });
  html += `</article>`;
  detail.innerHTML = html;

  const prev = posts[(index - 1 + posts.length) % posts.length];
  const next = posts[(index + 1) % posts.length];
  document.querySelector('#prevLink').href = `detail.html?id=${prev.id}`;
  document.querySelector('#nextLink').href = `detail.html?id=${next.id}`;
}
