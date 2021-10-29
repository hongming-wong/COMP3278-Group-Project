from flask import Flask, request, Response
from backend_func import *
from server_func import *
import json
# import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
loginStatus = LoginMethods()

@app.route('/')
def Index():
    """Test endpoint, not used in production"""
    return "Server is active, please eat my pants"

@app.route('/login', methods = ['POST'])
def LoginEndpoint():
    """
    When received a post request, it triggers the authentication function.
    Post request doesn't need any data or form data.
    If successful, returns (Customer Name, Last Login Date, Last Login Time).
    If another user is logged in, or user doesn't exist, return response status = 401.
    """
    if request.method == 'POST':
        customerID = authentication()
        status = loginStatus.LogIn(customerID)
        if status == SUCCESS or status == LOGGED_IN:
            customer = get_customer_details(customerID)
            jsonString = json.dumps(customer[:3])
            return jsonString

        return Response("User doesn't exist", status=401)

@app.route('/logout', methods = ['POST'])
def LogOutEndpoint():
    """
    Attempts to logout.
    If successful, returns string.
    If no user is logged in, returns string.
    else error response.
    """
    if request.method == 'POST':
        status = loginStatus.LogOut()
        if status == SUCCESS:
            return "Successfully Logged Out"
        elif status == NO_USER:
            return "No User is logged in"
    return Response("Failed", status=401)


@app.route('/accounts')
def accounts():
    """
    Gets all the accounts that belongs to a user.
    If accountType is not specified, returns all accounts
    If filter, accountType has to be saving or current.
    Else it will return an error response.
    """
    accountType = request.args.get('accountType')
    if accountType is None:
        allAccount = get_all_accounts(loginStatus.currentUser)
    elif accountType == "saving" or accountType == "current":
        allAccount = get_all_accounts(loginStatus.currentUser, accountType)
    else:
        return Response("Query parameters not valid!", status=401)
    jsonString = json.dumps(allAccount)
    return jsonString

@app.route('/accountDetails')
def accountDetails():
    """
    Given accountNo parameter,
    if accountNo belongs to user,
    returns accountDetails
    """
    accountNo = request.args.get('accountNo')
    if accountNo is None:
        return "accountNo parameter is needed"
    if not accountOwner(accountNo, loginStatus):
        return Response("Permission denied", status=403)
    jsonString = json.dumps(get_account_details(accountNo))
    return jsonString



if __name__ == "__main__":
    app.run(debug=True)