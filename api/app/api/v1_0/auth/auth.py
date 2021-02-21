from datetime import datetime, timedelta
from flask import jsonify,render_template, session, redirect, url_for, request, current_app , g
from . import auth_api
from .... import db, jwt
from ....errors import  no_json_error, missing_param_error,wrong_credentials
from ....mailer import send_email
from flask.views import MethodView
from .provider import Provider
from flask_jwt_extended import jwt_required, get_jwt_identity

#from flask_httpauth import HTTPBasicAuth
#auth = HTTPBasicAuth()

#@auth.verify_password
#def verify_password(email, password):
#	if email == '':
#		g.current_user = AnonymousUser()
#		return True
#	user = User.find_by_email(email)
#	if not user:
#		return False
#	g.current_user = user
#	return user.verify_password(password)

#@api.before_request
#@auth.login_required
#def before_request():
#	if not g.current_user.is_anonymous and \
#		not g.current_user.confirmed:
#		return forbidden_error('Unconfirmed account')


@jwt.user_identity_loader
def user_identity_lookup(user):
	return user.gid

#make the user permissinos same as the store permissions
class login(MethodView):
	def post(self):
		if not request.is_json:
			return no_json_error(), 400
		gid = request.json.get('gid', None)
		password = request.json.get('password', None)
		if not gid:
			return missing_param_error('GID'), 400
		if not password:
			return missing_param_error('Passowrd'), 400
		status,user  = Provider.check_login(gid=gid, password=password)
		if not status:
			if not user:
				return wrong_credentials ('GID','Password'), 401
			return user
		return jsonify(user) , 200


auth_api.add_url_rule("/login",
view_func=login.as_view("login_api"))


#class refresh_token(MethodView):
#	@jwt_refresh_token_required
#	def post(self):
#		phone = get_jwt_identity()
#		r = jsonify({'access_token': create_access_token(identity=phone)})
#		r.status_code = 200
#		return r, 200


#auth_api.add_url_rule("/token/renew",
#view_func=refresh_token.as_view("renew_token_api"))

#class fresh_login(MethodView):
#	def post(self):
#		if not request.is_json:
#			return create_response_error('Bad request', 'Json body is missing.', 400), 400
#		phone = request.json.get('phone', None)
#		password = request.json.get('password', None)
#		if not phone:
#			return create_response_error('Bad request', 'Json object does not contain a username parameter.', 400), 400
#		if not password:
#			return create_response_error('Bad request', 'Json object does not contain a password parameter.', 400), 400
#		user  = User.check_login(phone=phone,password=password)
#		if not user:
#			return create_response_error('Wrong credentials', 'Username or Password is not correct.', 401), 401
#		if user:
#			r = jsonify({'access_token': create_access_token(identity=user,fresh=True) })
#			return r, 200


#auth_api.add_url_rule("/login/fresh",
#view_func=fresh_login.as_view("login_fresh_api"))

class get_user_access(MethodView):
	@jwt_required
	def get(self):
		gid = get_jwt_identity()
		return dbp.get_user_data(gid=gid), 200


auth_api.add_url_rule("/get-user-access",
view_func=get_user_access.as_view("get_user_access_api"))

class register(MethodView):
	def post(self):
		if not request.is_json:
			return not_json_error(), 400
		phone = request.json.get('phone', None)
		password = request.json.get('password', None)
		if not phone:
			return missing_param_error('Phone'), 400
		if not password:
			return missing_param_error('Passowrd'), 400
		user  = User(phone=phone,password=password, confirmed=True)
		if user.save_to_db():
			pass

auth_api.add_url_rule("/register",
view_func=register.as_view("register_api"))


#@auth_api.route('/confirm-account/<token>')
#def confirm(token):
#	if current_user.confirmed:
#		return redirect(url_for('main.index'))
#	if current_user.confirm(token):
#		flash('You have confirmed your account. Thanks!','success')
#	else:
#		flash('The confirmation link is invalid or has expired.','warning')
#	return redirect(url_for('main.index'))

#@auth_api.route('/unconfirmed')
#def unconfirmed():
#	if current_user.is_anonymous or current_user.confirmed:
#		return redirect(url_for('main.index'))
#	title = 'Account unconfirmed'
#	return render_template('auth/unconfirmed.html', title=title , current_time=datetime.utcnow())

#@auth_api.route('/confirm')
#@login_required
#def resend_confirmation():
#	token = current_user.generate_confirmation_token()
#	#send_email(to=current_user.email,template='auth/email/confirm', subject='Confirm Your Account', user=current_user, token=token)
#	flash('A new confirmation email has been sent to you by email.','success')
#	return redirect(url_for('auth.confirm', ))

#@auth_api.route('/logout')
#@login_required
#def logout():
#	logout_user()
#	flash('You have been logged out.','info')
#	return redirect(url_for('auth.login'))

#@auth_api.before_app_request
#def before_request():
#	if current_user.is_authenticated:
#		current_user.ping()
#		if not current_user.confirmed \
#			and not 'auth' in request.path:
#			return redirect(url_for('auth.unconfirmed'))
