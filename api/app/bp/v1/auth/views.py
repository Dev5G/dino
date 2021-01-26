from datetime import datetime
from flask import render_template, session, redirect, url_for, request, flash, current_app
from flask_login import login_required, logout_user, current_user, login_user
from . import auth
from .forms import LoginForm, RegisterForm
from app import db
from app.models import User
from app.mailer import send_email

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('admin.dashboard'))
    form = LoginForm()
    title = 'Log in'
    if request.method == 'POST':
        if form.validate_on_submit():
            user  = User.check_user_login(email=form.email.data,password=form.password.data)
            if user:
                next_page = request.args.get('next')
                login_user(user, remember=form.remember_me.data)
                if current_user.is_authenticated and not current_user.store_id:
                    flash(f'You need to set your store up.','warning')
                    return redirect(next_page) if next_page else redirect(url_for('user.store_signup')), 200
                else:
                    return redirect(next_page) if next_page else redirect(url_for('admin.dashboard')), 200
    return render_template('auth/login.html', form=form, title=title , current_time=datetime.utcnow())

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('admin.dashboard'))
    form = RegisterForm()
    title = 'Register account - AIONIX'

    if request.method == 'POST':
        if form.validate_on_submit():
            user  = User(email=form.email.data,username=form.username.data,password=form.password.data, confirmed=True)
            if user.save_to_db():
                # token = user.generate_confirmation_token()
                # print('Reg token: ' + str(token) )
                # send_email(user.email, 'Confirm Your Account', 'auth/email/confirm',current_app, user=user, token=token)
                flash('Your account has been created successfuly. Now please login to continue!','success')
                return redirect(url_for('auth.login'))
    return render_template('auth/register.html', form=form, title=title , current_time=datetime.utcnow())

@auth.route('/confirm-account/<token>')
@login_required
def confirm(token):
    if current_user.confirmed:
        return redirect(url_for('main.index'))
    if current_user.confirm(token):
        flash('You have confirmed your account. Thanks!','success')
    else:
        flash('The confirmation link is invalid or has expired.','warning')
    return redirect(url_for('main.index'))

@auth.route('/unconfirmed')
def unconfirmed():
    if current_user.is_anonymous or current_user.confirmed:
        return redirect(url_for('main.index'))
    title = 'Account unconfirmed'
    return render_template('auth/unconfirmed.html', title=title , current_time=datetime.utcnow())

@auth.route('/confirm')
@login_required
def resend_confirmation():
    token = current_user.generate_confirmation_token()
    #send_email(to=current_user.email,template='auth/email/confirm', subject='Confirm Your Account', user=current_user, token=token)
    flash('A new confirmation email has been sent to you by email.','success')
    return redirect(url_for('auth.confirm', ))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.','info')
    return redirect(url_for('auth.login'))

@auth.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.ping()
        if not current_user.confirmed \
            and not 'auth' in request.path:
            return redirect(url_for('auth.unconfirmed'))
