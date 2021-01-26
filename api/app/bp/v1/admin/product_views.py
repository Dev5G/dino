from . import admin
from .forms import ProductForm
from flask import render_template, redirect, url_for, request, make_response
from app.decorators import t1_required
from flask_login import current_user
from app.models import Product, ProductImages, Category , Carat , User, Metal, RattiMethod, Store
from app.utils import save_image

@admin.route('/products/add', methods=['GET', 'POST'])
@t1_required
def add_products():
    title = 'Update Products'
    args = request.args
    form = ProductForm()
    products = Product.find_all(current_user.store_id)
    store = Store.find_by_uuid(current_user.store_id)
    choices =  [('','-----')]
    form.category.choices = choices + [(str(c.uuid), c.name) for c in Category.find_all(current_user.store_id)]
    form.carat.choices = choices + [(str(c.uuid), c.value) for c in Carat.find_all(current_user.store_id)]
    form.supplier.choices = choices + [(str(s.uuid), s.username) for s in store.suppliers.all()]
    form.metal.choices = choices + [(str(s.uuid), s.name) for s in Metal.find_all()]
    form.ratti_method.choices = choices + [(str(s.uuid), s.name) for s in RattiMethod.find_all(current_user.store_id)]
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
            print(form.data)
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
                if form.images.data != ['']:
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
        product = None;
        if 'id' in args:
            product = Product.find_by_uuid(args.get('id'))
            if product:
                # form.name.data = stone.name
                # form.qty.data = stone.qty
                # form.stone_type.data = stone.stone_type_id
                # form.rate.data = stone.rate
                # form.desc.data = stone.description
                form.published.data = stone.published
    return render_template('admin/product/add_edit_product.html', title=title, products=products, form=form)

@admin.route('/products', methods=['GET', 'POST'])
@t1_required
def view_products():
    title = 'View products (Stock)'
    products = Product.find_all(current_user.store_id)
    form = ProductForm()
    return render_template('admin/product/products.html', title=title, products=products, form=form)
