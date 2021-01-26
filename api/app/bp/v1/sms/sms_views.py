from . import sms
from app.models import SMS
from flask import render_template, redirect, url_for, request, flash, make_response, jsonify
from app.decorators import t1_required

@sms.route('/send/quick', methods=['GET'])
@t1_required
def send_quick_sms():
	''' Please provide correct username and password here of your account ''' 
	title = 'Send Quick SMS'
	userName = "923404338021" 
	password = "56486421aa??"     
	#''' Set message text which you want to send ''' 
	messageText = "Test Message"  
	#''' provide msisdn list to whom you want to send messages for multiple set value as 923458590063,923458590064,923458590065 ''' 
	to = '923458590063'
	#''' Set mask value if you want to send from specific mask ''' 
	mask = None  
	sessionId = getSessionId(userName,password)  
	if sessionId != None:     
		quickMessageIds = sendQuickMessage(sessionId,messageText,to,mask) 
	return 'send sms'#render_template()

@sms.before_request
def before_sms_request():
	print("before_request is running!")