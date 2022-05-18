from ast import List
from collections import namedtuple
import http.client, urllib.parse
import string
from typing import Set
import json
import namedtupled

from numpy import double

class Highlights():
    def __init__(self, highlight, sentiment, highlighted_in) -> None:
        self.highlight = highlight
        self.sentiment = sentiment
        self.highlighted_in = highlighted_in

class Entities():
    def __init__(self, symbol: string, name: string, exchange: string, exchange_long: string, country: string, type: string, industry: string, match_score: float, sentiment_score: float, highlights: Highlights) -> None:
        self.symbol = symbol
        self.name = name
        self.exchange = exchange
        self.exchange_long = exchange_long
        self.country = country
        self.type = type
        self.industry = industry
        self.match_score = match_score
        self.sentiment_score = sentiment_score
        self.highlights = highlights

class Meta():
    def __init__(self, found: int, returned: int, limit: int, page: int) -> None:
        self.found = found
        self.returned = returned
        self.limit = limit
        self.page = page

class Data():
    def __init__(self, uuid: string, title: string, description: string, keywords: string, snippet: string, url: string, image_url: string, language: string, published_at: string, source: string, relevant_score: string, entities: list[Entities], similar ) -> None:
        self.uuid = uuid
        self.title = title
        self.description = description
        self.keywords = keywords
        self.snippet = snippet
        self.url = url
        self.image_url = image_url
        self.language = language
        self.published_at = published_at
        self.source = source
        self.evant_score = relevant_score
        self.entities = entities
        self.similar = similar

class News():
    def __init__(self, meta: Meta, data: list[Data]) -> None:
        self.meta = meta
        self.data = data


def getNews(symbol) -> News:
    """
    Get News for Symbol

    :param symbol: Symbol
    """
    conn = http.client.HTTPSConnection('api.marketaux.com')

    params = urllib.parse.urlencode({
        'api_token': 'eZeFoXuWqUq8ks6E0vnSyTmT3tqflTJROQcboLLJ',
        'symbols': symbol,
        'limit': 50,
        'filter_entities': True
        })

    conn.request('GET', '/v1/news/all?{}'.format(params))

    res = conn.getresponse()
    data = res.read()

    data = data.decode('utf-8')

    dataAsDictionary = json.loads(data)

    dataAsObject = namedtupled.map(dataAsDictionary)

    return dataAsObject