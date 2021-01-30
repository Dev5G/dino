########################
# UUID for SQLite hack #
########################
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import desc
from datetime import datetime, date, timedelta

import uuid
import hashlib
from flask import flash, current_app, request
from . import db#, login_manager
#from flask_login import UserMixin, AnonymousUserMixin
from .utils import extract_max, generate_invoice_no

# @login_manager.user_loader
# def load_user(user_id):
# 	return User.query.get(int(user_id))

#-------------------Base and default
class GUID(TypeDecorator):
	"""Platform-independent GUID type.

	Uses PostgreSQL's UUID type, otherwise uses
	CHAR(32), storing as stringified hex values.

	"""
	impl = CHAR

	def load_dialect_impl(self, dialect):
		if dialect.name == 'postgresql':
			return dialect.type_descriptor(UUID())
		else:
			return dialect.type_descriptor(CHAR(32))

	def process_bind_param(self, value, dialect):
		if value is None:
			return value
		elif dialect.name == 'postgresql':
			return str(value)
		else:
			if not isinstance(value, uuid.UUID):
				return "%.32x" % uuid.UUID(value).int
			else:
				# hexstring
				return "%.32x" % value.int

	def process_result_value(self, value, dialect):
		if value is None:
			return value
		else:
			if not isinstance(value, uuid.UUID):
				value = uuid.UUID(value)
			return value


class Base(db.Model):

	__abstract__ = True

	id = db.Column(db.Integer , primary_key=True, unique=True, nullable=False)
	#uuid = db.Column(GUID(),  default=str(uuid.uuid4()),unique=True,nullable=False)
	created_date = db.Column(db.DateTime,default=datetime.utcnow(), nullable=False)
	updated_date = db.Column(db.DateTime,
					default=datetime.utcnow(),
					onupdate=datetime.utcnow())

	def json(self):
		return 'Please define a json method in ' + str(self.__class__)
	#--------------Save method-----------------@
	def save_to_db(self):
		try:
			db.session.add(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
			
	def add_to_nest(self):
		try:
			db.session.add(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls):
		"""Find all without any filters"""
		try:
			o = cls.query.all()
			if o:
				return True, o
			return False, None
		except Exception as e:
			print(str(e))
			return False, str(e)

	@classmethod
	def find_all_by_hens(cls,hens, is_list, dynamic = False):
		try:
			if is_list:
				hen_ids = [hen.id for hen in hens]
				o = cls.query.filter(cls.hen_id.in_(hen_ids))
				if not dynamic:
					o = o.all()
				if o:
					return True, o
			if not is_list:
				o = cls.query.filter_by(hen_id=hens)
				if not dynamic:
					o = o.all()
				if o:
					return True, o
			return False, None
		except Exception as e:
			print(str(e))
			return False, str(e)
	

	@classmethod
	def find_all_by_nest(cls, nest_id):
		try:
			o= cls.query.filter_by(nest_id=nest_id).all()
			if	o:
				return True, o
			return False, 'This nest needs a few hens!'
		except Exception as e:
			print(str(e))
			return False, str(e)

	@classmethod
	def find_by_id(cls, id):
		try:
			o =cls.query.filter_by(id=id).first()
			if o:
				return True,o
			return False, 'Nothing found! with that id' 
		except Exception as e:
			print(str(e))
			return False, str(e)

	@classmethod
	def find_by_nest_and_id(cls,id, nest_id):
		try:
			return cls.query.filter_by(nest_id=nest_id).filter_by(id=id).first()
		except Exception as e:
			return None
#-----------Associated tables -----------
# class Customers(Base):
#     __tablename__ = 'tbl_customers'
#
#     user_id = db.Column(GUID(), db.ForeignKey('tbl_users.uuid'), nullable=False)
#     nest_id = db.Column(GUID(), db.ForeignKey('tbl_nests.uuid'), nullable=False)


#-------Customer relationship-----
customers_table=db.Table('tbl_customers',
						db.Column('user_id',db.Integer,db.ForeignKey('tbl_users.id'), nullable=False),
						db.Column('nest_id',db.Integer,db.ForeignKey('tbl_nests.id'), nullable=False),
						)


#user_cash_accounts_table=db.Table('tbl_user_cash_accounts',
#								db.Column('user_id', db.Integer,db.ForeignKey('tbl_users.id'), nullable=False),
#								db.Column('account_id', db.Integer,db.ForeignKey('tbl_account_cash.id'), nullable=False))
#user_gold_accounts_table=db.Table('tbl_user_gold_accounts',
#								db.Column('user_id', db.Integer,db.ForeignKey('tbl_users.id'), nullable=False),
#								db.Column('account_id', db.Integer,db.ForeignKey('tbl_account_gold.id'), nullable=False))
#


class Permission:
	FOLLOW = 0x01
	LIKE_COMMENT = 0x02
	VIEW_OWN_REPORT = 0x04
	VIEW_TRANSACTIONS = 0x08
	VIEW_TRANSACTIONS = 0x10
	MANAGE_PRODUCTS = 0x20 ## Add, Edit , Delete,  Products
	MANAGE_USERS = 0x40
	MANAGE_SALES = 0x80
	MANAGE_REPORTS = 0x100
	MANAGE_COMPANY = 0x200
	ADMINISTER = 0x400


class UPermissionTier:
	user = Permission.FOLLOW |\
		   Permission.LIKE_COMMENT
	customer = Permission.FOLLOW |\
			Permission.LIKE_COMMENT |\
			Permission.VIEW_OWN_REPORT
	supplier = Permission.FOLLOW |\
			   Permission.LIKE_COMMENT |\
			   Permission.VIEW_OWN_REPORT |\
			   Permission.VIEW_TRANSACTIONS 


class City(Base):
	__tablename__ = 'tbl_cities'

	name = db.Column(db.String(64))
	ndc = db.Column(db.Integer)

	#Relationships
	#phone_numbers = db.relationship('Phone_number',backref='city')
	#nests = db.relationship('Nest',backref='city')
	#--------------Save methods-----------------@
	def save_to_db(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db():
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class Country(Base):
	__tablename__ = 'tbl_countries'

	name = db.Column(db.String(64))
	cc = db.Column(db.Integer)

	#Relationships
	#phone_numbers = db.relationship('Phone_number',backref='country')
	#nests = db.relationship('Nest',backref='country')
	#--------------Save methods-----------------@
	def save_to_db(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db():
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class Area(Base):
	__tablename__ = 'tbl_areas'

	name = db.Column(db.String(64))

	#Relationships
	#phone_numbers = db.relationship('Phone_number',backref='area')
	#nests = db.relationship('Nest',backref='area')
	#--------------Save methods-----------------@
	def save_to_db(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db():
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class Email(Base):
	__tablename__ = 'tbl_emails'

	email = db.Column(db.String(64))
	primary = db.Column(db.Boolean, default=False)

	#Relationships
	#nest = db.relationship('Nest',backref='email',foreign_keys='Nest.email_id')
	#user_details = db.relationship('UserDetails',backref='email')

	#--------------Save methods-----------------@
	def save_to_db(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db():
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False




class Role(Base):
	__tablename__ = 'tbl_roles'

	name = db.Column(db.String(64), unique=True)
	permission = db.Column(db.Integer)

	#relationships
	#users = db.relationship('User', backref='role', lazy='dynamic')

	def __repr__(self):
		return '<Role %r>' % self.name

	@staticmethod
	def get_supplier_permissions():
		return UPermissionTier.supplier

	@staticmethod
	def get_customer_permissions():
		return UPermissionTier.customer
	#--------------insert_defaults
	@staticmethod
	def insert_defaults():
		roles = {
				'Manage Products': Permission.MANAGE_PRODUCTS,
				'Supplier': UPermissionTier.supplier,
				}
		try:
			for n,r in roles.items():
				role = Role.query.filter_by(name=n).first()
				if role is None:
					role = Role(name=n)
					role.permissions = r
					db.session.add(role)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	



class NestPermission:
	MANAGE_PRODUCTS = 0x01 #Enable Routing for products page, Adding, Viewing, Deleting, Editing
	MANAGE_BASIC_USERS = 0x02 #Add supplier accounts, customers, staff and view their transactions + allow staff manangement like basic salary
	MANAGE_BASIC_SALES = 0x04
	MANAGE_BASIC_ACCOUNTS = 0x08
	MANAGE_BASIC_REPORTS = 0x10
	MANAGE_CUSTOMERS = 0x20
	MANAGE_USERS = 0x40
	MANAGE_SALES = 0x80
	MANAGE_ACCOUNTS = 0x100
	MANAGE_REPORTS = 0x200
	ADMINISTER = 0x400


class PermissionTier:
	t1 = NestPermission.MANAGE_PRODUCTS | NestPermission.MANAGE_BASIC_USERS
	t2 = NestPermission.MANAGE_PRODUCTS |\
		 NestPermission.MANAGE_BASIC_USERS |\
		 NestPermission.MANAGE_BASIC_SALES |\
		 NestPermission.MANAGE_BASIC_ACCOUNTS |\
		 NestPermission.MANAGE_BASIC_REPORTS
	t3 = NestPermission.MANAGE_PRODUCTS |\
		 NestPermission.MANAGE_BASIC_USERS |\
		 NestPermission.MANAGE_BASIC_SALES |\
		 NestPermission.MANAGE_BASIC_ACCOUNTS |\
		 NestPermission.MANAGE_BASIC_REPORTS |\
		 NestPermission.MANAGE_CUSTOMERS |\
		 NestPermission.MANAGE_USERS |\
		 NestPermission.MANAGE_ACCOUNTS |\
		 NestPermission.MANAGE_SALES |\
		 NestPermission.MANAGE_REPORTS
	t4 = 0x7ff


class NestRole(Base):
	__tablename__ = 'tbl_nest_roles'

	name = db.Column(db.String(64), unique=True)
	permission = db.Column(db.Integer)

	#relationships
	#nests = db.relationship('Nest', backref='role', lazy='dynamic')

	def __repr__(self):
		return '<Role: %r>' % self.name

	#--------------insert_defaults
	@staticmethod
	def insert_defaults():
		roles = {
				't1': PermissionTier.t1,
				't2': PermissionTier.t2,
				't3': PermissionTier.t3,
				't4': PermissionTier.t4
				}
		for n, r in roles.items():
			role = NestRole.query.filter_by(name=n).first()
			if role is None:
				role = NestRole(name=n)
				role.permissions = r
				#role.uuid = uuid.uuid4()
				db.session.add(role)
		try:
			db.session.commit()
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class Nest(Base):
	__tablename__ = 'tbl_nests'

	name = db.Column(db.String(64))
	logoUrl = db.Column(db.String(64))
	#city_id = db.Column(db.Integer, db.ForeignKey('tbl_cities.id'))
	#country_id = db.Column(db.Integer, db.ForeignKey('tbl_countries.id'))
	#area_id = db.Column(db.Integer, db.ForeignKey('tbl_areas.id'))
	#address = db.Column(db.String(64))
	website = db.Column(db.String(32))
	verified = db.Column(db.Boolean, default=False)
	last_seen = db.Column(db.DateTime, default=datetime.utcnow)
	
	#Relationships
	#emails = db.Column(db.String(64), unique=True, index=True)
	#phones = db.Column(db.String(20))
	#products = db.relationship('Product', backref='nest')
	#staff = db.relationship('User', backref='staff_nest')
	#goldrates = db.relationship('GoldRate' , backref='nest')
	#carats =  db.relationship('Carat', backref='nest')
	#gold_accounts = db.relationship('AccountGold',backref='nest')
	#cash_accounts = db.relationship('AccountCash',backref='nest')
	
	#---------------Backrefs--------------#

	def ping(self):
		self.last_seen = datetime.utcnow()
		db.session.add(self)
		try:
			db.session.commit()
		except Exception as e:
			print(str(e))

	def can(self, permissions):
		return self.role is not None and \
			(self.role.permissions & int(permissions)) == int(permissions)

	def is_administrator(self):
		return self.can(Permission.ADMINISTER)

	#def __init__(self, **kwargs):
	#	super(Nest, self).__init__(**kwargs)
	#	#self.uuid = uuid.uuid4()
	#	if self.role is None:
	#		self.role = NestRole.query.filter_by(default=True).first()

	def __repr__(self):
		 return f'<Nest: nest name {self.name}  >'


	def json(self):
		s	= {
			'id'			: self.id ,
			'name'			: self.name ,
			'imageUrl'		: self.logoUrl,
			#'country'		:self.country.name,
			#'city'			:self.city.name,
			#'area'			:self.area.name,
			#'address'		:self.address,
			'website'		:self.website
		}
		return s

	#--------------Save method-----------------@
	def save_to_db(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


	def add_supplier(self, user):
		try:
			self.suppliers.append(user)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


	@classmethod
	def add_customer(cls, user_id, nest_id):
		try:
			nest = cls.find_by_id(nest_id)
			user = User.find_by_id(user_id)
			nest.customers.append(user)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	@classmethod
	def add_salesman(cls, user_id, nest_id):
		try:
			nest = cls.find_by_id(nest_id)
			user = User.find_by_id(user_id)
			nest.salesmen.append(user)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	
	def add_keeper(self, user):
		try:
			self.keepers.append(user)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class Carat(Base):
	__tablename__ = 'tbl_carats'

	value = db.Column(db.Integer, nullable=False)
	published = db.Column(db.Boolean, default=False)

	#Relationships 
	products = db.relationship('Product', backref='carat')
	
	goldrates = db.relationship('GoldRate', backref='carat')

	def json(self):
		return {
			'value'         :self.value,
			'id'			:self.id,
		}


	@classmethod
	def find_by_value(cls,value):
		try:
			return cls.query.filter_by(value=value).first()
		except Exception as e:
			return None

	@staticmethod
	def insert_defaults():
		_values = {
			'14':True,
			'15':True,
			'16':True,
			'17':True,
			'18':True,
			'19':True,
			'20':True,
			'21':True,
			'22':True,
			'23':True,
			'24':True,
			}
		for k, v in _values.items():
			carat= Carat.query.filter_by(value=k).first()
			if not carat:
				carat = Carat(value=k,published=v,id=int(k))
				db.session.add(carat)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

#	@classmethod
#	def find_by_value_and_nest(cls, value,nest_id):
#		try:
#			return cls.query.filter_by(value=value).filter_by(nest_id=nest_id).first()
#		except Exception as e:
#			return None

class GoldRate(Base):
	__tablename__ = 'tbl_gold_rates'

	value = db.Column(db.Integer, nullable=False)
	value24k = db.Column(db.Integer, nullable=False, default=0)
	published = db.Column(db.Boolean, default=True)
	carat_id = db.Column(db.Integer, db.ForeignKey('tbl_carats.id'))
	hen_id = db.Column(db.Integer, db.ForeignKey('tbl_hens.id'), nullable=False)

	def __repr__(self):
		 return f'<GoldRate: value {self.value}  value24k {self.value24k}>'

	def json(self):
		return {
			'id'					: self.id,
			'goldrate'				: self.value ,
			'goldrate24k'			: self.value24k ,
			'carat_id'				: self.carat_id
		}

	#--------------Save method-----------------@
	def save_to_db(self):
		db.session.add(self)
		#q = self.query.filter(self.created_date >= datetime.date(datetime.date.today)).filter(self.created_date <= datetime.date(datetime.date.today)).first()
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls, nest_id):
		"""
			Get all the rates for a specific nest
			*params
				nest_id: nest id of the user to apply filter
		"""
		try:
			return cls.query.filter_by(nest_id=nest_id).all()
		except Exception as e:
			return None

	@classmethod
	def find_all_filtered(cls, nest_id:int, filter:str) -> list:
		"""Get all the rates for a specific nest
		*params
		nest_id: nest id of the user to apply filter
		filter: filter by daily, weekly, monthly, or yearly 
		"""
		try:
			query = cls.query.order_by(desc('created_date'))
			if filter:
				if filter == 'daily':
					filter_date =  datetime.date(datetime.utcnow() - timedelta(days=6))
					print(filter_date)
					query = query.filter(db.func.date(cls.created_date) >= filter_date)	
			if nest_id:
				query = query.filter_by(nest_id=nest_id)
			return query.all()
		except Exception as e:
			print(str(e))
			return None

	@classmethod
	def get_by_date(cls, nest_id, date):
		try:
			y = date - timedelta(days=1)
			t = date + timedelta(days=1)
			return cls.query.order_by(desc('created_date')).filter(cls.created_date>y, cls.created_date<t).filter_by(nest_id=nest_id).first()
		except Exception as e:
			print(str(e))
			None

	@classmethod
	def find_today(cls, nest_id):
		"""
		returns gold rate for the present day if it exists else returns None
		*Params:
			nest_id
		"""
		try:
			#return cls.query.order_by(desc('created_date')).filter(cls.created_date>y, cls.created_date<t).filter_by(nest_id=nest_id).first()
			return cls.query.order_by(desc('created_date')).filter(db.func.date(cls.created_date) ==  datetime.date(datetime.utcnow())).filter_by(nest_id=nest_id).first()
		except Exception as e:
			print(str(e))
			None
	
	@classmethod
	def find_all_today(cls) -> list:
		"""
		returns a list of gold rates for the present day if it exists 
			else returns None or empty list
		"""
		try:
			return cls.query.order_by(desc('created_date')).filter(db.func.date(cls.created_date) ==  datetime.date(datetime.utcnow())).all()
		except Exception as e:
			print(str(e))
			None
	#@classmethod
	#def find_by_uuid(cls, uuid):
	#	try:
	#		return cls.query.filter_by(uuid=uuid).first()
	#	except Exception as e:
	#		return None

	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None


class StoneType(Base):
	__tablename__ = 'tbl_stone_types'

	name = db.Column(db.String(20), nullable=False)
	published = db.Column(db.Boolean, default=False)
	#relationship
	#TODO:// may need to remove this relation
	stones = db.relationship('Stone',backref='stone_type')

	def __repr__(self):
		 return f'<StoneType: name {self.name} >'

	def json(self):
		return {
			'value_id'    : self.id,
			'name' : self.name ,
			'created_date' : self.created_date
		}

	#--------------Save method-----------------@
	def save_to_db(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls):
		try:
			return cls.query.all()
		except Exception as e:
			return None

	@classmethod
	def find_by_name_and_nest(cls, name,nest_id):
		try:
			return cls.query.filter_by(name=name).filter_by(nest_id=nest_id).first()
		except Exception as e:
			return None

	#@classmethod
	#def find_by_uuid(cls, uuid):
	#	try:
	#		return cls.query.filter_by(uuid=uuid).first()
	#	except Exception as e:
	#		return None

	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None


class Stone(Base):
	__tablename__ = 'tbl_stones'

	name = db.Column(db.String(10), nullable=False)
	stone_type_id = db.Column(db.Integer, db.ForeignKey('tbl_stone_types.id'), nullable=False)
	
	def __repr__(self):
		 return f'<Stone: name {self.name}>'

	def json(self):
		return {
			'id'			: self.id,
			'name'			: self.name,
			'stone_type'	: self.stone_type.name
		}
	#--------------Save method-----------------@
	def save_to_db(self):
		db.session.add(self)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls, nest_id):
		try:
			return cls.query.filter_by(nest_id=nest_id).all()
		except Exception as e:
			return None

	#@classmethod
	#def find_by_name_and_nest(cls, name,nest_id):
	#	try:
	#		return cls.query.filter_by(name=name).filter_by(nest_id=nest_id).first()
	#	except Exception as e:
	#		return None

	#@classmethod
	#def find_by_uuid(cls, uuid):
	#	try:
	#		return cls.query.filter_by(uuid=uuid).first()
	#	except Exception as e:
	#		return None

	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None


class Metal(Base):
	__tablename__ = 'tbl_metals'

	name = db.Column(db.String(10), nullable=False)
	
	#Relationships
	products = db.relationship('Product',backref='metal')
	

	def json(self):
		return {
			'name'			:self.name,
			'id'			:self.id
		}

	#--------------Save method-----------------@
	def save_to_db(self):
		try:
			db.session.add(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls):
		try:
			return cls.query.all()
		except Exception as e:
			print(str(e))
			return None

	#@classmethod
	#def find_by_uuid(cls, uuid):
	#	try:
	#		return cls.query.filter_by(uuid=uuid).first()
	#	except Exception as e:
	#		return None

	#@classmethod
	#def find_by_name_and_nest(cls, name,nest_id):
	#	try:
	#		return cls.query.filter_by(name=name).filter_by(nest_id=nest_id).first()
	#	except Exception as e:
	#		return None

	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None
	#--------------insert_defaults
	@staticmethod
	def insert_defaults():
		metals = ('Gold', 'Silver','Pladium','Platinum')
		for m in metals:
			metal = Role.query.filter_by(name=m).first()
			if metal is None:
				metal = Metal(name=m)
				db.session.add(metal)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class RattiMethod(Base):
	__tablename__ = 'tbl_ratti_method'

	name = db.Column(db.String(30), nullable=False)
	formula = db.Column(db.String(150), nullable=False)
	published = db.Column(db.Boolean, default=False)
	nest_id = db.Column(db.Integer, db.ForeignKey('tbl_nests.id'))
	
	#Relationships
	products = db.relationship('Product',backref='ratti_method')
	

	def json(self):
		return {
			'name'			:self.name,
			'formula'		:self.formula,
			'id'			:self.id
		}

	#--------------Save method-----------------@
	def save_to_db(self):
		try:
			db.session.add(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@

	@classmethod
	def find_by_name_and_nest(cls, name,nest_id):
		try:
			return cls.query.filter_by(nest_id=nest_id).filter_by(name=name).first() #or cls.query.filter_by(nest_id=None).filter_by(name=name).first()
		except Exception as e:
			return None

	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None
	#--------------insert_defaults
	@staticmethod
	def insert_defaults():
		ratti_methods = {'Normal': '(96 - ratti) * (weight / 96)',
						 'Extra' : '(96 + ratti) * (weight / 96)'
						 }
		for k, v in ratti_methods.items():
			rm = RattiMethod.query.filter_by(name=k).first()
			if rm is None:
				rm = RattiMethod(name=k,formula=v,published=True)
				db.session.add(rm)
		db.session.commit()


class ProductImages(Base):
	__tablename__  = 'tbl_product_imgs'

	file = db.Column(db.String(32), nullable=False)
	pid = db.Column(db.Integer, db.ForeignKey('tbl_products.id'))#product_id

	def __repr__(self):
		 return f'<ProductImages: file_name {self.file} product_id {self.product_id}>'

	def json(self):
		return {
			'pid'     :self.self.pid,
			'file'   :self.file_name
		}

	#--------------Save method-----------------@
	def save_to_db(self):
		try:
			db.session.add(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls, product_id):
		try:
			return cls.query.filter_by(pid=product_id).all()
		except Exception as e:
			return None


class ProductStones(Base):
	__tablename__ = 'tbl_product_stones'

	stone_id = db.Column(db.Integer, db.ForeignKey('tbl_stones.id'), nullable=False)
	pid = db.Column(db.Integer, db.ForeignKey('tbl_products.id'), nullable=False)
	qty = db.Column(db.Integer)
	weight = db.Column(db.Float(precision=3))
	rate = db.Column(db.Float(precision=3))
	description = db.Column(db.String(30))

	
	def json(self):
		return {
			'stone_id'		:	self.self.stone_id,
			'pid'			:	self.pid,
			'qty'			:	self.qty,
			'weight'		:	self.weight,
			'rate'			:	self.rate,
			'desc'			:	self.ddescription
		}

	#--------------Save method-----------------@
	def save_to_db(self):
		try:
			db.session.add(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False

	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls, product_id):
		try:
			return cls.query.filter_by(pid=product_id).all()
		except Exception as e:
			return None



#---------------Worker Dealing stuff--------------
class GoldGiven(Base):
	__tablename__ = 'tbl_gold_given'

	supplier_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	care_of_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'))
	weight = db.Column(db.Float(precision=3))
	description = db.Column(db.String(120))
	nest_id = db.Column(db.Integer, db.ForeignKey('tbl_nests.id'), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'),nullable=False)



	#--------------Save method-----------------@
	def save_to_db(self):
		try:
			db.session.add(self)
			db.session.commit()
			return True
		except Exception as e:
			return False

	#-------------------Delete method-----------@
	def delete_from_db(self):
		try:
			db.session.delete(self)
			db.session.commit()
			return True
		except Exception as e:
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls, nest_id):
		try:
			return cls.query.filter_by(nest_id=nest_id).all()
		except Exception as e:
			return None


	@classmethod
	def find_by_uuid(cls, uuid):
		try:
			return cls.query.filter_by(uuid=uuid).first()
		except Exception as e:
			return None

	@classmethod
	def find_by_supplier_all(cls, supplier_id):
		try:
			return cls.query.filter_by(supplier_id=supplier_id).all()
		except Exception as e:
			return None


	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None
#----------------Worker Dealing end


class VoucherType(Base):
	__tablename__	= 'tbl_voucherType'

	name	= db.Column(db.String(40))
	prefix	= db.Column(db.String(10))
	published = db.Column(db.Boolean, default=True)
	
	@classmethod
	def find_by_name(cls, _name):
		return cls.query.filter_by(name=_name).first()

	@classmethod
	def find_active_by_name(cls, _name):
		return cls.query.filter_by(name=_name).filter_by(published=True).first()


	#--------------insert_defaults
	@staticmethod
	def insert_defaults():
		_voucher_types_ = {'Opening Balance':'OB',
							'Opening Stock':'OS',
							'Contra Voucher':'CV', 
							'Payment Voucher':'PV', 
							'Receipt Voucher':'RV',
							'Journal Voucher':'JV',
							'PDC Payable':'PDCP',
							'PDC Receivable':'PDCR',
							'PDC Clearance':'PDCC',
							'Purchase Order':'PO',
							'Material Receipt':'MR',
							'Rejection Out':'RO',
							'Purchase Invoice':'PI',
							'Purchase Return':'PR',
							'Sales Quotation':'SQ',
							'Sales Order':'SO',
							'Delivery Note':'DN',
							'Rejection In':'RI',
							'Sales Invoice':'SI',
							'Sales Return':'SR',
							'Service Voucher':'SV',
							'Credit Note':'CN',
							'Debit Note':'DN',
							'Stock Journal':'SJ',
							'Physical Stock':'PS',
							'Daily Salary Voucher':'DSV',
							'Monthly Salary Voucher':'MSV',
							'Advance Payment':'AP'
							}
		for k,v in _voucher_types_.items():
			voucher = VoucherType.find_by_name(_name=k)
			if voucher is None:
				voucher = VoucherType(name=k,prefix=v)
				db.session.add(voucher)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False



#class SMS(Base):
#	__tablename__ = 'sms_api'

#	credits = db.Column(db.Float(precision=3))


#class AnonymousUser(AnonymousUserMixin):
#	nest_id = True
#	products = None
#	def can(self, permissions):
#		return False

#	def is_administrator(self):
#		return False
#	class nest:
#		def can(permissions):
#			return False

#		def is_administrator():
#			return False


#login_manager.anonymous_user = AnonymousUser
