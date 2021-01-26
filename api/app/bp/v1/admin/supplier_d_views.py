from . import admin
from .forms import GoldGivenForm
from flask import render_template, redirect, url_for, request, make_response
from app.decorators import t1_required
from flask_login import current_user
from app.models import Product, ProductImages, Category , Carat , User, Metal, RattiMethod
from app.utils import save_image

@admin.route('/supplier/dealing/g', methods=['GET', 'POST'])
@t1_required
def supplier_gg():
    title = 'Supplier Dealing - Gold Given'
    args = request.args
    form = GoldGivenForm()
    products = Product.find_all(current_user.store_id)
    choices =  [('','-----')]
    form.supplier_id.choices = choices + [(str(s.uuid), s.username) for s in User.find_all(current_user.store_id)]
    form.care_of_id.choices = choices + [(str(s.uuid), s.username) for s in User.find_all(current_user.store_id)]
    if request.method == 'POST':
         resp = make_response(redirect(url_for('admin.add_products')))
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
             #---------------Save
             product =    Product.find_by_code_and_store(form.product_code.data, current_user.store_id)
             if product:
                 return {'message' : f'Product  "{product.product_code}" already exists.'}, 400
             product = Product(product_code=form.product_code.data,design_no=form.design_no.data,
                                 category_id=form.category.data, carat_id=form.carat.data,
                                 supplier_id=form.supplier.data, size=form.size.data,
                                 metal_id=form.metal.data, qty=form.qty.data,
                                 ratti_method_id=form.ratti_method.data, weight=form.weight.data,
                                 waste=form.waste.data, ratti=form.ratti.data,
                                 pure_weight=form.pure_weight.data, weight_gm=form.total_weight.data,
                                 published=form.published.data, description=form.desc.data,
                                 store_id=current_user.store_id, user_id=current_user.uuid)
             if product.save_to_db():
                 if form.images.data:
                     for img in form.images.data:
                         name = save_image(img,str(current_user.store_id),'products')
                         pImage = ProductImages(file_name=name,product_id=product.uuid)
                         pImage.save_to_db()
                 code = Product.generate_code(category_id=form.category.data ,store_id=current_user.store_id)
                 if code:
                     return {'message' : f'Product successfully added.','code' : code}, 201
                 else:
                     return {'message' : f'Product successfully added, please regenerate your product code.'}, 201
             else:
                 return {'message' : f'Could not save product.'}, 400
    if request.method == 'GET':
        return render_template('admin/supplier_dealing/supplier_d_gg.html', title=title, products=products, form=form)
