from flask import jsonify, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from ....errors import  no_json_error, missing_param_error,response_error
from . import gold_api
from .provider import RatesProvider, Provider

class gold_purchases(MethodView):
	@jwt_required
	def get(self):
		gid = get_jwt_identity()
		gps = Provider.find_gold_purchases(gid)
		if not gps:
		    return jsonify({'entities':None, 'totalCount': 0, 'errorMsg': 'No gold purchases found!'})
		return jsonify({'entities':gps, 'totalCount': len(gps)})

gold_api.add_url_rule('/purchases',view_func=gold_purchases.as_view('gold_purchases_api'))

class gold_purchase(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		gid = get_jwt_identity()
		gp = Provider.add_gold_purchase(gid=gid,**request.json)
		if not gp:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		return jsonify({'gold_purchase':gp.json()}), 200

gold_api.add_url_rule('/purchase',view_func=gold_purchase.as_view('gold_purchase_api'))


class get_goldrates(MethodView):
	def get(self):
		return jsonify({'rates': RatesProvider.get_all_rates_today()})

gold_api.add_url_rule('/gold-rates',view_func=get_goldrates.as_view('get_goldrates'))