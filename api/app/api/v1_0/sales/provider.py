from ..user.provider import Provider as User
from .models import Sales, SalesDetails
from ....utils import jsonList
from sqlalchemy import desc, asc

class Provider():
	@staticmethod
	def init() -> Sales:
		return Sales()

	@staticmethod
	def commit():
		return Sales.commit_session()

	@staticmethod
	def find_product_by_code(gid, code):
		"""Find product by id"""
		status,user = User.find_by_gid(gid)
		if status:
			status, p = Product.find_all_by_hens(user.hens,True,True)
			if status:
				one_p = p.filter_by(product_code=code.upper()).first()
				if one_p:
					return True, one_p
			return False, None
		return False, 'Operation not allowed!'


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
	def find_products(gid, query) -> list:
		"""Return [bool, list:dict | str:error]"""
		status,u = User.find_by_gid(gid)
		p = None
		totalCount = 0
		if status:
			status,p = Product.find_all_by_hens(u.hens,True,True)
			if status:
				if query:
					filter = query.get('filter',None)
					supplier = filter.get('supplier', None)
					if supplier:
						p = p.filter_by(supplier_id=supplier)
					product_code = filter.get('product_code', None)
					if product_code:
						p = p.filter(Product.product_code.like(f'{product_code}%'))
					weightFilter = query.get('weightFilter',None)
					if weightFilter:
						min = weightFilter.get('min',None)
						if min:
							p=p.filter(Product.weight>=min)
						max = weightFilter.get('max',None)
						if max:
							p=p.filter(Product.weight<=max)
					product_status = filter.get('status', None)
					if product_status:
					# 	from ..sales.models import SalesDetails
						if product_status == 'Deleted':
							p = p.outerjoin(DeletedProducts).filter(DeletedProducts.product_id!=None)
						else:
							p = p.outerjoin(DeletedProducts).filter(DeletedProducts.product_id==None)
				
					# 	if product_status == 'Available':
					# 		print('available products')
					# 		print(dir(p))
					# 		p = p.join(SalesDetails, Product.id ==SalesDetails.product_id).filter(	SalesDetails.product_id == None)
					sortOrder	= query.get('sortOrder',None)
					if sortOrder:
						sortField = query.get('sortField',None)
						if not sortField =='id' or not sortField =='product_code':
							sortField = 'product_code'
						p=p.order_by(desc(sortField) if sortOrder == 'desc' else asc(sortField))
					totalCount = p.count()
					pageNumber  = query.get('pageNumber',None)
					pageSize = query.get('pageSize',None)
					p=p.paginate(pageNumber, pageSize, False).items
					p:list = jsonList(p)
		return status,{'entities':p, 'totalCount': totalCount}

	@staticmethod
	def add_sale(gid=gid,customer_id=customer_id,
							   salesman_id=salesman_id,
							   cash_account_id=cash_account_id,
							   care_of_id=care_of_id,
							   hen_id=hen_id,
							   description=description,
							   total_amount=total_amount,
							   net_amount=net_amount,
							   discount_amount=discount_amount,
							   balance_amount=balance_amount,
							   products=products) -> Sales:
		status,u = User.find_by_gid(gid)
		if status:
			try:
				#TODO:// Add check to see if use realy exists (customer, salesman ,etc.)
				s = Sales(customer_id=customer_id,
							   salesman_id=salesman_id,
							   cash_account_id=cash_account_id,
							   care_of_id=care_of_id,
							   hen_id=hen_id,
							   description=description,
							   total_amount=total_amount,
							   net_amount=net_amount,
							   discount_amount=discount_amount,
							   balance_amount=balance_amount,)
				s.user_id=u.id
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