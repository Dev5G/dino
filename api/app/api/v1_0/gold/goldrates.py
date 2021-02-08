from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from .provider import GoldrateProvider 
from ....errors import  no_json_error, missing_param_error, response_error
from . import gold_api
from flask import request, jsonify

class Goldrates(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		#filter  daily (7days), weekly(last 4weeks), monthly(last 12 months) or yearly(last7years)
		filter = request.json.get('filter', None)
		nest_filter = request.json.get('nest_filter', False)
		gid = get_jwt_identity() if nest_filter else None
		g = GoldrateProvider.find_goldrates_filtered(gid,filter)
		#Check if not an empty list
		if not g:
		    return jsonify({'rates':None, 'totalCount' : 0}), 200
		return jsonify({'rates':g, 'totalCount': len(g),'gid': gid}) , 200
	
	@jwt_required
	def get(self):
		gid = get_jwt_identity()
		g = GoldrateProvider.find_goldrates(gid)
		#Check if not an empty list
		if not g:
		    return jsonify({'entities':None, 'totalCount' : 0}), 200
		return jsonify({'entities':g, 'totalCount': len(g)}) , 200


gold_api.add_url_rule('/goldrates', view_func=Goldrates.as_view('goldrates_api'))


class Goldrate(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		goldrate = str(request.json.get('goldrate', None))
		goldrate24k = str(request.json.get('goldrate24k', None))
		identity = get_jwt_identity()
		#TODO:// use this type property to determine if the user is individual or business
		if not goldrate:
			return missing_param_error('Goldrate'), 400
		if not goldrate24k:
			return missing_param_error('Goldrate 24k'), 400
		#TODO://check if the phone is already in db , 
		#if so check if user for the phone is already a supplier ,
		# if yes return error else add the supplier
		#return success
		g  = GoldrateProvider.add_new_rate(rate=goldrate,rate24k=goldrate24k,identity=identity)
		if not g:
			return {'goldrate':None} , 200
		return {'goldrate':g.json()} , 200

	@jwt_required
	def get(self):
		identity = get_jwt_identity()
		g  = GoldrateProvider.find_goldrate_today(identity=identity)
		if not g:
			return {'goldrate':None } , 200
		return {'goldrate':g.json()} , 200

gold_api.add_url_rule('/goldrate',view_func=Goldrate.as_view('goldrate_api'))
