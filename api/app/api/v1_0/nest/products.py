from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from .provider import ProductProvider 
from ....errors import  no_json_error, missing_param_error, response_error
from . import nest_api
from flask import request, jsonify

from ....models import Product
class products(MethodView):
	@jwt_required
	def post(self):
		gid  = get_jwt_identity()
		p = ProductProvider.get_products(gid)
		
		if not p:
			return jsonify({'entities':None, 'totalCount' : 0}), 200
		return jsonify({'entities':p, 'totalCount' : len(p)}) , 200

nest_api.add_url_rule('/products', view_func=products.as_view('products_api'))


class create_product(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		#add validations 
		gid = get_jwt_identity()
		p = ProductProvider.save_product(gid=gid,**request.json)
		if not p:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		return jsonify({'product':p.json()}), 200


nest_api.add_url_rule('/product', view_func=create_product.as_view('create_product_api'))


class edit_product(MethodView):
	@jwt_required
	def put(self, id):
		if not request.is_json:
			return no_json_error(), 400
		#add validations 
		gid = get_jwt_identity()
		p = ProductProvider.update_product(gid=gid,**request.json)
		if not p:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		return jsonify({'product':p.json()}), 200

	@jwt_required
	def get(self, id):
		#add validations 
		gid = get_jwt_identity()
		p = ProductProvider.find_product(identity=gid,id=id)
		if not p:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		return jsonify({'product':p.toJson()}), 200

nest_api.add_url_rule('/product/<id>', view_func=edit_product.as_view('edit_product_api'))

class product_by_code(MethodView):
	"""Find product by product code
	"""
	@jwt_required
	def put(self, product_code):
		if not request.is_json:
			return no_json_error(), 400
		#add validations 
		gid = get_jwt_identity()
		p = ProductProvider.update_product(gid=gid,**request.json)
		if not p:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		return jsonify({'product':p.json()}), 200

	@jwt_required
	def get(self, product_code):
		#add validations 
		gid = get_jwt_identity()
		p = ProductProvider.find_product_by_code(identity=gid,code=product_code)
		if not p:
		    return response_error(title='Error accured',msg='Could not find the product: Error#2588'), 400
		return jsonify({'product':p.toJson()}), 200

nest_api.add_url_rule('/product/by/code/<product_code>', view_func=product_by_code.as_view('product_by_code_api'))

