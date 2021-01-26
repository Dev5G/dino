from . import admin
from .forms import CashAccountForm
from flask import render_template, redirect, url_for, request, make_response
from app.decorators import t1_required
from flask_login import current_user
from app.models import AccountGroup, User, AccountCash, AccountGold, Accounts

@admin.route('/accounts/add?type=cash', methods=['GET', 'POST'])
@t1_required
def add_cash_account():
    title = 'Add cash account'
    args = request.args
    form = CashAccountForm()
    choices =  [('','-----')]
    form.account_group_id.choices = choices + [(str(s.uuid), s.title) for s in AccountGroup.find_all()]
    form.user_id.choices = choices + [(str(s.uuid), s.username) for s in User.find_all_by_store(current_user.store_id)]
    if request.method == 'POST':
        resp = make_response(redirect(url_for('admin.add_cash_account')))
        if form.validate_on_submit():
            #---------------Save
            account =    AccountCash.find_by_title_group_and_user(form.title.data, form.account_group_id.data,form.user_id.data)
            if account:
                return {'message' : f'Account  "{account.title}" for this user already exists.'}, 400
            account = AccountCash(title=form.title.data,opening_balance=form.opening.data,remaining_balance=form.opening.data,
                                account_group_id=form.account_group_id.data, user_id=form.user_id.data,store_id=current_user.store_id)
            if account.save_to_db():
                return {'message' : f'Account successfully added.'}, 201
            else:
                return {'message' : f'Account could not be added.'}, 400

    if request.method == 'GET':
        return render_template('admin/accounts/add_cash_account.html', title=title, form=form)

@admin.route('/accounts/view?type=cash', methods=['GET'])
@t1_required
def view_cash_accounts():
    title = 'View Accounts (Cash)'
    accounts = Accounts.find_all_cash(current_user.store_id)
    #form = ProductForm()
    return render_template('admin/accounts/accounts_cash.html', title=title, accounts=accounts)
