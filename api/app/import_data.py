from flask import json
from app.api.v1_0.products.provider import Provider as Product
from app.api.v1_0.categories.provider import Provider as Category
from datetime import datetime

def im_data(u, path):
		with open(path) as file:
			if file:
				data = json.load(file)
				for x in data: 
					status,p = Product.find_product_by_code(u.gid,x['productCode'])
					if not status:
						p = Product.init()
					p.carat_id				= x['carrat'] 
					p.product_code			= x['productCode'] 
					status, cat = Category.find_product_category_by_code(u.gid,x['productCode'])
					p.category_id		= cat.id if cat else 1
					p.description		= x['narration']
					date = None
					try:
						date = datetime.strptime(x['dateAdded'],'%d-%m-%Y %H:%M:%S %p')
					except:
						date = None
					if date:
						p.created_date		= date
					p.metal_id			= 1
					p.qty					= x['qty']
					p.ratti				= x['ratti']
					p.ratti_method_id	= 1
					p.supplier_id		= 7
					p.waste				= x['waste']
					p.weight				= x['weight']
					p.pure_weight		= x['pureWeight']
					p.weight_gm			= x['wasteInGm']
					p.hen_id				= 2
					p.user_id			= u.id
					print(p.product_code)
					p.add_to_session()
				Product.commit()