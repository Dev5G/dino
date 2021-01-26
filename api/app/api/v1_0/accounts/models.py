from ....models import Base
from .... import db


#Account tables for hen accounts
hen_cash_accounts_table = db.Table('tbl_hen_cash_accounts',
								db.Column('hen_id', db.Integer,db.ForeignKey('tbl_hens.id'), nullable=False),
								db.Column('account_id', db.Integer,db.ForeignKey('tbl_account_cash.id'), nullable=False))
hen_gold_accounts_table = db.Table('tbl_hen_gold_accounts',
								db.Column('hen_id', db.Integer,db.ForeignKey('tbl_hens.id'), nullable=False),
								db.Column('account_id', db.Integer,db.ForeignKey('tbl_account_gold.id'), nullable=False))


class AccountType(Base):
	__tablename__  = 'tbl_ledger_type'

	title = db.Column(db.String(11), nullable=False)
	#Relationship
	account_groups = db.relationship('AccountGroup', backref='account_type')

	@classmethod
	def find_by_title(cls, type_title):
		return cls.query.filter_by(title=type_title).first()

	@classmethod
	def find_by_id(cls, id):
		return cls.query.filter_by(id=id).first()

	#--------------insert_defaults
	@staticmethod
	def insert_defaults():
		_account_types_ = ('Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses')
		for a in _account_types_:
			account = AccountType.query.filter_by(title=a).first()
			if account is None:
				account = AccountType(title=a)
				db.session.add(account)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class AccountGroup(Base):
	__tablename__ = 'tbl_ledger_group'

	title = db.Column(db.String(20), nullable=False)
	account_type_id = db.Column(db.Integer, db.ForeignKey('tbl_ledger_type.id'), nullable=False)
	account_under = db.Column(db.String(20), nullable=True)

	#cash_accounts = db.relationship('AccountCash', backref='account_group')

	#-------------------Query methods-----------@
	@classmethod
	def find_by_title(cls, title):
		try:
			return cls.query.filter_by(title=title).first()
		except Exception as e:
			print(str(e))
			return None
	#--------------insert_defaults
	@staticmethod
	def insert_defaults():
		#Account Groups
		_account_groups_ = {
		 'Capital Account'     : ['Liabilities', None],
		 'Loans'               : ['Liabilities', None],
		 'Current Liabilities' : ['Liabilities', None],
		 'Fixed Assets'        : ['Assets', None],
		 'Investments'         : ['Assets', None],
		 'Current Assets'      : ['Assets', None],
		 'Divisions'           : ['Liabilities', None],
		 'Misc Expenses'       : ['Assets', None],
		 'Suspense A/C'        : ['Liabilities', None],
		 'Sales Account'       : ['Revenue', None],
		 'Purchase Account'    : ['Expenses', None],
		 'Direct Incom'        : ['Revenue', None],
		 'Direct Expenses'     : ['Expenses', None],
		 'Indirect Income'     : ['Revenue', None],
		 'Indirect Expenses'   : ['Expenses', None],
		 'Reserves &Surplus'   : ['Liabilities', 'Capital Account'],
		 'Bank OD A/C'         : ['Liabilities', 'Loans'],
		 'Securd Loans'        : ['Liabilities', 'Loans'],
		 'UnSecured Taxes'     : ['Liabilities', 'Loans'],
		 'Duties& Taxes'       : ['Liabilities', 'Current Liabilities'],
		 'Provisions'          : ['Liabilities', 'Current Liabilities'],
		 'Sundry Creditors'    : ['Liabilities', 'Current Liabilities'],
		 'Stock-in-Hand'       : ['Assets', 'Current Assets'],
		 'Deposits'            : ['Assets', 'Current Assets'],
		 'Loans & Advances'    : ['Assets', 'Current Assets'],
		 'Sundry Debtors'      : ['Assets', 'Current Assets'],
		 'Cash-in Hand'        : ['Assets', 'Current Assets'],
		 'Gold-in Hand'        : ['Assets', 'Current Assets'],
		 }
		for k , v in _account_groups_.items():
			account = AccountGroup.query.filter_by(title=k).first()
			if account is None:
				ac_type = AccountType.find_by_title(v[0])
				account = AccountGroup(title=k, account_under=v[1],account_type_id=ac_type.id)
				db.session.add(account)
		try:
			db.session.commit()
			return True
		except Exception as e:
			db.session.rollback()
			print(str(e))
			return False


class AccountMethods:
	pass


class SupplierCashAccounts(Base):
	__tablename__ = 'tbl_supplier_cash_accounts'

	account_id = db.Column(db.Integer, db.ForeignKey('tbl_account_cash.id'), nullable=False)
	supplier_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	hen_id = db.Column(db.Integer, db.ForeignKey('tbl_hens.id'), nullable=False)

	supplier = db.relationship('User', backref='cash_accounts_as_supplier',uselist=False)

class SupplierGoldAccounts(Base):
	__tablename__ = 'tbl_supplier_gold_accounts'

	account_id = db.Column(db.Integer, db.ForeignKey('tbl_account_gold.id'), nullable=False)
	supplier_id = db.Column(db.Integer, db.ForeignKey('tbl_users.id'), nullable=False)
	hen_id = db.Column(db.Integer, db.ForeignKey('tbl_hens.id'), nullable=False)
	
	supplier = db.relationship('User', backref='gold_accounts_as_supplier',uselist=False)

	
class AccountCash(Base, AccountMethods):
	__tablename__ = 'tbl_account_cash'

	title = db.Column(db.String(20), nullable=False)
	opening_balance = db.Column(db.Float(precision=3))
	remaining_balance = db.Column(db.Float(precision=3))
	account_group_id = db.Column(db.Integer, db.ForeignKey('tbl_ledger_group.id'), nullable=False)

	hens = db.relationship('Hens',secondary=hen_cash_accounts_table, backref=db.backref('cash_accounts',lazy='dynamic'))
	
	def __init__(self, **kwargs):
		super(AccountCash, self).__init__(**kwargs)
		if self.remaining_balance is None and self.opening_balance is not None:
			self.remaining_balance = self.opening_balance
		if not self.opening_balance:
			self.opening_balance = 0
			self.remaining_balance= 0
		if self.account_group_id is None:
			ag = AccountGroup.find_by_title('Cash-in Hand')
			self.account_group_id = ag.id

	#Return a json mapped representation
	def json(self):
		account = {
			'title'				: self.title,
			'openining'			: self.opening_balance,
			'remaining'			: self.remaining_balance,
			'default'			: self.default,
			}
		return account
				
	@classmethod
	def find_default_by_user_id(cls, user_id):
		try:
			return cls.query.filter_by(user_id=user_id).filter_by(default=True).first()
		except Exception as e:
			return None

	@classmethod
	def find_by_title_group_and_user(cls, _title,_group,_user):
		try:
			return cls.query.filter_by(title=_title).filter_by(account_group_id=_group).filter_by(user_id=_user).first()
		except Exception as e:
			return None


class AccountGold(Base,AccountMethods):
	__tablename__ = 'tbl_account_gold'

	title = db.Column(db.String(20), nullable=False)
	opening_balance = db.Column(db.Float(precision=3))
	remaining_balance = db.Column(db.Float(precision=3))
	carat_id = db.Column(db.Integer, db.ForeignKey('tbl_carats.id'), nullable=False)
	account_group_id = db.Column(db.Integer, db.ForeignKey('tbl_ledger_group.id'), nullable=False)
	
	hens = db.relationship('Hens',secondary=hen_gold_accounts_table, backref=db.backref('gold_accounts',lazy='dynamic'))
	
	def __init__(self, **kwargs):
		super(AccountGold,self).__init__(**kwargs)
		if self.remaining_balance is None and self.opening_balance is not None:
			self.remaining_balance = self.opening_balance
		if not self.opening_balance:
			self.opening_balance = 0
			self.remaining_balance= 0
		if self.account_group_id is None:
			ag = AccountGroup.find_by_title('Gold-in Hand')
			self.account_group_id = ag.id
		if self.carat_id is None:
			self.carat_id = 21
		
	def json(self):
		account = {
			'title'				: self.title,
			'openining'			: self.opening_balance,
			'remaining'			: self.remaining_balance,
			'default'			: self.default,
			}
		return account
