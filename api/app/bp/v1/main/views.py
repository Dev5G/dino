from datetime import datetime
from flask import render_template, session, redirect, url_for
from . import main
from ..auth.forms import LoginForm, RegisterForm
from app import db
from flask_login import login_required
#from app.models import User

@main.route('/', methods=['GET', 'POST'])
def index():
    title = 'Deogon - Jewelry business management'
    return render_template('main/index.html', title=title)

@main.route('/quickview')
def quickview():
    return render_template('main/quickview.html')

@main.route('/login')
def login():
    form = LoginForm()
    return render_template('main/login_template.html', form=form)

@main.route('/register')
def register():
    form = RegisterForm()
    return render_template('main/register_template.html', form=form)
