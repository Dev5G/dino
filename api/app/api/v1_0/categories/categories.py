from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from .provider import Provider 
from ....errors import  no_json_error, missing_param_error, response_error
from flask import request, jsonify
from . import categories_api

class Categories(MethodView):
	@jwt_required
	def post(self):
		gid  = get_jwt_identity()
		status,p = Provider.find_all(gid)
		if not status:
			return jsonify({'entities':None}), 404
		return jsonify({'entities':p}) , 200

categories_api.add_url_rule('/find', view_func=Categories.as_view('categories_api'))

class add_category(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		name = request.json.pop('name', None)
		abr = request.json.pop('abr', None)
		gid  = get_jwt_identity()
		status , p = Provider.add_category(gid,
					   name=name,
					   abr=abr)
		if not status:
			if	p:
				return response_error(title='Error accured',msg=p), 400
			return response_error(title='Error accured',msg='There was a problem creating the category'), 400
		return jsonify({'category':p.json()}) , 200

categories_api.add_url_rule('/new', view_func=add_category.as_view('add_category_api'))
	