from ....models import Base
from .... import db



class Hens(Base):
	"""Hens -- Counters or Other shops that people might want to manage 
	It basically is a term for different accounts and shops
	"""
	__tablename__ = 'tbl_hens'

	name = db.Column(db.String(20), nullable=False)
	nest_id = db.Column(db.Integer, db.ForeignKey('tbl_nests.id'))
	keeper_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'))

	def json(self):
		return {
			'id'		:self.id,
			'name'		:self.name,
			'nest_id'	:self.nest_id,
			'keeper'	:self.keeper.gid
			}

	

	def add_cash_account(self, account):
		"""We create an account and add the hen to it. 
		this way , we can have one hen and multiple accounts
		"""
		try:
			self.cash_accounts.append(account)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	
	def add_gold_account(self, account):
		"""We create an account and add the hen to it. 
		this way , we can have one hen and multiple accounts
		"""
		try:
			self.gold_accounts.append(account)
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False
	#-------------Query Methods-------------
	@classmethod
	def find_by_name_and_nest(cls, name, nest_id):
		try:
			cls.query.filter(name == name, nest_id == nest_id).first()
		except Exception as e:
			print(str(e))
			return None
