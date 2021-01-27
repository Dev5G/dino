from ....models import Base
from .... import db
from werkzeug.security import  generate_password_hash , check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from datetime  import datetime
import uuid
#--------Ownership relationship------
nest_keeper_table=db.Table('tbl_keepers',
						db.Column('keeper_id',db.Integer,db.ForeignKey('tbl_users.id'), nullable=False),
						db.Column('nest_id',db.Integer,db.ForeignKey('tbl_nests.id'), nullable=False),
						)
#-------Supplier relationship-----
suppliers_table=db.Table('tbl_suppliers',
						db.Column('user_id',db.Integer,db.ForeignKey('tbl_users.id'), nullable=False),
						db.Column('nest_id',db.Integer,db.ForeignKey('tbl_nests.id'), nullable=False),
						)

#--------Salesman relationship------
salesman_table=db.Table('tbl_salesman',
						db.Column('user_id',db.Integer,db.ForeignKey('tbl_users.id'), nullable=False),
						db.Column('hen_id',db.Integer,db.ForeignKey('tbl_hens.id'), nullable=False),
						)

class User(Base):
	__tablename__ = 'tbl_users'

	gid = db.Column(db.BigInteger, unique=True, index=True)
	last_seen = db.Column(db.DateTime, default=datetime.utcnow)
	password_hash = db.Column(db.String(128))
	confirmed = db.Column(db.Boolean, default=False)

	#Single value relationships
	details = db.relationship('UserDetails',backref='user',uselist=False)
	#nest = db.relationship('Nest',backref='user',foreign_keys='Nest.user_id',uselist=False)
	#phones = db.relationship('Phone',backref='user')
	products_as_user = db.relationship('Product',backref='user',foreign_keys='Product.user_id')
	products_as_supplier = db.relationship('Product',backref='supplier',foreign_keys='Product.supplier_id')
	hens = db.relationship('Hens', backref='keeper')
	#cash_accounts =  db.relationship('AccountCash', backref='user')
	#gold_accounts =  db.relationship('AccountGold', backref='user')
	#gg_care_of = db.relationship('GoldGiven', backref='care_of', foreign_keys='GoldGiven.care_of_id')
	#gg_supplier = db.relationship('GoldGiven', backref='supplier', foreign_keys='GoldGiven.supplier_id')
	#gg_user = db.relationship('GoldGiven', backref='user', foreign_keys='GoldGiven.user_id')
	#cust_nests = db.relationship('Nest',secondary=customers_table, backref=db.backref('customers',lazy='dynamic'))
	nest = db.relationship('Nest',secondary=nest_keeper_table, backref=db.backref('keepers',lazy='dynamic'),uselist=False)
	nests_as_supplier = db.relationship('Nest',secondary=suppliers_table, backref=db.backref('suppliers',lazy='dynamic'))
	hens_as_salesman = db.relationship('Hens',secondary=salesman_table, backref=db.backref('salesmen',lazy='dynamic'))
	#salesman_nests = db.relationship('Nest',secondary=salesman_table, backref=db.backref('salesmen',lazy='dynamic'))
	def __repr__(self):

		 return f'<User-{self.id}: gid {self.gid}  last_seen {self.last_seen} confirmed {self.confirmed}>'

	def __init__(self, **kwargs):
		super(User, self).__init__(**kwargs)
		if	not self.gid:
			self.gid = self.generate_gid()
			
	def json(self):
		user = {
			'id'					: self.id ,
			'gid'					: self.gid ,
			'last_seen'				: self.last_seen,
			'confirmed'				: self.confirmed,
			}
		#if self.nest:
		#	user['nest'] = self.nest.json()
		if self.details:
			user.update(self.details.json())
		return user

	@property
	def password(self):
		raise AttributeError('password is not a readable attribute')

	@password.setter
	def password(self, password):
		self.password_hash = generate_password_hash(password, method='sha256')

	def verify_password(self, password):
		return check_password_hash(self.password_hash, password)

	def generate_confirmation_token(self, expiration=3600):
		s = Serializer(current_app.config['SECRET_KEY'], expiration)
		return s.dumps({'confirm': self.id})

	def generate_token(self, expiration):
		s = Serializer(current_app.config['SECRET_KEY'],\
				 expires_in=expiration)
		return s.dumps({'id': self.id})

	def confirm(self, token):
		s = Serializer(current_app.config['SECRET_KEY'])
		try:
			data = s.loads(token)
		except Exception as e:
			print(e)
			return False
		if data.get('confirm') != self.id:
			return False
		self.confirmed = True
		db.session.add(self)
		try:
			db.session.commit()
		except Exception as e:
			print(str(e))
			return True

	def gravatar(self, size=100, default='identicon', rating='g'):
		if request.is_secure:
			url = 'https://secure.gravatar.com/avatar'
		else:
			url = 'http://www.gravatar.com/avatar'
		hash = self.avatar_hash or hashlib.md5(self.email.encode('utf-8')).hexdigest()
		return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
			url=url, hash=hash, size=size, default=default, rating=rating)

	def ping(self):
		self.last_seen = datetime.utcnow()
		db.session.add(self)
		if self.nest_id:
			if self.nest:
				self.nest.ping()
		try:
			db.session.commit()
		except Exception as e:
			print(str(e))

	def can(self, permissions):
		return self.role is not None and \
			(self.role.permissions & int(permissions)) == int(permissions)

	def is_administrator(self):
		return self.can(Permission.ADMINISTER)

	@classmethod
	def generate_gid(cls):
		while True:
			id = str(uuid.uuid4().int >> 100)
			status, _ = cls.find_by_gid(gid=id)
			if not status:
				break
		return id
	
	def add_phone(self, phone):
		try:
			self.phones.append(phone)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------------Login user--------------
	@classmethod
	def check_user_login(cls, email, password):
		user = cls.find_by_email(email=email)
		if not user:
			return None
		if user and user.verify_password(password):
			return user
		else:
			return None

	@classmethod
	def login(cls, gid , password):
		"""return [bool, value]"""
		status, user = cls.find_by_gid(gid)
		if status and not user.verify_password(password):
			return False,'Invalid credentials! Please check your "GID" or "PASSOWRD".'
		return status, user

	@classmethod
	def find_by_gid(cls, gid):
		try:
			q = cls.query.filter_by(gid=gid).first()
			if q:
				return True, q
			return False, None
		except Exception as e:
			print(str(e))
			return False, str(e)


class UserDetails(Base):
	__tablename__ = 'tbl_user_details'

	first_name = db.Column(db.String(32))
	last_name  = db.Column(db.String(32))
	bio = db.Column(db.Text())
	city_id = db.Column(db.String(64))
	country_id = db.Column(db.String(64))
	area_id = db.Column(db.String(64))
	address = db.Column(db.String(64))
	avatar_hash = db.Column(db.String(32))
	use_avatar_hash = db.Column(db.Boolean, default=True)
	imageUrl = db.Column(db.String(32))
	user_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'))

	#def __init__(self, **kwargs):
	#	super(User, self).__init__(**kwargs)
	#	#self.uuid = uuid.uuid4()
	#	#if self.role is None:
	#	#	if self.phone == current_app.config['ADMIN_PHONE']:
	#	#		self.role = Role.query.filter_by(permissions=0x7ff).first()
	#	#	if self.role is None:
	#	#		self.role = Role.query.filter_by(default=True).first()
	#	if self.email and self.email.primaryEmail() is not None and self.avatar_hash is None:
	#		self.email.email = self.email.email.lower()
	#		self.avatar_hash = hashlib.md5(self.email.encode('utf-8')).hexdigest()
	def json(self):
		details = {
			'fullName'		:self.full_name,
			'bio': self.bio,
			#'use_hash': self.use_avatar_hash,
			'address': self.address,
			'imageUrl': self.imageUrl,
			}
		return details

	@property
	def full_name(self):
		return f'{self.first_name} {self.last_name}'
