from flask import render_template
from . import main

@main.app_errorhandler(404)
def page_not_found(e):
    heading = '404'
    paragraph = '404, Page not found!'
    return render_template('error.html', heading=heading, paragraph=paragraph), 404

@main.app_errorhandler(500)
def internal_server_error(e):
    heading = '500'
    paragraph = 'Internal server error accured'
    return render_template('error.html', heading=heading, paragraph=paragraph), 500
