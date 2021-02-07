from ....models import Base
from .... import db
from ....utils import extract_max


class Category(Base):
	__tablename__ = 'tbl_categories'

	name = db.Column(db.String(20), nullable=False)
	abr = db.Column(db.String(5),nullable=False)
	nest_id = db.Column(db.Integer, db.ForeignKey('tbl_nests.id'))
	published = db.Column(db.Boolean, default=False)
	#Relationships
	products = db.relationship('Product', backref='category')
	def json(self):
		return {
			'name'			:self.name,
			'abr'			:self.abr,
			'id'			:self.id,
			'max'			:self.get_max(self.id),
		}
	
	@classmethod
	def find_product_category_by_code(cls,product_code,nest_id):
		try:
			abr = ''
			for a in product_code:
				if(a.isalpha()) == True:
					abr +=a
			o = cls.query.filter_by(abr=abr).filter_by(nest_id=nest_id).first()
			if o:
				return True, o
			return False, None
		except Exception as e:
			print(str(e))
			return False, None

	@classmethod
	def get_max(cls,id):
		try:
			try:
				from ..products.models import Product
			except Exception as e:
				return 0
			_pc= db.session.query(db.func.max(Product.product_code)).filter_by(category_id=id).scalar() or '0'
			return extract_max(_pc)
		except Exception as e:
			print(str(e))
			return 0