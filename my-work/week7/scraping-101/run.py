from requests_html import HTMLSession
import csv

session = HTMLSession()

domain = 'https://www.digitalartarchive.at'
url = 'https://www.digitalartarchive.at/database/database-info/archive.html?tx_kesearch_pi1%5Bpage%5D='

artwork_url_dict = {}

page_start = 1
page_end = 100


# r = session.get(url, verify=False)

# for html in r.html:
#     print(html)

for i in range(2, 10):
    page_fetched = False
    while not page_fetched:
        i = str(i)
        print(f"Page {i}")

        print('Start GET ' + url+i)
        r = session.get(url+i, verify=False)

        print('Start Render ' + url+i)
        r.html.render(retries=10, wait=5, timeout=20, keep_page=True)
        print(r)

        search_items = r.html.find('.ke_search_item')
        print(search_items)

        if len(search_items) != 0:
            page_fetched = True

        for item in search_items:
            artwork_item = item.find('a', first=True)
            artwork_url = artwork_item.attrs['href']
            artwork_name = artwork_item.text
            print(artwork_name, artwork_url)
            artwork_url_dict[artwork_name] = artwork_url


with open('artwork_url.csv', 'w') as f:
    for key in artwork_url_dict.keys():
        f.write("%s,%s\n" % (key, artwork_url_dict[key]))
