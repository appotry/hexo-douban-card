const { BaseSpider } = require('./baseSpider');

class BookSpider extends BaseSpider {
	constructor() {
		super();
	}
	/**
	 *爬取书本内容
	 * @param {number} subjectId
	 */
	crawl(subjectId) {
		return new Promise((resolve, reject) => {
			this.superagent
				.get(this.ENDPOINT.BOOK + subjectId)
				.then((res) => {
					var bookInfo = this.parsePlainText(res.text);
					resolve({ ...bookInfo, url: this.ENDPOINT.BOOK + subjectId });
				})
				.catch(reject);
		});
	}
	/**
	 * 解析文本数据
	 * @param {string} plainText
	 */
	parsePlainText(plainText) {
		var $ = this.cheerio.load(plainText);
		var info = {
			title: $('h1').text().replace(/\s/g, ''),
		};
		var bookInfo = $('#info').find('.pl').toArray();
		bookInfo.forEach((element) => {
			var itemName = $(element).text();
			if (itemName.indexOf('作者') !== -1) {
				var author = $(element).next().text();
				author = author.replace(/\s/g, '');
				info = {
					...info,
					author: author,
				};
			} else if (itemName.indexOf('出版年') !== -1) {
				var publishDate = element.next.data.replace(/\s/g, '');
				info = {
					...info,
					publishDate: publishDate,
				};
			}
		});
		var bg = $('#mainpic').children('.nbg');
		var bgUrl = $(bg).children('img')[0].attribs.src;
		info = {
			...info,
			rate: $('.rating_num').text().replace(/\s/g, ''),
			img: 'https://images.weserv.nl/?url=' + bgUrl,
		};
		return info;
	}
}

module.exports.BookSpider = BookSpider;
