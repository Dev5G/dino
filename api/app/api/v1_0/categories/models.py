from ....models import Base
from .... import db

class Category(Base):
	__tablename__ = 'tbl_categories'

	name = db.Column(db.String(20), nullable=False)
	abr = db.Column(db.String(5),nullable=False)
	nest_id = db.Column(db.Integer, db.ForeignKey('tbl_nests.id'))
	published = db.Column(db.Boolean, default=False)
	#Relationships
	#products = db.relationship('Product', backref='category')
	def json(self):
		return {
			'name'			:self.name,
			'abr'			:self.abr,
			'id'			:self.id,
		}