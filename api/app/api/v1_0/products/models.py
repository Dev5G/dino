from ....models import Base
from .... import db
from ....utils import extract_max
from ..sales.models import  SalesDetails

class Product(Base):
	__tablename__ = 'tbl_products'

	product_code = db.Column(db.String(30))
	category_id = db.Column(db.Integer, db.ForeignKey('tbl_categories.id'), nullable=False)
	carat_id = db.Column(db.Integer, db.ForeignKey('tbl_carats.id'), nullable=False)
	supplier_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	design_no = db.Column(db.String(15))
	size = db.Column(db.Integer)
	metal_id = db.Column(db.Integer, db.ForeignKey('tbl_metals.id'), nullable=False)
	qty = db.Column(db.Integer)
	ratti_method_id = db.Column(db.Integer, db.ForeignKey('tbl_ratti_method.id'), nullable=False)
	weight = db.Column(db.Float(precision=3))
	waste = db.Column(db.Float(precision=3))
	ratti = db.Column(db.Float(precision=3))
	pure_weight = db.Column(db.Float(precision=3))
	#waste in grams
	weight_gm = db.Column(db.Float(precision=3))
	description = db.Column(db.String(120))
	hen_id = db.Column(db.Integer, db.ForeignKey('tbl_hens.id'), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'),nullable=False)

	#Relationships
	#images  = db.relationship('ProductImages', backref='product')
	#stones  = db.relationship('ProductStones', backref='product')

	#Not complete
	def __repr__(self):
		 return f'<Product-{self.id}: Code {self.product_code} Design {self.design_no}\nCategory {self.category.name} Carat {self.carat.value}\n\
					Supplier {self.supplier.details.first_name} >'

	def json(self):
		return {
			'id'				:self.id,
			'product_code'		:self.product_code,
			'category'			:self.category.name,
			'carat'				:self.carat.value,
			'supplier'			:self.supplier.details.first_name + ' ' + self.supplier.details.last_name if (self.supplier and self.supplier.details) else self.supplier.gid,
			'design_no'			:self.design_no,
			'size'				:self.size,
			'metal'				:self.metal.name,
			'qty'				:self.qty,
			'ratti_method'		:self.ratti_method.name,
			'weight'			:self.weight,
			'waste'				:self.waste,
			'ratti'				:self.ratti,
			'desc'				:self.description,
			'operator'			:self.user.details.firstname + ' ' + self.user.details.lastname if (self.user and self.user.details) else self.user.gid,
			'status'			:self.get_status(self.id)
			}

	def toJson(self):
		return {
			'id'						:self.id,
			'product_code'			:self.product_code,
			'category_id'			:self.category_id,
			'carat_id'				:self.carat_id,
			'supplier_id'			:self.supplier_id,
			'design_no'				:self.design_no,
			'size'					:self.size,
			'metal_id'				:self.metal_id,
			'qty'						:self.qty,
			'ratti_method_id'		:self.ratti_method_id,
			'weight_gm'				:self.weight_gm,
			'pure_weight'			:self.pure_weight,
			'weight'					:self.weight,
			'waste'					:self.waste,
			'ratti'					:self.ratti,
			'description'			:self.description,
			'hen_id'					:self.hen_id,
			'user_id'				:self.user_id
			}


	@classmethod
	def get_status(cls,id) -> int:
		# try:
		# 	from ..sales.models import  SalesDetails
		# except Exception as e:
		# 	print(str(e))
		# 	raise ImportError('SalesDetails class not found! Perhaps it has been moved!')
		"""Returns the status of the product 
		`Sold` = 0 , `Damaged`  = 1 , `Missing` = 2 or `Available` = 3
		"""
		status,_ = SalesDetails.find_by_product(id)
		if status:
			return 'Sold'
		return 'Available'
	#@classmethod
	#def find_by_uuid(cls, uuid):
	#	try:
	#		return cls.query.filter_by(uuid=uuid).first()
	#	except Exception as e:
	#		return None

	@classmethod
	def find_by_code_and_nest(cls, code,nest_id):
		try:
			return cls.query.filter_by(product_code=code.upper()).filter_by(nest_id=nest_id).first()
		except Exception as e:
			return None

	#@classmethod
	#def find_by_uuid_and_nest(cls, _uuid,_nest_id):
	#	try:
	#		return cls.query.filter_by(uuid=_uuid).filter_by(nest_id=_nest_id).first()
	#	except Exception as e:
	#		return None


	@classmethod
	def generate_code(cls,nest_id,category_id):
		try:
			_pc = cls.get_max(nest_id,category_id)
			_mpc = extract_max(_pc)
			_mpc = _mpc + 1
			_c =   Category.find_by_id(id=category_id)
			_code = _c.abr + f'{_mpc:05d}'
			return _code
		except Exception as e:
			print(str(e))
			return None

	@classmethod
	def get_max(cls, nest_id, category_id):
		try:
			return db.session.query(db.func.max(Product.product_code)).filter_by(nest_id=nest_id).filter_by(category_id=category_id).scalar() or '0'
		except Exception as e:
			print(str(e))
			return None

	@classmethod
	def get_max_count(cls, nest_id, category_id):
		try:
			_pc = db.session.query(db.func.max(Product.product_code)).filter_by(nest_id=nest_id).filter_by(category_id=category_id).scalar() or '0'
			return extract_max(_pc)
		except Exception as e:
			print(str(e))
			return None
