from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from .provider import CustomerProvider 
from ....errors import  no_json_error, missing_param_error, response_error
from . import nest_api
from flask import request, jsonify

class Customers(MethodView):
	@jwt_required
	def post(self):
		gid = get_jwt_identity()
		customers = CustomerProvider.find_customers(gid)
		#Check if not an empty list
		if not customers:
		    return jsonify({'entities':None, 'totalCount' : 0}), 200
		return jsonify({'entities':customers, 'totalCount': len(customers)}) , 200
	
	@jwt_required
	def get(self):
		gid = get_jwt_identity()
		customers = CustomerProvider.find_customers(gid)
		#Check if not an empty list
		if not customers:
		    return jsonify({'entities':None, 'totalCount' : 0}), 200
		return jsonify({'entities':customers, 'totalCount': len(customers)}) , 200
	

nest_api.add_url_rule('/customers', view_func=Customers.as_view('customers_api'))


class Customer(MethodView):
	#to create a new supplier
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		fname = str(request.json.get('firstName', None))
		lname = str(request.json.get('lastName', None))
		phone = str(request.json.get('phone', None))
		address = str(request.json.get('address', None))
		password = str(request.json.get('password', None))
		identity = get_jwt_identity()
		#TODO:// use this type property to determine if the user is individual or business
		type = request.json.get('type', None)
		if not fname:
			return missing_param_error('First Name'), 400
		if not lname:
			return missing_param_error('Last Name'), 400
		if not phone:
			return missing_param_error('Phone'), 400
		if not address:
			return missing_param_error('Address'), 400
		if not password:
			return missing_param_error('Passowrd'), 400
		#TODO://check if the phone is already in db , 
		#if so check if user for the phone is already a supplier ,
		# if yes return error else add the supplier
		#return success
		user  = CustomerProvider.create_new_customer(fname=fname,lname=lname,phone=phone,address=address,password=password,identity=identity)
		if not user:
			return {'customer':None} , 200
		return {'customer':user.json()} , 200


nest_api.add_url_rule('/customer',view_func=Customer.as_view('customer_api'))
