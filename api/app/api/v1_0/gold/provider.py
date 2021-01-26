from ....models import GoldRate
from ..user.provider import Provider as User
from .models import GoldPurchase
from ....utils import  jsonList

class Provider:
	@staticmethod
	def find_gold_purchases(gid) -> list:
		u = User.find_by_gid(gid)
		if u and u.store:
			gps = GoldPurchase.find_all(u.store.id)
			if gps:
				gps = jsonList(gps)
				return gps
		return None

	@staticmethod
	def add_gold_purchase(gid,**kwargs) -> GoldPurchase: 
		u = User.find_by_gid(gid)
		if u and u.store:
			gp = GoldPurchase(**kwargs)
			gp.store_id = u.store.id
			gp.user_id  = u.id
			try:
				gp.save_to_db()
				return	gp
			except Exception as e:
				return None
		return None

class RatesProvider():
	@staticmethod
	def get_all_rates_today() -> list:
		g = GoldRate.find_all_today()
		if g:
			g = jsonList(g)
			return g
		return None