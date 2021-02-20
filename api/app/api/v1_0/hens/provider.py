from .models import Hens
from ..user.provider import Provider as User
from ....utils import  jsonList


class Provider:
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
