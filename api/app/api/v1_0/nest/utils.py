import cloudinary
from flask import current_app
from datetime import datetime

def sign_cloudinary(**kwargs) -> str:

	"""accepts a dictionary and returns a signature to upload files directly from the browser."""
	x = kwargs.copy()
	timestamp = datetime.timestamp(datetime.utcnow())
	x['timestamp'] = timestamp
	secret = current_app.config['CLOUDINARY_SECRET']
	return	cloudinary.utils.api_sign_request(x, secret), x