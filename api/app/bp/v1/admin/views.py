from datetime import datetime,date
from flask import render_template, redirect, url_for, request, flash, make_response, jsonify
from . import admin
from .forms import GoldRateForm, CaratsForm, CategoryForm, StoneTypeForm, StoneFrom, ProductForm,SingleStringForm
from app.decorators import store_required, t1_required
from flask_login import login_required, current_user
from app.models import GoldRate, Carat, Category, StoneType, Stone, Metal, Product, User, RattiMethod, Counters
from app.utils import extract_max, save_image

@admin.route('/dashboard', methods=['GET', 'POST'])
@t1_required
def dashboard():
	title = 'Dashboard'
	 #if form.validate_on_submit():
	 # ...
	#    return redirect(url_for('.index'))
	g = GoldRate.get_today(current_user.store_id)
	if g:
		goldrate= (g.value)
	else:
		goldrate= 0
	return render_template('admin/dashboard/index.html', title=title,gold_rate=goldrate, current_time=datetime.utcnow())


@admin.route('/counters', methods=["GET", "POST"])
@t1_required
def counters():
	title = 'Update counter settings'
	args = request.args
	form = SingleStringForm()
	counters = Counters.find_all_by_store(current_user.store_id)
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.counters')))
		#--------------------Delete
		if 'id' in args and args.get('method') == 'delete':
			stone = Stone.find_by_uuid(args.get('id'))
			if stone:
				if stone.store_id != current_user.store_id:
					abort(403)
				else:
					if stone.delete_form_db():
						flash('Stone deleted successfuly.','success')
						return resp
					else:
						flash('Error: Could not delete Stone.(Error code: EC50-D-78)','danger')
						return resp
			flash('The Stone you tried to delete does not exist.','danger')
			return resp
		print(form.data)
		if form.validate_on_submit():
			print(form.data)
			#---------------Update
			if 'id' in args and args.get('method') == 'update':
				stone = Stone.find_by_uuid(args.get('id'))
				if stone:
					if stone.store_id != current_user.store_id:
						abort(403)
					else:
						stone.name = form.name.data
						stone.qty = form.qty.data
						stone.stone_type_id = form.stone_type.data
						stone.rate = form.rate.data
						stone.description = form.desc.data
						stone.published = form.published.data
						if stone.save_to_db():
							flash('Stone updated successfuly.','success')
							return resp
						else:
							flash('Error: Could not update Stone.(Error code: EC50-U-78)','danger')
							return resp
				flash('Stone you tried to updated does not exist.','danger')
				return resp
			#---------------Save
			counter =    Counters.find_by_name_and_store(form.value.data, current_user.store_id)
			if counter:
				return {'msg': f'Counter name "{counter.name}" already exists.'}, 400
			counter = Counters(name=form.value.data,
								published=form.published.data,
								store_id=current_user.store_id)
			if counter.save_to_db():
				return {'msg': f'Counter added successfuly.'}, 201
			else:
				return {'msg': f'Counter could not be added.'}, 400
	if request.method == 'GET':
		if 'id' in args:
			counter = Stone.find_by_uuid(args.get('id'))
			if stone:
				form.name.data = counter.name
				form.published.data = counter.published
	return render_template('admin/settings/counters.html',title=title,counters=counters,form=form)


@admin.route('/stones', methods=["GET", "POST"])
@t1_required
def stones():
	title = 'Update stones'
	args = request.args
	form = StoneFrom()
	stones = Stone.find_all(current_user.store_id)
	choices =  [('','Select stone type')]
	form.stone_type.choices = choices + [(str(x.uuid), x.name) for x in StoneType.find_all(current_user.store_id)]
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.stones')))
		#--------------------Delete
		if 'id' in args and args.get('method') == 'delete':
			stone = Stone.find_by_uuid(args.get('id'))
			if stone:
				if stone.store_id != current_user.store_id:
					abort(403)
				else:
					if stone.delete_form_db():
						flash('Stone deleted successfuly.','success')
						return resp
					else:
						flash('Error: Could not delete Stone.(Error code: EC50-D-78)','danger')
						return resp
			flash('The Stone you tried to delete does not exist.','danger')
			return resp
		if form.validate_on_submit():
			#---------------Update
			if 'id' in args and args.get('method') == 'update':
				stone = Stone.find_by_uuid(args.get('id'))
				if stone:
					if stone.store_id != current_user.store_id:
						abort(403)
					else:
						stone.name = form.name.data
						stone.qty = form.qty.data
						stone.stone_type_id = form.stone_type.data
						stone.rate = form.rate.data
						stone.description = form.desc.data
						stone.published = form.published.data
						if stone.save_to_db():
							flash('Stone updated successfuly.','success')
							return resp
						else:
							flash('Error: Could not update Stone.(Error code: EC50-U-78)','danger')
							return resp
				flash('Stone you tried to updated does not exist.','danger')
				return resp
			#---------------Save
			stone =    Stone.find_by_name_and_store(form.name.data, current_user.store_id)
			if stone:
				flash(f'Stone  "{stone.name}" already exists.','danger')
				return resp
			stone = Stone(name=form.name.data, qty=form.qty.data,
											   rate=form.rate.data, description=form.desc.data,
											   stone_type_id=form.stone_type.data,
											   published=form.published.data,store_id=current_user.store_id)
			if stone.save_to_db():
				flash(f'Stone successfuly created.','success')
				return resp
			else:
				flash('Error: Could not save Stone.(Error code: EC50-S-78)','danger')
				return resp
	if request.method == 'GET':
		stone = None;
		if 'id' in args:
			stone = Stone.find_by_uuid(args.get('id'))
			if stone:
				form.name.data = stone.name
				form.qty.data = stone.qty
				form.stone_type.data = stone.stone_type_id
				form.rate.data = stone.rate
				form.desc.data = stone.description
				form.published.data = stone.published
	return render_template('admin/stones.html',title=title,stones=stones,form=form)

@admin.route('/gold-rates', methods=['GET', 'POST'])
@t1_required
def gold_rate():
	title = 'Update gold rates'
	args = request.args
	form = GoldRateForm()
	gold_rates = GoldRate.find_all(current_user.store.uuid)
	choices = [('','Select carat')]
	form.carat.choices = choices + [(str(x.uuid), x.value) for x in Carat.find_all(current_user.store.uuid)]
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.gold_rate')))
		#--------------------Delete---------------
		if 'id' in args and args.get('method') == 'delete':
			gold_rate = GoldRate.find_by_uuid(args.get('id'))
			if gold_rate:
				if gold_rate.store_id != current_user.store_id:
					abort(403)
				else:
					if gold_rate.delete_form_db():
						return resp
					else:
						flash('Error: Could not delete gold rate.','danger')
						return resp, 200
			flash('The gold rate value you tried to delete does not exist.','danger')
			return resp
		if form.validate_on_submit():
			#---------------Update
			if 'id' in args and args.get('method') == 'update':
				gold_rate = GoldRate.find_by_uuid(args.get('id'))
				if gold_rate:
					if gold_rate.store_id != current_user.store_id:
						abort(403)
					else:
						print('updatingg.....')
						print(gold_rate)
						gold_rate.value = form.value.data
						gold_rate.carat_id = form.carat.data
						gold_rate.published = form.published.data
						if gold_rate.save_to_db():
							flash(f'gold rate updated successfully.','success')
							return resp
						else:
							flash('Error: Could not update gold rate value.','danger')
							return resp
				flash('Gold rate value you tried to updated does not exist.','danger')
				return resp
			#---------------Save
			goldrate = GoldRate.get_by_date(current_user.store.uuid,date.today())
			if goldrate:
				flash(f'Gold rate already saved, please use the update function to update the gold rate.','danger')
				return resp
			gold_rate = GoldRate(value=form.value.data, carat_id=form.carat.data, store_id=current_user.store.uuid, published=form.published.data)
			if gold_rate.save_to_db():
				flash(f'gold rate saved successfully.','success')
				return redirect(url_for('admin.gold_rate')), 201
			flash(f'Could not save gold rate.','danger')
			return resp
	if request.method == 'GET':
		gold_rate = None;
		if 'id' in args:
			gold_rate = GoldRate.find_by_uuid(args.get('id'))
			if gold_rate:
				form.value.data = gold_rate.value
				form.carat.data = gold_rate.value
				form.published.data = gold_rate.published
	return render_template('admin/gold_rates.html', title=title, form=form, gold_rates=gold_rates, current_time=datetime.utcnow())

#This function/Rout is to show "carats" and a form to add/edit
@admin.route('/carats', methods=["GET", "POST"])
@t1_required
def carats():
	title = 'Update carats'
	form = CaratsForm()
	args = request.args
	carats = Carat.find_all(current_user.store.uuid)
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.carats')))
		#--------------------Delete---------------
		if 'id' in args and args.get('method') == 'delete':
			carat = Carat.find_by_uuid(args.get('id'))
			if carat:
				if carat.store_id != current_user.store_id:
					abort(403)
				else:
					if carat.delete_form_db():
						flash('Error: Could not update carat value.','danger')
						return resp, 200
					else:
						flash('Error: Could not delete carat value.','danger')
						return resp
			flash('The carat value you tried to delete does not exist.','danger')
			return resp
		if form.validate_on_submit():
			#---------------Update
			if 'id' in args and args.get('method') == 'update':
				carat = Carat.find_by_uuid(args.get('id'))
				if carat:
					if carat.store_id != current_user.store_id:
						abort(403)
					else:
						carat.value = form.value.data
						carat.published = form.published.data
						if carat.save_to_db():
							flash(f'carat updated successfully.','success')
							return resp, 200
						else:
							flash('Error: Could not update gold rate value.','danger')
							return resp
				flash('Carat value you tried to updated does not exist.','danger')
				return resp
			#---------------Save
			carat = Carat.find_by_value_and_store(value=form.value.data, store_id=current_user.uuid)
			if carat:
				flash(f'Carat value already exits.','danger')
				return resp
			carat = Carat(value=form.value.data,store_id=current_user.store.uuid,published=form.published.data)
			if carat.save_to_db():
				flash(f'carat saved successfully.','success')
				return resp, 201
			flash(f'Could not save carat.','danger')
			return resp
	if request.method == 'GET':
		carat = None;
		if 'id' in args:
			carat = Carat.find_by_uuid(args.get('id'))
			if carat:
				form.value.data = carat.value
				form.published.data = carat.published
	return render_template('admin/carats.html', title=title, form=form, carats=carats, current_time=datetime.utcnow())

#================Category Code: EC*-D+U+S-*
#This function/Rout is to show "categories" and a form to add/edit categories
@admin.route('/categories', methods=["GET", "POST"])
@t1_required
def categories():
	title = 'Update categories'
	args = request.args
	form = CategoryForm()
	categories = Category.find_all(current_user.store_id)
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.categories')))
		#--------------------Delete
		if 'id' in args and args.get('method') == 'delete':
			category = Category.find_by_uuid(args.get('id'))
			if category:
				if category.store_id != current_user.store_id:
					abort(403)
				else:
					if category.delete_form_db():
						flash('Category deleted successfuly.','success')
						return resp
					else:
						flash('Error: Could not delete category.(Error code: EC50-D-78)','danger')
						return resp
			flash('The category you tried to delete does not exist.','danger')
			return resp
		if form.validate_on_submit():
			#---------------Update
			if 'id' in args and args.get('method') == 'update':
				category = Category.find_by_uuid(args.get('id'))
				if category:
					if category.store_id != current_user.store_id:
						abort(403)
					else:
						category.name = form.name.data
						category.abr = form.abr.data
						category.published = form.published.data
						if category.save_to_db():
							flash('Category updated successfuly.','success')
							return resp
						else:
							flash('Error: Could not update category.(Error code: EC50-U-78)','danger')
							return resp
				flash('Category you tried to updated does not exist.','danger')
				return resp
			#---------------Save
			category =    Category.find_by_abr_and_store(form.abr.data, current_user.store_id)
			if category:
				flash(f'Category Abbreviation "{category.abr}" already exists.','danger')
				return resp
			category = Category(name=form.name.data,abr=form.abr.data.upper(),published=form.published.data,store_id=current_user.store_id)
			if category.save_to_db():
				flash(f'Category successfuly created.','success')
				return resp
			else:
				flash('Error: Could not save category.(Error code: EC50-S-78)','danger')
				return resp
	if request.method == 'GET':
		category = None;
		if 'id' in args:
			category = Category.find_by_uuid(args.get('id'))
			if category:
				form.name.data = category.name
				form.abr.data = category.abr
				form.published.data = category.published
		return render_template('admin/categories.html',title=title,categories=categories,form=form)

@admin.route('/stone-types', methods=["GET", "POST"])
@t1_required
def stone_types():
	title = 'Update stone types'
	args = request.args
	form = StoneTypeForm()
	stone_types = StoneType.find_all(current_user.store_id)
	if request.method == 'POST':
		resp = make_response(redirect(url_for('admin.stone_types')))
		#--------------------Delete
		if 'id' in args and args.get('method') == 'delete':
			stone_type = StoneType.find_by_uuid(args.get('id'))
			if stone_type:
				if stone_type.store_id != current_user.store_id:
					abort(403)
				else:
					if stone_type.delete_form_db():
						flash('Stone type deleted successfuly.','success')
						return resp
					else:
						flash('Error: Could not delete Stone type.(Error code: EC50-D-78)','danger')
						return resp
			flash('The Stone type you tried to delete does not exist.','danger')
			return resp
		if form.validate_on_submit():
			#---------------Update
			if 'id' in args and args.get('method') == 'update':
				stone_type = StoneType.find_by_uuid(args.get('id'))
				if stone_type:
					if stone_type.store_id != current_user.store_id:
						abort(403)
					else:
						stone_type.name = form.name.data
						stone_type.published = form.published.data
						if stone_type.save_to_db():
							flash('Stone type updated successfuly.','success')
							return resp
						else:
							flash('Error: Could not update Stone type.(Error code: EC50-U-78)','danger')
							return resp
				flash('Stone type you tried to updated does not exist.','danger')
				return resp
			#---------------Save
			stone_type =    StoneType.find_by_name_and_store(form.name.data, current_user.store_id)
			if stone_type:
				flash(f'Stone type  "{stone_type.name}" already exists.','danger')
				return resp
			stone_type = StoneType(name=form.name.data,published=form.published.data,store_id=current_user.store_id)
			if stone_type.save_to_db():
				flash(f'Stone type successfuly created.','success')
				return resp
			else:
				flash('Error: Could not save Stone type.(Error code: EC50-S-78)','danger')
				return resp
	if request.method == 'GET':
		stone_type = None;
		if 'id' in args:
			stone_type = StoneType.find_by_uuid(args.get('id'))
			if stone_type:
				form.name.data = stone_type.name
				form.published.data = stone_typene.published
	return render_template('admin/stone_types.html',title=title,stone_types=stone_types,form=form)

@admin.route('/get-code', methods=["POST"])
@t1_required
def get_code():
	if request.method == 'POST':
		json = request.get_json()
		if 'cat_id' in json:
			code = Product.generate_code(category_id=str(json['cat_id']),store_id=current_user.store_id)
			if code:
				return {'code': code ,'message' : 'Product code generated.'}, 200
			else:
				return {'message' : 'Could not generate a valid product code, please select a valid category.'}, 400
		else:
			return {'message' : 'Please select a valid category'}

@admin.route('/get-formula', methods=["POST"])
@t1_required
def get_formula():
	if request.method == 'POST':
		json = request.json
		if 'method_id' in json:
			rm = RattiMethod.find_by_uuid(uuid=json.get('method_id'))
			return {'message': 'Folmulae returned: True',
					'formula': rm.formula
					}
		else:
			return {'message' : 'Please select a valid ratti method'}
