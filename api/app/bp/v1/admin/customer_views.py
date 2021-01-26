from . import admin
from .forms import UserForm, AddSupplierForm
from app.utils import generate_username
from flask import render_template, redirect, url_for, request, make_response
from app.decorators import t1_required
from flask_login import current_user
from app.models import User, Store

@admin.route('/customers/add', methods=['GET', 'POST'])
@t1_required
def add_customer():
	title = 'Add customer'
	args = request.args
	form = AddSupplierForm()
	choices =  [('','-----')]
	form.user_id.choices = choices + [(str(s.uuid), s.username) for s in User.find_all()]
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.add_user')))
		print(form.data)
		if form.validate_on_submit():
			if Store.add_customer(user_id=form.user_id.data,store_id=current_user.store_id):
				return {'message' : f'Customer added successfuly.'}, 201
			else:
				return {'message' : f'Customer could not be added.'}, 400
	if request.method == 'GET':
		return render_template('admin/customer/add_customer.html', title=title, form=form)

@admin.route('/customers/view', methods=['GET'])
@t1_required
def view_customers():
	title = 'View users'
	customers = current_user.store.customers.all()
	#form = ProductForm()
	return render_template('admin/customer/view_customers.html', title=title, customers=customers)
