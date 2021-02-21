from .models import Hens
from ..user.provider import Provider as User
from ....utils import  jsonList


class Provider:
	@staticmethod
	def find_hen_accounts(gid,value,joined,limit):
		'''		'''
		status,u = User.find_by_gid(gid)
		try:
			if status:
				hen  = Hens.find_by_id(value)
				if not hen.id in u.hens:
					return False, 'You are vialoating security rules, your account may get banned.'
				accounts = None
				if limit == 1:
					accounts = hen.cash_accounts.first()
					if joined == 'true':
						accounts = accounts.json()
					accounts = accounts.json() #TODO:// change to handle None joined toJSon() method
				if limit == 'all':
					accounts = hen.cash_accounts.all()
					#TODO:// Handle join condition
					accounts = jsonList(accounts)
				return True,accounts
			return False, None
		except Exception as e:
			print(str(e))
			return False, str(e)

	@staticmethod
	def find_by_id(id):
		"""return [bool, value]"""
		return Hens.find_by_id(1)

	@staticmethod
	def find_all_hens(gid):
		"""Return -> List<Hens>"""
		status,u = User.find_by_gid(gid)
		if status and u.nest:
			status,hens = Hens.find_all_by_nest(nest_id=u.nest.id)
			if status:
				hens = jsonList(hens)
				return True, hens
		return False,'No hens found by this user, and store!'

	@staticmethod
	def add_hen(gid,opening_cash,opening_gold,opening_gold24,name) -> Hens: 
		"""gid, opening_cash, opening_gold,opening_gold24, rest of the params 
		
		return [bool, value]"""
		status,u = User.find_by_gid(gid)
		if status and u.nest:
			hen = Hens(name=name)
			hen.nest_id = u.nest.id
			hen.keeper_id = u.id
			try:
				from ..accounts.accounts import Accounts
				hen.add_to_nest()
				status = 0
				cash, gold, gold24 = Accounts.create_cash_and_gold(opening_cash=opening_cash,
													   opening_gold=opening_gold,
													   opening_gold24=opening_gold24)
				if	hen.add_cash_account(cash):
					status = status + 1
				if	hen.add_gold_account(gold):
					status = status+1
				if hen.add_gold_account(gold24):
					status = status+1
				if	status > 2:
					return True ,hen
				if hen:
					hen.delete_from_db()
				if cash:
					cash.delete_from_db()
				if gold:
					gold.delete_from_db()
				if gold24:
					gold24.delete_from_db()
				return False, 'Something went while adding account'	
			except Exception as e:
				print(str(e))
				return False, str(e)
		return False, 'Somthing went wrong'
