const RSS_FEEDS = {
    '전체기사': 'https://www.kado.net/rss/allArticle.xml',
    '인기기사': 'https://www.kado.net/rss/clickTop.xml',
    '정치': 'https://www.kado.net/rss/S1N1.xml',
    '경제': 'https://www.kado.net/rss/S1N2.xml',
    '사회': 'https://www.kado.net/rss/S1N3.xml',
    '문화': 'https://www.kado.net/rss/S1N4.xml',
    '스포츠': 'https://www.kado.net/rss/S1N5.xml',
    '지역': 'https://www.kado.net/rss/S1N6.xml',
    '오피니언': 'https://www.kado.net/rss/S1N8.xml',
    '포토&그래픽': 'https://www.kado.net/rss/S1N12.xml',
    '강원도민TV': 'https://www.kado.net/rss/S1N19.xml',
    '기획': 'https://www.kado.net/rss/S2N97.xml',
    '수영': 'https://www.kado.net/rss/S2N146.xml'
};

async function fetchRSSFeed(url) {
    try {
        const rss2json = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
        const response = await fetch(rss2json);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('RSS 피드를 가져오는 중 오류 발생:', error);
        return null;
    }
}

function parseRSSFeed(data) {
    if (!data || !data.items) return [];
    
    return data.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate),
        description: item.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
    }));
}

function displayNews(category, news) {
    const newsContainer = document.getElementById('newsContainer');
    const section = document.createElement('div');
    section.className = 'news-section';
    
    section.innerHTML = `
        <h2>${category}</h2>
        <ul class="news-list">
            ${news.map(item => `
                <li class="news-item">
                    <a href="${item.link}" target="_blank">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <span class="date">${item.pubDate.toLocaleString()}</span>
                    </a>
                </li>
            `).join('')}
        </ul>
    `;
    
    newsContainer.appendChild(section);
}

async function loadAllNews() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    for (const [category, url] of Object.entries(RSS_FEEDS)) {
        const data = await fetchRSSFeed(url);
        if (data) {
            const newsItems = parseRSSFeed(data);
            displayNews(category, newsItems);
        }
    }

    loadingElement.style.display = 'none';
}

// 페이지 로드 시 뉴스 불러오기
window.addEventListener('load', loadAllNews); 