from . import admin
from .forms import UserForm
from app.utils import generate_username
from flask import render_template, redirect, url_for, request, make_response
from app.decorators import t1_required
from flask_login import current_user
from app.models import User

@admin.route('/users/add', methods=['GET', 'POST'])
@t1_required
def add_user():
    title = 'Add user'
    args = request.args
    form = UserForm()
    if request.method == 'POST':
        resp = make_response(redirect(url_for('admin.add_user')))
        print(form.data)
        if form.validate_on_submit():
            #---------------Save
            if User.find_by_email(form.email.data):
                return {'message' : f'User with that email already exists.'}, 400

            username = generate_username(form.first_name.data,form.last_name.data)
            u =User(username = username,
                    email = form.email.data,
                    password = form.password.data,
                    first_name = form.first_name.data,
                    last_name = form.last_name.data)
            if u.save_to_db():
                return {'message' : f'User successfully added.'}, 201
            else:
                return {'message' : f'User could not be added.'}, 400

    if request.method == 'GET':
        return render_template('admin/users/add_user.html', title=title, form=form)

@admin.route('/users/view', methods=['GET'])
@t1_required
def view_users():
    title = 'View users'
    users = User.find_all()
    #form = ProductForm()
    return render_template('admin/users/view_all_users.html', title=title, users=users)
