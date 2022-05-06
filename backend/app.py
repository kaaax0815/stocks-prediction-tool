import json
from flask import Flask, request
from dotenv import load_dotenv
from alpaca_trade_api.rest import REST, TimeFrame
import plotly.graph_objects as go
from flask_cors import CORS

api = REST()

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/bars')
def bars():
  """
  Get Stock Bars

  :param str stock: Stock Symbol
  :param str timeframe: Timeframe e.g. Minute, Hour, Day, Week, Month, Year
  :param str start: Start Date
  :param str end: End Date

  :return: a json Array of the provided stock with the provided timeframe within the provided range

  :example: `[{"open":296.27,"high":327.85,"low":292.75,"close":309.51,"volume":735487816,"trade_count":6103173,"vwap":312.244305}]`
  """
  stock = request.args.get('stock')
  timeframe = request.args.get('timeframe', 'Day')
  start = request.args.get('start', '2021-01-01')
  end = request.args.get('end', '2021-12-31')
  bars = api.get_bars(stock, TimeFrame.__dict__[timeframe], start, end).df
  return bars.to_json(orient='records')
