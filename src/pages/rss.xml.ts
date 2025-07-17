import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

function sortPosts(a: { data: { publishDate: Date } }, b: { data: { publishDate: Date } }) {
	return Number(b.data.publishDate) - Number(a.data.publishDate);
}

function formatDate(date: Date) {
	date.setUTCHours(0);
	return date;
}

export const GET: APIRoute = async (context) => {
	const posts = (await getCollection('blog')).sort((a, b) => sortPosts(a, b));

	return rss({
		// The RSS Feed title, description, and custom metadata.
		title: 'The Falak Blog',
		// See "Styling" section below
		description: 'News and updates about Falak.',
		site: (context.site as URL).href,
		// The list of items for your RSS feed, sorted.
		items: posts.map((item) => ({
			title: item.data.title,
			description: item.data.description,
			link: `/blog/${item.slug}/`,
			pubDate: formatDate(item.data.publishDate),
		})),
	});
};
