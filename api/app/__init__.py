from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import  email_validator
from config import config
#from flask_debugtoolbar import DebugToolbarExtension
from flask_jwt_extended import JWTManager
from flask_cors  import CORS


mail = Mail()
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'
login_manager.login_message_category = 'alert alert-outline-info'
def create_app(config_name:str):
	app = Flask(__name__)
	app.config.from_object(config[config_name])
	config[config_name].init_app(app)
	#toolbar = DebugToolbarExtension(app)
	with app.app_context():
		login_manager.init_app(app)
		mail.init_app(app)
		db.init_app(app)
		jwt.init_app(app)
		cors.init_app(app, resources={r'/api/*': {'origins': '*'}})
		# attach routes and custom error (Blueprints) pages here
		#from app.bp.v1.auth import auth as auth_bp
		#from app.bp.v1.main import main as main_bp
		#from app.bp.v1.user import user as user_bp
		#from app.bp.v1.admin import admin as admin_bp

		#Normal endpoints
		#app.register_blueprint(auth_bp)
		#app.register_blueprint(main_bp)
		#app.register_blueprint(user_bp)
		#app.register_blueprint(admin_bp)

		#API v1.0
		from .api.v1_0.auth import auth_api
		from .api.v1_0.nest import nest_api
		from .api.v1_0.dashboard import dashboard_api
		from .api.v1_0.gold import gold_api
		from .api.v1_0.hens import hens_api
		from .api.v1_0.categories import categories_api
		from .api.v1_0.suppliers import suppliers_api
		from .api.v1_0.products import products_api

		app.register_blueprint(auth_api, url_prefix='/api/v1.0/auth')
		app.register_blueprint(nest_api, url_prefix='/api/v1.0/nest')
		app.register_blueprint(dashboard_api, url_prefix='/api/v1.0/dashboard')
		app.register_blueprint(gold_api, url_prefix='/api/v1.0/gold')
		app.register_blueprint(hens_api, url_prefix='/api/v1.0/hens')
		app.register_blueprint(categories_api, url_prefix='/api/v1.0/categories')
		app.register_blueprint(suppliers_api, url_prefix='/api/v1.0/suppliers')
		app.register_blueprint(products_api, url_prefix='/api/v1.0/products')

	return app


def init(demo=False):
	from .models import RattiMethod as rm,Carat, Role, NestRole, Metal, VoucherType as vt
	from .api.v1_0.accounts.models import AccountGroup as ag,  AccountType as at
	print('adding ratti methods...')
	rm.insert_defaults()
	print('adding user roles...')
	Role.insert_defaults()
	print('adding store roles...')
	NestRole.insert_defaults()
	print('adding metals...')
	Metal.insert_defaults()
	print('adding account types')
	at.insert_defaults()
	print('adding account groups..')
	ag.insert_defaults()
	print('Adding vouchers')
	vt.insert_defaults()
	print('adding carat')
	Carat.insert_defaults()
	if demo:
		print('adding demo accounts...')
		from .models import Nest , GoldRate, Nest
		from .api.v1_0.categories.models import Category
		from app.api.v1_0.user.models import User
		print('adding user.')
		u= User(gid='3155077782',password='564864',confirmed=True)
		u.save_to_db()
		print('Creating nest')
		s= Nest(name='Mughal Jewelers')
		s.save_to_db()
		s.add_keeper(u)
		print('adding categories')
		cg=Category(name='Rings',abr='A',published=True,nest_id=s.id)
		cg.save_to_db()
		print('adding gold rate')
		#g=GoldRate(value=112500,value24k=12121,published=True,carat_id=21,nest_id=s.id)
		#g.save_to_db()
	print('done!')
