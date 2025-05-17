const Parser = require('rss-parser');
const parser = new Parser();

async function fetchDefiNews(limit = 5) {
    const feeds = [
        'https://cointelegraph.com/rss',
        'https://www.coindesk.com/arc/outboundfeeds/rss/',
    ]

    const allNews = [];

    for (const feed of feeds) {
        try {
            const res = await parser.parseURL(feed);
            allNews.push(...res.items.slice(0, limit)); // Take top X
        } catch (err) {
            console.error("❌ Failed to fetch from", feed, err.message);
        }
    }

    return allNews.slice(0, limit);
}

module.exports = { fetchDefiNews };
