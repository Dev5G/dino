from ....models import Base
from .... import db

class Sales(Base):
	__tablename__	= 'tbl_sales'

	customer_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	salesman_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	cash_account_id = db.Column(db.Integer, db.ForeignKey('tbl_account_cash.id'), nullable=False)
	care_of_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	hen_id = db.Column(db.Integer, db.ForeignKey('tbl_hens.id'), nullable=False)
	description = db.Column(db.String(120))#add an automated desc to keep track of to whom the gold was sold , record the tags, name and gid
	total_amount = db.Column(db.Float(precision=3))
	net_amount = db.Column(db.Float(precision=3))
	discount_amount = db.Column(db.Float(precision=3))
	balance_amount = db.Column(db.Float(precision=3))
	user_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	
	sale_details = db.relationship('SalesDetails', backref='sale',cascade='all, delete',passive_deletes=True)

	def __init__(self, **kwargs):
		super(Sales, self).__init__(**kwargs)
		#voucherType = VoucherType.find_active_by_name('Sales Invoice')
		#_i	= generate_invoice_no(prefix=voucherType.prefix,num=Sales.get_max_invoice_without_store() )
		#self.invoiceNo = _i
		#self.voucherType_id = voucherType.id
		

	##Not complete
	#def __repr__(self):
	#	 return f'<Product: Code {self.product_code} Design {self.design_no}\nCategory {self.category.name} Carat {self.carat.value}\n\
	#				Supplier {self.supplier.username} >'

	def json(self):
		return {
			'id'				:self.id,
			'invoiceNo'			:self.invoiceNo,
			'product_code'		:self.product_code,
			'category'       :self.category.name,
			'carat'			 :self.carat.value,
			'supplier'		 :self.supplier.details.firstname + ' ' + self.supplier.details.lastname if (self.supplier and self.supplier.details) else self.supplier.gid,
			'design_no'      :self.design_no,
			'size'           :self.size,
			'metal'			 :self.metal.name,
			'qty'            :self.qty,
			'ratti_method'	 :self.ratti_method.name,
			'weight'         :self.weight,
			'waste'          :self.waste,
			'ratti'          :self.ratti,
			'desc'			 :self.description,
			'store'			 :self.store.name,
			'operator'		 :self.user.details.firstname + ' ' + self.user.details.lastname if (self.user and self.user.details) else self.user.gid,
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
	#-------------------Delete method-----------@
	def add_related_values(self):
		try:
			print('adding balance' + str(self.balance_amount))
			return True
		except Exception as e:
			print(str(e))
			return False
	#-------------------Query methods-----------@
	@classmethod
	def find_all(cls, store_id):
		try:
			return cls.query.filter_by(store_id=store_id).outerjoin(SalesDetails).filter(SalesDetails.product_id != None).outerjoin(Orders).all()
		except Exception as e:
			return None


	@classmethod
	def find_by_code_and_store(cls, code,store_id):
		try:
			return cls.query.filter_by(product_code=code.upper()).filter_by(store_id=store_id).first()
		except Exception as e:
			return None

	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None

	@classmethod
	def generate_code(cls,store_id):
		try:
			_pc = cls.get_max_invoice(store_id)
			_mpc = extract_max(_pc)
			_mpc = _mpc + 1
			_c =   Category.find_by_uuid(uuid=category_id)
			_code = _c.abr + f'{_mpc:05d}'
			return _code
		except Exception as e:
			print(str(e))
			return None

	@classmethod
	def get_max_invoice(cls, store_id):
		try:
			return db.session.query(db.func.max(Sales.invoiceNo)).filter_by(store_id=store_id).scalar() or '0'
		except Exception as e:
			print(str(e))
			return None

	@classmethod
	def get_max_invoice_without_store(cls):
		try:
			today = date.today()
			y = today - timedelta(days=1)
			t = today + timedelta(days=1)
			return db.session.query(db.func.max(Orders.order_no).filter(cls.created_date>y, cls.created_date<t)).scalar() or '0'
		except Exception as e:
			print(str(e))
			return None


class SalesDetails(Base):
	__tablename__	= 'tbl_sales_details'

	product_id = db.Column(db.Integer, db.ForeignKey('tbl_products.id'), nullable=False)
	sale_id = db.Column(db.Integer, db.ForeignKey('tbl_sales.id'), nullable=False)
	total_amount = db.Column(db.Float(precision=3)) #actual price  (calculated on the total weight after applying waste in percentage)
	net_amount = db.Column(db.Float(precision=3)) #net price after discount
	waste_in_gram = db.Column(db.Float(precision=3))

	product = db.relationship('Product',  backref=db.backref('sale_detail',uselist=False),uselist=False)

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

	@classmethod
	def find_by_product(cls, id):
		try:
			o= cls.query.filter_by(product_id=id).first()
			if o:
				return True, o
			return False, None
		except Exception as e:
			print(str(e))
			return False,str(e)

	@classmethod
	def find_by_sale(cls, sale_id):
		try:
			return cls.query.filter_by(sale_id=sale_id).all()
		except Exception as e:
			return None


class Orders(Base):
	__tablename__  = 'tbl_orders'

	sale_detail_id = db.Column(db.Integer, db.ForeignKey('tbl_sales_details.id'), nullable=False)
	order_no	= db.Column(db.String(20))
	is_completed = db.Column(db.Boolean, default=False)


	#add a method to reuse order numbers 
	#orders will be tracked with date and order numbers
	def __init__(self, **kwargs):
		super(Orders, self).__init__(**kwargs)
		_o	= generate_invoice_no(prefix=None,num=Orders.get_max_orders_without_store() )
		self.order_no = _o

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
	def find_all(cls, store_id):
		try:
			return cls.query.filter_by(store_id=store_id).all()
		except Exception as e:
			return None


	@classmethod
	def find_by_uuid(cls, uuid):
		try:
			return cls.query.filter_by(uuid=uuid).first()
		except Exception as e:
			return None

	@classmethod
	def find_by_code_and_store(cls, code,store_id):
		try:
			return cls.query.filter_by(product_code=code.upper()).filter_by(store_id=store_id).first()
		except Exception as e:
			return None

	@classmethod
	def find_by_id(cls, _id):
		try:
			return cls.query.filter_by(id=_id).first()
		except Exception as e:
			return None

	@classmethod
	def get_max_invoice(cls, store_id):
		try:
			return db.session.query(db.func.max(Orders.invoiceNo)).filter_by(store_id=store_id).scalar() or '0'
		except Exception as e:
			print(str(e))
			return None

	@classmethod
	def get_max_orders_without_store(cls):
		try:
			today = date.today()
			y = today - timedelta(days=1)
			t = today + timedelta(days=1)
			return db.session.query(db.func.max(Orders.order_no).filter(cls.created_date>y, cls.created_date<t)).scalar() or '0'
		except Exception as e:
			print(str(e))
			return None


class SplitSale(Base):
	__tablename__ = 'tbl_split_sale'

	weight = db.Column(db.Float(precision=3))#actual weight
	split_weight = db.Column(db.Float(precision=3))#weight after split
	reused = db.Column(db.Boolean, default=False) #keeps track if the gold that was left has already been reused or not!
	sale_detail_id = db.Column(db.Integer, db.ForeignKey('tbl_sales_details.id'), nullable=False)


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


class SalesReturns(Base):
	__tablename__	= 'tbl_sales_returns'

	sale_id	= db.Column(db.Integer, db.ForeignKey('tbl_sales.id'), nullable=False)
	description	= db.Column(db.String(120))
	
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
			db.session.rollback()
			print(str(e))
			return False


	@classmethod
	def find_by_sale(cls, sale_id):
		try:
			s = cls.query.filter_by(sale_id=sale_id).first()
			if s:
				return True
			return False
		except Exception as e:
			print(str(e))
			return False


class Balance(Base):
	__tablename__ = 'tbl_balance'

	sale_id = db.Column(db.Integer, db.ForeignKey('tbl_sales.id'), nullable=False)
	dr_amount = db.Column(db.Float(precision=3))
	cr_amount = db.Column(db.Float(precision=3))


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
