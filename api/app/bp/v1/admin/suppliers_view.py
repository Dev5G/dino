from . import admin
from .forms import AddSupplierForm
from flask import render_template, redirect, url_for, request, make_response
from app.decorators import t1_required
from flask_login import current_user
from app.models import Store, ProductImages, Category , Carat , User, Metal, RattiMethod
from app.utils import save_image

@admin.route('/suppliers/add', methods=['GET', 'POST'])
@t1_required
def add_supplier():
    title = 'Add Supplier :: Search'
    args = request.args
    form = AddSupplierForm()
    choices =  [('','-----')]
    form.user_id.choices = choices + [(str(s.uuid), s.username) for s in User.find_all()]
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
         if form.validate_on_submit():
            if Store.add_supplier(user_id=form.user_id.data,store_id=current_user.store_id):
                return {'message' : f'Supplier added successfuly.'}, 201
            else:
                return {'message' : f'Supplier could not be added.'}, 400
    if request.method == 'GET':
        return render_template('admin/suppliers/add_supplier.html', title=title, form=form)

@admin.route('/suppliers/view', methods=['GET', 'POST'])
@t1_required
def view_suppliers():
    title = 'View Suppliers'
    args = request.args
    store = Store.find_by_uuid(current_user.store_id)
    suppliers = store.suppliers.all()
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
         if form.validate_on_submit():
            if Store.add_supplier(user_id=form.user_id.data,store_id=current_user.store_id):
                return {'message' : f'Supplier added successfuly.'}, 201
            else:
                return {'message' : f'Supplier could not be added.'}, 400
    if request.method == 'GET':
        return render_template('admin/suppliers/view_suppliers.html', title=title, suppliers=suppliers)
