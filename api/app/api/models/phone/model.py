from ....models import Base
from .... import db
import phonenumbers as Ph

user_phone_table = db.Table('tbl_user_phone',
								db.Column('user_id', db.Integer,db.ForeignKey('tbl_users.id'), nullable=False),
								db.Column('phone_id', db.Integer,db.ForeignKey('tbl_phones.id'), nullable=False))

class Phone(Base):
	__tablename__ = 'tbl_phones'

	national_number = db.Column(db.String(12), nullable=False)
	cc = db.Column(db.String(12), nullable=False)
	is_landline = db.Column(db.Boolean, default=False)
	primary = db.Column(db.Boolean, default=False)

	user = db.relationship('User',secondary=user_phone_table, backref=db.backref('phones',lazy='dynamic'),uselist=False)
	
	def json(self):
		return {
			'national_number'	: self.national_number,
			'cc'					: self.cc,
			'is_landline'		: self.is_landline
		}
	@property
	def number(self):
		x = Ph.parse(f'+{self.cc}{self.national_number}')
		x = Ph.format_number(x,Ph.PhoneNumberFormat.INTERNATIONAL)
		return x

	@number.setter
	def number(self,number):
		"""number property"""
		try:
			val = str(number)
			x= Ph.parse(val)
			print('Value in 1',x)
			if Ph.is_valid_number(x):
				print('correct 1x')
				self.national_number = x.national_number
				self.cc = x.country_code
		except Exception as exp:
			try:
				x = Ph.parse(f'+{val}')
				if not Ph.is_valid_number(x):
					raise ValueError('Format is not international (1).' + str(exp))
				self.national_number = x.national_number
				self.cc = x.country_code
			except Exception as e:
				x = val.lstrip('0')
				x = f'+{x}'
				x = Ph.parse(str(x))
				if not Ph.is_valid_number(x):
					raise ValueError('Incorrect phone number value supplied.' + str(e))
				self.national_number = x.national_number
				self.cc = x.country_code
	#Relationships
	#user_details = db.relationship('UserDetails',backref='phones')
	@classmethod
	def find_by_phone(cls,number):
		try:
			x =Ph.parse(number)
			if not Ph.is_possible_number(x):
				raise ValueError('Please enter number in international format including the "+" sign')
			phone = cls.query.filter_by(national_number=str(x.national_number)).first()
			if phone:
				return True, phone
			return False, 'Phone doesn\'t exist!'
		except Exception as e:
			phone = cls.query.filter_by(national_number=number).first()
			if phone:
				return True, phone
			return False, str(e)
