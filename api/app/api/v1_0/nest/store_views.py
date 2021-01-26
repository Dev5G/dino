from flask import jsonify, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from ....models import Nest
from ....errors import no_json_error,missing_param_error
from ....utils import jsonList
from . import nest_api
from .provider import Provider, UserProvider
from .utils import sign_cloudinary

class sign_cloudinary(MethodView):
	@jwt_required
	def get(self):
		gid = get_jwt_identity()
		u = UserProvider.find_user_by_gid(gid)
		if not u:
		    return {'error': 'No User found','msg':'You are either not authorized or have no permissions to perform that task'}
		signature, args = sign_cloudinary(u.nest.id)
		return jsonify({'signature': signature, 'args': args}), 200 


nest_api.add_url_rule('/sign-cloudinary', view_func=sign_cloudinary.as_view('sign_cloudinary_api'))


class get_product_code(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		id = request.json.get('id', None)
		if not id:
			return missing_param_error('Category id'), 400
		gid = get_jwt_identity()
		r = Provider.get_product_code(gid,id)
		if not r:
		    return {'error': 'No code found','msg':'Please add category before adding any products!'}
		return r, 200


nest_api.add_url_rule('/generate-product-code', view_func=get_product_code.as_view('get_product_code_api'))


class get_ratti_methods(MethodView):
	@jwt_required
	def get(self):
		gid = get_jwt_identity()
		r = Provider.get_ratti_methods(gid)
		if not r:
		    return {'error': 'No ratti methods found','msg':'Please add ratti methods before adding any products!'}
		return r, 200


nest_api.add_url_rule('/ratti-methods', view_func=get_ratti_methods.as_view('get_ratti_methods_api'))


class get_metals(MethodView):
	@jwt_required
	def get(self):
		metals = Provider.get_metals()
		if not metals:
		    return {'error': 'No metals found','msg':'Please add metals before adding any products!'}
		return metals, 200


nest_api.add_url_rule('/metals', view_func=get_metals.as_view('get_metals_api'))


#nestss
class get_nests(MethodView):
	@jwt_required
	def get(self):
		l = jsonList(Nest.find_all())
		return jsonify(l), 200


nest_api.add_url_rule('/get', view_func=get_nests.as_view('get_nests_api'))


class get_categories(MethodView):
	@jwt_required
	def get(self):
		return Provider.get_categories() 


nest_api.add_url_rule('/categories', view_func=get_categories.as_view('get_categories_api'))


class get_carats(MethodView):
	@jwt_required
	def get(self):
		return Provider.get_carats() 


nest_api.add_url_rule('/carats', view_func=get_carats.as_view('get_carats_api'))