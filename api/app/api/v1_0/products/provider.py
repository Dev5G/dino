from ..user.provider import Provider as User
from .models import Product, DeletedProducts
from ....utils import jsonList
class Provider():
	

	@staticmethod
	def find_product_by_code(gid,code):
		"""Find product by id"""
		user = User.find_by_gid(identity)
		if user:
			p = Product.find_by_code_and_nest(code,user.nest.id)
			if p:
				return p
		return None

	@staticmethod
	def find_product(gid,id):
		"""Find product by id"""
		status,user = User.find_by_gid(gid)
		if user:
			status,p = Product.find_all_by_hens(user.hens,True,True)
			p = p.filter_by(id=id).first()
			if status:
				return True,p
		return False,None

	@staticmethod
	def find_products(gid) -> list:
		"""Return [bool, list:dict | str:error]"""
		status,u = User.find_by_gid(gid)
		p = None
		if status:
			status,p = Product.find_all_by_hens(u.hens,True)
			if status:
				p = jsonList(p)
		return status,p

	@staticmethod
	def save_product(gid,**kwargs) -> Product:
		status,u = User.find_by_gid(gid)
		if status:
			try:
				p = Product(**kwargs)
				p.user_id=u.id
				p.save_to_db()
				return True,p
			except Exception as e:
				print(str(e))
				return False, str(e)
		return False, None

	@staticmethod
	def update_product(gid,id,**kwargs) -> Product:
		status,u = User.find_by_gid(gid)
		if status:
			status,p = Provider.find_product(u.gid,id)
			try:
				if status:
					x = {**kwargs}
					p.carat_id			= x['carat_id']
					p.category_id		= x['category_id']
					p.description		= x['description']
					p.design_no			= x['design_no']
					p.metal_id			= x['metal_id']
					p.qty					= x['qty']
					p.ratti				= x['ratti']
					p.ratti_method_id	= x['ratti_method_id']
					p.size				= x['size']
					p.supplier_id		= x['supplier_id']
					p.waste				= x['waste']
					p.weight				= x['weight']
					p.pure_weight		= x['pure_weight']
					p.weight_gm			= x['weight_gm']
					p.hen_id				= x['hen_id']
					p.save_to_db()
					return True,p
			except Exception as e:
				print(str(e))
				return False, str(e)
		return False, None

	@staticmethod
	def delete_product(gid,id):
		status,u = User.find_by_gid(gid)
		"""Adds product to trash temporarily before deleting product after 90 days 
		returns [bool, value]"""
		if status:
			status,p = Provider.find_product(u.gid,id)
			if status:
				try:
					dp = DeletedProducts(product_id=p.id)
					if dp.add_to_nest():
						return True, p.product_code
				except Exception as e:
					print(str(e))
					return False, None
			return False, None