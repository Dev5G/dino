from ....models import Base
from .... import db

class GoldPurchase(Base):
	"""Gold Purchased from clients in shape of jewelry"""
	__tablename__ = 'tbl_gold_purchase'

	customer_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	care_of_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'))
	salesman_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'))
	goldrate_id = db.Column(db.Integer, db.ForeignKey('tbl_gold_rates.id'))
	amount_paid = db.Column(db.Integer)
	weight = db.Column(db.Float(precision=3))
	deduction = db.Column(db.Float(precision=3))
	description = db.Column(db.String(120))
	voucher_type_id = db.Column(db.Integer, db.ForeignKey('tbl_voucherType.id'))
	cash_account_id = db.Column(db.Integer, db.ForeignKey('tbl_account_cash.id'))
	hen_id = db.Column(db.Integer, db.ForeignKey('tbl_hens.id'), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'),nullable=False)


	def json(self):
		return {
			'id'				:self.id,
			'customer'			:self.customer_id,
			'care_of'			:self.care_of_id,
			'salesman'			:self.salesman_id,
			'goldrate'			:self.goldrate_id,
			'amount'			:self.amount_paid,
			'deduction'			:self.deduction,
			'desc'				:self.description,
			'voucher_type'		:self.voucher_type_id,
			'cash_account'      :self.cash_account_id,
			'operator'			:self.user_id,
			}
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