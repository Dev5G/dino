import  os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:

	DEBUG = False
	TESTING = False
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'iuhto743yto34iuho287gh78'
	JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'cICATtspnVz9Yb2@CGwT%!7m'
	CLOUDINARY_SECRET = os.environ.get('CLOUDINARY_SECRET') or '64684gfjhxrxKHC546cICATtspnVz9Yb2@CGwT%!7m'
	#CORS
	#CORS_HEADERS = 'Content-Type'
	#--------SQLALCHEMY--------#
	#SQLALCHEMY_DATABASE_URI = 'sqlite:///Deogon-db.sqlite3'
	#SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL','mysql+pymysql://root:''@localhost/deogondb')
	SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL','sqlite:///deogon.dev.sqlite3')
	SQLALCHEMY_COMMIT_ON_TEARDOWN = True
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SQLALCHEMY_RECORD_QUERIES = True
	#------------Image mehods ---------------#
	ALLOWED_IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif']
	MAX_IMAGE_FILESIZE = 0.5 * 1024 * 1024
	IMAGE_UPLOADS = './static/uploads/images'
	#===================MAIL SERVER SETUP================#
	MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.googlemail.com')
	MAIL_PORT = int(os.environ.get('MAIL_PORT', '587'))
	MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in \
		['true', 'on', '1']
	MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'sgtechnolgies8@gmail.com')
	MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '56486421')
	MAIL_SUBJECT_PREFIX = '[Dino]'
	MAIL_SENDER = 'Dino Admin <dino@sgt.com>'
	#--------------------ADMIN CREDENTIALS-----------------
	ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'labreizk3@gmail.com')
	ADMIN_PHONE = os.environ.get('ADMIN_PHONE', '923155077782')
	#-----------------SSL SETUP---------------------
	SSL_REDIRECT = False
	SSL_DISABLE = False
	#-----------------POSTS SETUP--------------
	POSTS_PER_PAGE = 20
	FOLLOWERS_PER_PAGE = 50
	COMMENTS_PER_PAGE = 30
	SLOW_DB_QUERY_TIME=0.5
	#-----------------SESSION-------------------
	SESSION_COOKIE_SECURE = True

	@staticmethod
	def init_app(apps):
		pass


class ProductionConfig(Config):
	pass


class DevelopmentConfig(Config):
	DEBUG = True
	TESTING = False

	#SQLALCHEMY_DATABASE_URI = 'sqlite:///Deogon-database-dev.sqlite3'

	#SQLALCHEMY_DATABASE_URI = 'mysql://labreiz:564864@localhost/deogon-db'
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	IMAGE_UPLOADS = './static/uploads/images'

	SESSION_COOKIE_SECURE = False

class TestingConfig(Config):
	TESTING = True

	SQLALCHEMY_DATABASE_URI = 'sqlite:///Deogon-database-test.sqlite3'
	SQLALCHEMY_TRACK_MODIFICATIONS = False

	SESSION_COOKIE_SECURE = False


class HerokuConfig(ProductionConfig):
	SSL_DISABLE = bool(os.environ.get('SSL_DISABLE'))

	@classmethod
	def init_app(cls, app):
		ProductionConfig.init_app(app)

		# handle proxy server headers
		# from werkzeug.contrib.fixers import ProxyFix
		# app.wsgi_app = ProxyFix(app.wsgi_app)

		# log to stderr
		import logging
		from logging import StreamHandler
		file_handler = StreamHandler()
		file_handler.setLevel(logging.WARNING)
		app.logger.addHandler(file_handler)


class UnixConfig(ProductionConfig):
	@classmethod
	def init_app(cls, app):
		ProductionConfig.init_app(app)

		# log to syslog
		import logging
		from logging.handlers import SysLogHandler
		syslog_handler = SysLogHandler()
		syslog_handler.setLevel(logging.WARNING)
		app.logger.addHandler(syslog_handler)


config = {
	'development': DevelopmentConfig,
	'testing': TestingConfig,
	'production': ProductionConfig,
	'heroku': HerokuConfig,
	'unix': UnixConfig,

	'default': DevelopmentConfig
}
