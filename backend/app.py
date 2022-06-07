import json
import os
from flask import Flask, request
import finnhub
import pandas as pd
from dotenv import load_dotenv
from flask_cors import CORS
from pymongo import MongoClient
import time

from util.newsApi import getNews

client = finnhub.Client(os.environ['FINNHUB_KEY'])

db_client = MongoClient(os.environ['MONGODB_URI'])

db = db_client.get_default_database()

predictions = db.predictions

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/bars')
def bars():
  """
  Get Stock Bars

  :param str stock: Stock Symbol
  :param str timeframe: Timeframe e.g. 1, 5, 15, 30, 60, D, W, M
  :param str from: Start Date as unix timestamp
  :param str to: End Date as unix timestamp

  :return: a json Array of bars of the provided stock with the provided timeframe within the provided range

  :example: `[{"open":296.27,"high":327.85,"low":292.75,"close":309.51,"volume":735487816,"trade_count":6103173,"vwap":312.244305}]`
  """
  symbol = request.args.get('symbol')

  if symbol is None:
    return {"error": "No symbol provided"}, 400

  timeframe = request.args.get('timeframe', 'D')
  fromTimestamp = request.args.get('from', "1609459200")
  toTimestamp = request.args.get('to', "1640908800")
  res = client.stock_candles(symbol, timeframe, fromTimestamp, toTimestamp)

  if (res['s'] == "no_data"):
    return {"error": "No data available"}, 404
    
  df = pd.DataFrame(res).to_json(orient="records")
  return df


@app.route('/sentiment')
def sentiment():
  """
  Get Stock Sentiment

  :param str stock: Stock Symbol

  :return: a json Object with the sentiment of the provided stock

  :example: `{"averageSentiment": 0.3107}`
  """
  counter = 0
  sumOfSentiment = 0.0
  symbol = request.args.get('symbol')

  if symbol is None:
    return {"error": "No symbol provided"}, 400

  news = getNews(symbol)

  if hasattr(news, "error"):
    return {"error": "Quota reached"}, 429

  for data in news.data:
    dataAvgSen = 0.0
    dataAvgSenLen = 0
    for entity in data.entities:
      if entity.sentiment_score is not None:
        # calculate average sentiment per stock
        sumOfSentiment += entity.sentiment_score;
        counter +=1
        # calculate average sentiment per article
        dataAvgSen += entity.sentiment_score;
        dataAvgSenLen +=1
    if dataAvgSenLen > 0:
      data.avg_sentiment = round(dataAvgSen / dataAvgSenLen, 4)
    else:
      data.avg_sentiment = 0.0


  if counter == 0:
    return {"averageSentiment": None, "data": []}

  averageSentiment = round(sumOfSentiment / counter, 4)

  timestamp = int(time.time())
  predictions.insert_one({"symbol": symbol, "timestamp": timestamp, "sentiment": averageSentiment})

  return {"averageSentiment": averageSentiment, "data": news.data}


@app.route('/symbols')
def symbols():
  """
  Get Stock Symbols

  :return: a json Array of all available stock symbols

  :example: `[{"currency": "USD", "description": "AP ACQUISITION CORP", "displaySymbol": "APCA.U", "figi": "BBG013VVN389", "isin": null, "mic": "XNYS", "shareClassFIGI": "BBG013VVN469", "symbol": "APCA.U", "symbol2": "", "type": "Unit"}]`
  """
  return json.dumps(client.stock_symbols('US'));

@app.route('/company')
def company():
  """
  Get Company Profile

  :param symbol: Symbol of the stock

  :example: `{"country": "US", "currency": "USD", "exchange": "NASDAQ NMS - GLOBAL MARKET", "finnhubIndustry": "Technology", "ipo": "1980-12-12", "logo": "https://static.finnhub.io/logo/87cb30d8-80df-11ea-8951-00000000092a.png", "marketCapitalization": 2252815.365127294, "name": "Apple Inc", "phone": "14089961010.0", "shareOutstanding": 16185.2, "ticker": "AAPL", "weburl": "https://www.apple.com/"}`
  """
  symbol = request.args.get("symbol")

  if symbol is None:
    return {"error": "No symbol provided"}, 400

  return json.dumps(client.company_profile2(symbol=symbol));

@app.route('/sentiments')
def sentiments():
  """
  Get Previous Sentiments

  :param symbol: Symbol of the stock

  :example: `[{"symbol": "TSLA", "timestamp": 1653579219, "sentiment": 0.437}]`
  """
  symbol = request.args.get("symbol")

  if symbol is None:
    return {"error": "No symbol provided"}, 400

  result = [x for x in predictions.find({"symbol": symbol}, projection={"_id": False})]
  return json.dumps(result)
