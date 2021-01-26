from . import admin
from .forms import SearchProductBox, SaleForm, AddProductForm, SaleEditForm
from flask import render_template, redirect, url_for, request, make_response
from app.decorators import t1_required
from flask_login import current_user
from app.models import Store, Product, ProductImages, Category , Carat , User, Metal, RattiMethod, Sales , VoucherType, GoldRate, SalesDetails, SplitSale, Orders, Balance, Accounts, Counters, SalesReturns
from app.utils import save_image, generate_invoice_no


@admin.route('/sale/add', methods=['GET', 'POST'])
@t1_required
def add_sale():
	title = 'POS :: Gold sale'
	args = request.args
	sform = SearchProductBox()
	saleForm = SaleForm()
	pform = AddProductForm()
	
	store = Store.find_by_uuid(current_user.store_id)
	gr = GoldRate.get_today(store.uuid)
	if gr:
		goldrate= round(gr.value / 11.664)
	else:
		goldrate= 0
	saleForm.goldrate.data= goldrate
	#choices for saleForm
	choices =  [(None,'-----')]
	saleForm.customer.choices = choices + [(str(s.uuid), s.username) for s in store.customers.all()]
	saleForm.care_of.choices = choices + [(str(s.uuid), s.username) for s in store.customers.all()]
	saleForm.salesman.choices = choices + [(str(s.uuid), s.username) for s in store.salesmen.all()]
	saleForm.counter.choices = choices + [(str(c.uuid), c.name) for c in Counters.find_all_by_store(store.uuid)]
	saleForm.cash_account.choices = choices + [(str(a.uuid), a.title) for a in Accounts.CashOrBankAccounts(current_user.store_id)] 
	if request.method == 'POST':
		if sform.validate_on_submit():
			product = Product.find_by_code_and_store(code=sform.code_input.data,store_id=current_user.store_id)
			if product:
				return product.json(), 201
			else:
				return {'message' : f'Product could not be found.'}, 400
		if saleForm.validate_on_submit():
			#create sale  
			if not gr:
				return {'msg':f'Cannot save sale without gold rate'}, 400
			sale = Sales(customer_id=saleForm.customer.data,
							gold_rate_id=gr.uuid,
							salesman_id=saleForm.salesman.data,
							cash_account_id=saleForm.cash_account.data,
							care_of_id=saleForm.care_of.data,
							counter_id=saleForm.counter.data,
							description=saleForm.desc.data,
							total_amount=saleForm.total.data,
							grand_amount=saleForm.grand.data,
							discount_amount=saleForm.discount.data,
							balance_amount=saleForm.balance.data,
							user_id=current_user.uuid,
							store_id=current_user.store_id)
			sale_is_valid = 0
			has_errors = 0
			if sale.save_to_db():
				for d in saleForm.product_details.data:
					p = Product.find_by_uuid_and_store(_uuid=d['product_id'],_store_id=current_user.store_id)
					if p:
						sale_is_valid += 1
						sd =	SalesDetails(product_id=d['product_id'],sale_id=sale.uuid,gross_amount=d['gross'],net_amount=d['net']) 
						sd.save_to_db()
						if  d['is_split']:
							split_s = SplitSale(weight=d['weight'],split_weight=(float(p.weight) - float(d['weight'])),sale_detail_id=sd.uuid)
							split_s.save_to_db()
						if d['is_order']:
							o = Orders(sale_detail_id=sd.uuid)
							o.save_to_db()
					else:
						has_errors += 1
				#check if sale is valid
				if sale_is_valid > 0:
					#if has balance , add to balance table.
					#sale.add_related_values()
					if saleForm.balance.data > 0:
						balance = Balance(sale_id=sale.id,cr_amount=saleForm.balance.data)
						balance.save_to_db()
					#check if has errors
					if has_errors > 0:
						return {'msg' : f'One or more products couldn\'t be sold.'}, 400
					return {'msg' : f'Transaction successful.'}, 201
				else:
					sale.delete_form_db()
					return {'msg' : f'Can not save sale, the product code or the sale was intrupted while processing.'}, 400
				return 'Okay-'
		return 'Form submition error - 505'
	if request.method == 'GET':
		return render_template('admin/pos/add_sale.html', title=title, sform=sform, saleform=saleForm, pform=pform)

@admin.route('/sale/edit', methods=['GET', 'POST'])
@t1_required
def edit_sale():
	title = 'POS :: Gold sale - edit'
	
	sform = SearchProductBox()
	saleForm = SaleEditForm()
	pform = AddProductForm()
	
	store = Store.find_by_uuid(current_user.store_id)
	gr = GoldRate.get_today(store.uuid)
	if gr:
		goldrate= round(gr.value / 11.664)
	else:
		goldrate= 0
	saleForm.goldrate.data= goldrate
	#choices for saleForm
	choices =  [(None,'-----')]
	saleForm.customer.choices = choices + [(str(s.uuid), s.username) for s in store.customers.all()]
	
	saleForm.care_of.choices = choices + [(str(s.uuid), s.username) for s in store.customers.all()]
	saleForm.salesman.choices = choices + [(str(s.uuid), s.username) for s in store.salesmen.all()]
	saleForm.counter.choices = choices + [(str(c.uuid), c.name) for c in Counters.find_all_by_store(store.uuid)]
	saleForm.cash_account.choices = choices + [(str(a.uuid), a.title) for a in Accounts.CashOrBankAccounts(current_user.store_id)] 
	if request.method == 'POST':
		if sform.validate_on_submit():
			product = Product.find_by_code_and_store(code=sform.code_input.data,store_id=current_user.store_id)
			if product:
				return product.json(), 201
			else:
				return {'message' : f'Product could not be found.'}, 400
		
		if saleForm.validate_on_submit():
			#create sale  
			if not gr:
				return {'msg':f'Cannot save sale without gold rate'}, 400
			sale = Sales(customer_id=saleForm.customer.data,
							gold_rate_id=gr.uuid,
							salesman_id=saleForm.salesman.data,
							cash_account_id=saleForm.cash_account.data,
							care_of_id=saleForm.care_of.data,
							counter_id=saleForm.counter.data,
							description=saleForm.desc.data,
							total_amount=saleForm.total.data,
							grand_amount=saleForm.grand.data,
							discount_amount=saleForm.discount.data,
							balance_amount=saleForm.balance.data,
							user_id=current_user.uuid,
							store_id=current_user.store_id)
			sale_is_valid = 0
			has_errors = 0
			if sale.save_to_db():
				for d in saleForm.product_details.data:
					p = Product.find_by_uuid_and_store(_uuid=d['product_id'],_store_id=current_user.store_id)
					if p:
						sale_is_valid += 1
						sd =	SalesDetails(product_id=d['product_id'],sale_id=sale.uuid,gross_amount=d['gross'],net_amount=d['net']) 
						sd.save_to_db()
						if  d['is_split']:
							split_s = SplitSale(weight=d['weight'],split_weight=(float(p.weight) - float(d['weight'])),sale_detail_id=sd.uuid)
							split_s.save_to_db()
						if d['is_order']:
							o = Orders(sale_detail_id=sd.uuid)
							o.save_to_db()
					else:
						has_errors += 1
				#check if sale is valid
				if sale_is_valid > 0:
					#if has balance , add to balance table.
					#sale.add_related_values()
					if saleForm.balance.data > 0:
						balance = Balance(sale_id=sale.id,cr_amount=saleForm.balance.data)
						balance.save_to_db()
					#check if has errors
					if has_errors > 0:
						return {'msg' : f'One or more products couldn\'t be sold.'}, 400
					return {'msg' : f'Transaction successful.'}, 201
				else:
					sale.delete_form_db()
					return {'msg' : f'Can not save sale, the product code or the sale was intrupted while processing.'}, 400
				return 'Okay-'
		return 'Form submition error - 505'
	if request.method == 'GET':
		args = request.args
		if 'id' in args:
			id = args.get('id')
			saleForm.sale_id.data = id
		return render_template('admin/pos/edit_sale.html', title=title, sform=sform, saleform=saleForm, pform=pform)


@admin.route('/sales/view', methods=['GET', 'POST'])
@t1_required
def view_sales():
	title = 'View Sales'
	args = request.args
	store = Store.find_by_uuid(current_user.store_id)
	sales = Sales.find_all(current_user.store_id)
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.add_supplier')))
		#--------------------Delete
		if 'id' in args and args.get('method') == 'delete':
			product = Product.find_by_uuid(args.get('id'))
			if product:
				if product.store_id != current_user.store_id:
					abort(403)
				else:
					if product.delete_form_db():
						flash('Stone deleted successfuly.','success')
						return resp
					else:
						flash('Error: Could not delete Stone.(Error code: EC50-D-78)','danger')
						return resp
			flash('The Stone you tried to delete does not exist.','danger')
			return resp
		#if form.validate_on_submit():
		#	if Store.add_supplier(user_id=form.user_id.data,store_id=current_user.store_id):
		#		return {'message' : f'Supplier added successfuly.'}, 201
		#	else:
		#		return {'message' : f'Supplier could not be added.'}, 400
	if request.method == 'GET':
		return render_template('admin/pos/view_sales.html', title=title, sales=sales)

@admin.route('/sale/return', methods=['POST'])
@t1_required
def sale_return():
	json = request.json
	if 'sale_id' in json:
		id =  json.get('sale_id')
		if not SalesReturns.find_by_sale(id):
			sd = SalesDetails.find_by_sale(id)
			has_errors = 0
			if sd:
				sr = SalesReturns(sale_id=id)
				for x in sd:
					if not x.delete_from_db():
						has_errors += 1
				sr.save_to_db()
				if has_errors > 0:
					return {'msg':f'Sale returned with some errors ({has_errors})!'} , 400
				else:
					return {'msg':'Sale returned successfuly!'}, 201
			else:
				return {'msg':'There was a problem processing sale return'}, 400
