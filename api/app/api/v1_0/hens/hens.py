from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from .provider import Provider 
from ....errors import  no_json_error, missing_param_error, response_error
from flask import request, jsonify
from . import hens_api

class all_hens(MethodView):
	@jwt_required
	def post(self):
		gid  = get_jwt_identity()
		status,p = Provider.find_all_hens(gid)
		if not status:
			if	p:
				return {'error': 'Error','msg':p}, 400
			return jsonify({'error':'Error','msg':'This farm needs a few hens!'}), 404
		return jsonify({'entities':p}) , 200

hens_api.add_url_rule('/find', view_func=all_hens.as_view('all_hens_api'))

class add_hen(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		cash = request.json.pop('opening_cash', 0)
		gold = request.json.pop('opening_gold', 0)
		gold24 = request.json.pop('opening_gold24',0)
		name = request.json.pop('name','No name')
		gid  = get_jwt_identity()
		status,p = Provider.add_hen(gid,
					   opening_cash=cash,
					   opening_gold=gold,
					   opening_gold24=gold24,
					   name=name)
		if not status:
			if	p:
				return response_error(title='Error', msg=p), 400
			return response_error(title='Error accured',msg='There was a problem creating the counter'), 400
		return jsonify({'counter':p.json()}) , 200

hens_api.add_url_rule('/new', view_func=add_hen.as_view('add_hen_api'))


class search_accounts(MethodView):
	@jwt_required
	def get(self):
		args = request.args
		by = args.get('by',None)
		joined = args.get('joined',None)
		limit = args.get('limit',None)
		value = args.get('v',None)
		gid  = get_jwt_identity()
		status, hen_accounts = None,None
		if not by:
			return {'msg':'No search field specified!'} , 400
		if not id:
				return {'msg':'Value paramter "v" is required!'} , 400
		status,hen_accounts = Provider.find_hen_accounts(gid=gid
														,value=value,joined=joined,limit=limit,by=by)
		print('Accounts',hen_accounts)
		if not status:
			if hen_accounts:
				return {'msg':hen_accounts} , 400
			return {'msg':'Accounts not found!'}, 404
		print('acount found', hen_accounts)
		return jsonify({'accounts':hen_accounts}) , 200

hens_api.add_url_rule('/search/accounts', view_func=search_accounts.as_view('search_hen_accounts_api'))
