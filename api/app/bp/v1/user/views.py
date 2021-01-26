from datetime import datetime
from flask import render_template, redirect, url_for, request, flash, abort
from . import user
from app import db
from flask_login import login_required, current_user
from app.models import Store
from .forms import StoreSignupForm
from app.decorators import no_store_required

@user.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    title = 'User profile'
     #if form.validate_on_submit():
     # ...
    #    return redirect(url_for('.index'))
    return render_template('user/profile_page.html', title=title, current_time=datetime.utcnow())


@user.route('/store-signup', methods=['GET', 'POST'])
@no_store_required
def store_signup():
    form = StoreSignupForm()
    title = 'Store setup'
    if request.method == 'POST':
        if form.validate_on_submit():
            #implement logo saving method
            store = Store(store_name=form.store_name.data,email=form.email.data,city=form.city.data,
                            country=form.country.data,phone=form.phone.data,address=form.address.data, website=form.website.data)
            if store.save_to_db():
                current_user.store_id = store.uuid
                current_user.save_to_db()
                flash(f'Congratulations! your store is ready to use.','success')
                return  redirect(url_for('admin.dashboard'))
    form.store_name.data = 'Mughal Jewelers'
    form.phone.data = '732838273827'
    form.email.data = 'talaha@gmail.com'
    form.address.data = 'Krachi company, farukh plaza'
    return render_template('user/store_signup.html', form=form,title=title, current_time=datetime.utcnow())
