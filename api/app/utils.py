from flask_login import current_user
from flask import current_app, render_template, jsonify
import re
import  secrets
import  os
import random
from pathlib import Path
from flask_mail import Message
from threading import Thread
from app import mail
from datetime import datetime
from werkzeug.utils import secure_filename as sfn
import time 


def jsonList(l:list) -> list:
	"""Helper function.

    accepts a list of Objects and calls the .json() method available on each object.

    NOTE: the object needs to have a json() function defined otherwise this will lead to an error
    """
	return list(map(lambda o: o.json(),l))

def create_image_set(image_dir, image_name):  
	start = time.time()  
	thumb = 30, 30
	small = 540, 540
	medium = 768, 786
	large = 1080, 1080
	xl = 1200, 1200 
	image = Image.open(os.path.join(image_dir, image_name))

	image_ext = image_name.split(".")[-1]
	image_name = image_name.split(".")[0]  
	### THUMBNAIL ###     
	thumbnail_image = image.copy()     
	thumbnail_image.thumbnail(thumb, Image.LANCZOS)     
	thumbnail_image.save(f'{os.path.join(image_dir, image_name)}-thumbnail. {image_ext}', optimize=True, quality=95)  
	### SMALL ###     
	small_image = image.copy()     
	small_image.thumbnail(small, Image.LANCZOS)     
	small_image.save(f'{os.path.join(image_dir, image_name)}-540.{image_ext}', optimize=True, quality=95)  
	### MEDIUM ###     
	medium_image = image.copy()     
	medium_image.thumbnail(medium, Image.LANCZOS)     
	medium_image.save(f'{os.path.join(image_dir, image_name)}-768. {image_ext}', optimize=True, quality=95)  
	### LARGE ###     
	large_image = image.copy()     
	large_image.thumbnail(large, Image.LANCZOS)     
	large_image.save(f'{os.path.join(image_dir, image_name)}-1080. {image_ext}', optimize=True, quality=95)  
	### XL ###     
	xl_image = image.copy()     
	xl_image.thumbnail(xl, Image.LANCZOS)     
	xl_image.save(f'{os.path.join(image_dir, image_name)}-1200.{image_ext}', optimize=True, quality=95)  
	end = time.time()  
	time_elapsed = end - start  
	print(f"Task complete in: {time_elapsed}")  
	return True


def generate_invoice_no(prefix, num, separator='-', width=3):
	try:
		_n = str(num)
		_mn = extract_max(_n[-1])
		_mn = _mn + 1
		_d = datetime.today().strftime('%y%m%d')
		if prefix:
			_code = prefix + _d + separator + str(_mn).zfill(width)    
		else:
			_code = _d + separator + str(_mn).zfill(width)   
		return _code
	except Exception as e:
		print(str(e))
		return None


def is_user_with_store():
	if (current_user.is_authenticated and current_user.store_id):
		return True
	return False

def extract_max(value:str):
	try:
		nums = re.findall('\d+',value)
		nums = map(int,nums)
	except Exception as e:
		print(str(e))
		return 0
	return max(nums)

def save_image(pic, *args):
	random_hex = secrets.token_hex(8)
	_ , ext = os.path.splitext(sfn(pic.filename))
	pic_fn = random_hex + ext
	pic_path = os.path.join(current_app.root_path,'static',*args)
	Path(pic_path).mkdir(parents=True,exist_ok=True)
	pic_fn_path = os.path.join(pic_path,pic_fn)
	pic.save(pic_fn_path)
	return pic_fn

def random_chars(ch):
	return ch[0:random.randint(2,len(ch))]

def generate_username(first_name, last_name, range=1000000):
	from .models import User
	fname = first_name.lower()
	lname = last_name.lower()
	while True:
		rand = random.randint(0,3)
		if rand == 0:
			username = fname + str(random.randint(0,range))
		elif rand == 1:
			username = lname + str(random.randint(0,range))
		elif rand == 2:
			username = random_chars(fname) + random_chars(lname)
		else:
			username = random_chars(fname) + random_chars(lname) + str(random.randint(0,range))
		if not User.find_by_username(username):
			break
	return username

def generate_gid(first_name, last_name, range=1000000):
	from .models import User
	fname = first_name.lower()
	lname = last_name.lower()
	while True:
		rand = random.randint(0,3)
		if rand == 0:
			username = random_chars(fname) + str(random.randint(0,range))
		elif rand == 1:
			username = random_chars(lname) + str(random.randint(0,range))
		elif rand == 2:
			username = random_chars(fname) + random_chars(lname) + str(random.randint(0,range))
		else:
			username = str(random.randint(0,range))
		if not User.find_by_gid(gid=username):
			break
	return username


def send_async_email(app,msg):
	with app.app_context():
		mail.send(msg)

def send_email(to, subject, template, **kwargs):
	 msg = Message(current_app.config['MAIL_SUBJECT_PREFIX'] + subject, sender=current_app.config['MAIL_SENDER'], recipients=[to])
	 msg.body = render_template(template + '.txt', **kwargs)
	 msg.html = render_template(template + '.html', **kwargs)
	 thr = Thread(target=send_async_email, args=[current_app,msg])
	 thr.start()
	 return thr
