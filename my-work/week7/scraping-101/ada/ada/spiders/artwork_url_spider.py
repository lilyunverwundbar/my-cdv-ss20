import scrapy


class ArtworkURLSpider(scrapy.Spider):
    name = 'artwork_url'

    def start_requests(self):
        urls = []
        for i in range(1, 3):
            urls.append(
                f'https://www.digitalartarchive.at/database/database-info/archive.html?tx_kesearch_pi1%5Bpage%5D={i}')
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        print(response.body)

        print(response.css('.ke_search_item'))
