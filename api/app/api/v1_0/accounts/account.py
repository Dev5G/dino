from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from ....errors import  no_json_error, missing_param_error, response_error
from . import accounts_api	
from .accounts import Accounts
from flask import request, jsonify


class Search(MethodView):
	@jwt_required
	def get(self):
		args = request.args
		by = args.get('by',None)
		joined = args.get('joined',None)
		value = args.get('v',None)
		gid  = get_jwt_identity()
		a = None
		if not by:
			return {'msg':'No search field specified!'} , 400
		if not id:
				return {'msg':'Value paramter "v" is required!'} , 400
		if by == 'id':
			status,a = Accounts.fin(gid,value)
			if not status:
				return {'msg':'Product not found!'}, 404
		if by == 'code':
			status,a = None,None#Provider.find_product_by_code(gid,value)
			if not status:
				return {'msg':'Product not found!'}, 404
		if joined:
			return jsonify({'product':p.json()}) , 200
		return jsonify({'product':p.toJson()}) , 200

accounts_api.add_url_rule('/search', view_func=Search.as_view('accounts_search_api'))
