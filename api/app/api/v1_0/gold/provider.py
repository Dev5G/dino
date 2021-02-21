from ....models import GoldRate
from ..user.provider import Provider as User
from .models import GoldPurchase
from ....utils import  jsonList


class Provider:
	@staticmethod
	def find_goldrates_filtered(gid, filter) -> list:
		"""
			Finds a list of all gold rates for the current user
		"""
		goldrates = None
		if gid:
			user = User.find_by_gid(gid)
			goldrates = GoldRate.find_all_filtered(nest_id=user.nest.id, filter=filter)
		if goldrates:
			return jsonList(goldrates)
		goldrates = GoldRate.find_all_filtered(nest_id=None, filter=filter)
		return jsonList(goldrates) if goldrates else None

	@staticmethod
	def find_goldrates(identity) -> list:
		"""
			Finds a list of all gold rates for the current user
		"""
		user = User.find_by_gid(identity)
		goldrates = GoldRate.find_all(nest_id=user.nest.id)
		if goldrates:
			return jsonList(goldrates)
		return None

	@staticmethod
	def find_goldrate_today(identity) -> GoldRate:
		"""
			Finds todays gold rate for the current user if it exists else returns None
		"""
		user = User.find_by_gid(identity)
		gr = GoldRate.find_today(nest_id=user.nest.id)
		if gr:
			return gr
		return None

	@staticmethod
	def add_new_rate(rate, rate24k, identity) -> GoldRate:
		"""-
		Add new rate -> GoldRate
		"""
		user = User.find_by_gid(gid=identity)
		#get carat id from settings table "settings -> carat_id"
		carat_id = 1
		if user:
			g =	GoldRate(value=rate,value24k=rate24k,carat_id=carat_id,nest_id=user.nest.id)
			if g.save_to_db():
				return g
		return None

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