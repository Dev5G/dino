from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from ....errors import  no_json_error, missing_param_error, response_error
from . import products_api	
from flask import request, jsonify
from .provider import Provider


class products(MethodView):
	@jwt_required
	def post(self):
		gid  = get_jwt_identity()
		status,p = Provider.find_products(gid)
		if not status:
			return jsonify({'title':'Got nothing!','msg':'Oops! You need to add some products!'}), 404
		return jsonify({'entities':p}) , 200

products_api.add_url_rule('/find', view_func=products.as_view('products_api'))


class create_product(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		#add validations 
		gid = get_jwt_identity()
		status,p = Provider.save_product(gid=gid,**request.json)
		try:
			from ..categories.provider import Provider as Category
		except Exception as e:
			print(str(e))
		if not status:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		status,c = Category.find_by_id(p.category_id)
		return jsonify({'product':p.json(),'category': c.json()}), 200

products_api.add_url_rule('/new', view_func=create_product.as_view('create_product_api'))


class edit_product(MethodView):
	@jwt_required
	def delete(self,id):
		gid = get_jwt_identity()
		status,product_code = Provider.delete_product(gid,id)
		if not status:
			return response_error('Product couldn\'t be deleted','Either the product wasn\'t found or you don\'t have enough permissinos'), 400
		return jsonify({'title':'Product trashed','msg':f'Product {product_code} has been moved to trash and will be removed after 3 months!'})

	@jwt_required
	def put(self, id):
		if not request.is_json:
			return no_json_error(), 400
		#add validations 
		gid = get_jwt_identity()
		status,p = Provider.update_product(gid=gid,**request.json)
		if not status:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		return jsonify({'product':p.json()}), 200

	@jwt_required
	def get(self, id):
		gid = get_jwt_identity()
		status,p = Provider.find_product(gid=gid,id=id)
		if not status:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		return jsonify({'product':p.toJson()}), 200

products_api.add_url_rule('/<id>', view_func=edit_product.as_view('edit_product_api'))

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

products_api.add_url_rule('/product/by/code/<product_code>', view_func=product_by_code.as_view('product_by_code_api'))

