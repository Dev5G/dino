from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from ....errors import  no_json_error, missing_param_error, response_error
from . import sales_api	
from .provider import Provider
from flask import request, jsonify
#from .provider import Provider


class Sales(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		gid  = get_jwt_identity()
		query = request.json.get('queryParams',None)
		#status,p = Provider.find_products(gid,query)
		status,p=None, None
		if not status:
			return jsonify({'title':'Got nothing!','msg':'Oops! You need to add some products!'}), 404
		return jsonify(p) , 200

sales_api.add_url_rule('/find', view_func=Sales.as_view('sales_api'))

class Search(MethodView):
	@jwt_required
	def get(self):
		args = request.args
		by = args.get('by',None)
		joined = args.get('joined',None)
		value = args.get('v',None)
		gid  = get_jwt_identity()
		p = None
		if not by:
			return {'msg':'No search field specified!'} , 400
		if not id:
				return {'msg':'Value paramter "v" is required!'} , 400
		if by == 'id':
			status,p = None,None#Provider.find_product(gid,value)
			if not status:
				return {'msg':'Product not found!'}, 404
		if by == 'code':
			status,p = None,None#Provider.find_product_by_code(gid,value)
			if not status:
				return {'msg':'Product not found!'}, 404
		if joined:
			return jsonify({'product':p.json()}) , 200
		return jsonify({'product':p.toJson()}) , 200

sales_api.add_url_rule('/search', view_func=Search.as_view('sales_search_api'))


class Create_sale(MethodView):
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		#add validations 
		gid = get_jwt_identity()
		jsn = request.json
		customer_id = jsn.get('customer_id', None)
		salesman_id = jsn.get('salesman_id',None)
		cash_account_id = jsn.get('cash_account_id',None)
		care_of_id = jsn.get('care_of_id',None)
		hen_id = jsn.get('hen_id',None)
		description = jsn.get('description',None)
		total_amount = jsn.get('total_amount',None)
		net_amount = jsn.get('net_amount',None)
		discount_amount = jsn.get('discount_amount',None)
		balance_amount = jsn.get('balance_amount',None)
		products = jsn.get('products',None)
		if products:
				status, sale = Provider.add_sale(gid=gid,customer_id=customer_id,
							   salesman_id=salesman_id,
							   cash_account_id=cash_account_id,
							   care_of_id=care_of_id,
							   hen_id=hen_id,
							   description=description,
							   total_amount=total_amount,
							   net_amount=net_amount,
							   discount_amount=discount_amount,
							   balance_amount=balance_amount,
							   products=products
							   )
		status,p = None, None#Provider.save_product(gid=gid,**request.json)
		try:
			from ..categories.provider import Provider as Category
		except Exception as e:
			print(str(e))
		if not status:
		    return response_error(title='Error accured',msg='There was a problem creating the product'), 400
		status,c = Category.find_by_id(p.category_id)
		return jsonify({'product':p.json(),'category': c.json()}), 200

sales_api.add_url_rule('/new', view_func=Create_sale.as_view('create_product_api'))


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

