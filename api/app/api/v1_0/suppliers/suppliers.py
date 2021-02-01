from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from .provider import Provider
from . import suppliers_api
from ....errors import  no_json_error, missing_param_error, response_error
from flask import request, jsonify

class Suppliers(MethodView):
	@jwt_required
	def post(self):
		gid = get_jwt_identity()
		status,suppliers = Provider.find_suppliers(gid)
		#Check if not an empty list
		if not status:
			if suppliers:
				return jsonify({'error':'Error','msg':suppliers}), 404
			return jsonify({'error':'Error','msg':'No suppliers found!'}), 404
		return jsonify({'entities':suppliers}) , 200
	
	@jwt_required
	def get(self):
		gid = get_jwt_identity()
		status,suppliers = Provider.find_suppliers(gid)
		#Check if not an empty list
		if not status:
			if suppliers:
				return jsonify({'error':'Error','msg':suppliers}), 404
			return jsonify({'error':'Error','msg':'No suppliers found!'}), 404
		return jsonify({'entities':suppliers, 'totalCount': len(p)}) , 200


suppliers_api.add_url_rule('/find', view_func=Suppliers.as_view('suppliers_api'))


class supplier(MethodView):
	#to create a new supplier
	@jwt_required
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		#print(request.json)
		#return 'ab oik h'
		fname = str(request.json.get('firstName', None))
		lname = str(request.json.get('lastName', None))
		phone = str(request.json.get('phone', None))
		address = str(request.json.get('address', None))
		password = str(request.json.get('password', None))
		gid = get_jwt_identity()
		#TODO:// use this type property to determine if the user is individual or business
		hen_id = request.json.get('hen_id', None)
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
		if not hen_id:
			return missing_param_error('Hen'), 400
		#TODO://check if the phone is already in db , 
		#if so check if user for the phone is already a supplier ,
		# if yes return error else add the supplier
		#return success
		status,user  = Provider.create_new_supplier(first_name=fname,last_name=lname,phone=phone,address=address,password=password,hen_id=hen_id,gid=gid)
		if not status:
			if user:
				print('status',status,user)	
				return response_error (title='Request Failed',msg=user), 400
			return response_error (title='Request Failed',msg='There was some problem creating the supplier, please check all fields!'), 400
		return {'supplier':user.json()} , 200

suppliers_api.add_url_rule('/new',view_func=supplier.as_view('supplier_api'))
