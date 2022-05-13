import json
import os
from flask import Flask, request
import finnhub
import pandas as pd
from dotenv import load_dotenv
from flask_cors import CORS

client = finnhub.Client(os.environ['FINNHUB_KEY'])

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/bars')
def bars():
  """
  Get Stock Bars

  :param str stock: Stock Symbol
  :param str timeframe: Timeframe e.g. 1, 5, 15, 30, 60, D, W, M
  :param str start: Start Date
  :param str end: End Date

  :return: a json Array of the provided stock with the provided timeframe within the provided range

  :example: `[{"open":296.27,"high":327.85,"low":292.75,"close":309.51,"volume":735487816,"trade_count":6103173,"vwap":312.244305}]`
  """
  symbol = request.args.get('symbol')
  if (symbol is None): 
    return {"error": "No symbol provided"}, 400
  timeframe = request.args.get('timeframe', 'D')
  fromTimestamp = request.args.get('from', "1609459200")
  toTimestamp = request.args.get('to', "1640908800")
  res = client.stock_candles(symbol, timeframe, fromTimestamp, toTimestamp)
  if (res['s'] == "no_data"):
    return {"error": "No data available"}, 404
  df = pd.DataFrame(res).to_json(orient="records")
  return df


@app.route('/symbols')
def symbols():
  return json.dumps(client.stock_symbols('US'));