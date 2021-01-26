from flask_wtf import FlaskForm
from wtforms import StringField , PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, EqualTo, ValidationError, Email, Regexp
from app.models import User

class RegisterForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Length(5, 64), Email()])
    username = StringField('Username', validators=[DataRequired(),
                        Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,
                        'Usernames must have only letters, numbers, dots or underscores'),
                        Length(min=4,max=20)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=4,max=80)])
    confirm_password = PasswordField('Confirm password', validators=[DataRequired(), EqualTo('password','Password must match')])
    submit = SubmitField('Sign Up')

    def validate_email(self, email):
        if User.find_by_email(email.data):
            raise ValidationError('Email already registered.')

    def validate_username(self, username):
        if User.find_by_username(username.data):
            raise ValidationError(f'Username {username.data} has been taken, please choose a different one.')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Length(min=3, max=64)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember me')
    submit = SubmitField('Sign In')
