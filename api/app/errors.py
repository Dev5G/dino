from flask import jsonify


def response_error(title, msg):
    r= jsonify({'error': title, 'msg': msg})
    return r

def missing_param_error(param):
    r =jsonify({'error':'Missing Parameter','msg':f'Missing required param* "{param}"'})
    return r

def no_json_error():
    r =jsonify({'error':'No json found!','msg':'The body of the post request is missing json Object'})
    return r

def wrong_credentials(v1,v2):
    r=jsonify({'error':'Wrong credentials', 'msg':f'{v1} or {v2} is not correct.'})
    return r