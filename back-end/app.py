from flask import Flask, request, Response
from backend_func import *
from server_func import *
import json
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
loginStatus = LoginMethods()


@app.route('/')
def Index():
    """Test endpoint, not used in production"""
    return "Server is active, please eat my pants"


@app.route('/login', methods=['POST'])
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


@app.route('/logout', methods=['POST'])
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


@app.route('/seeTransactions')
def transactions():
    """
    Returns all transactions associated with an account.
    accountNo is compulsory parameter.
    year, month, day, amount, message are all optional
    """
    accountNo = request.args.get('accountNo')
    # optional parameters
    year = request.args.get('year')
    month = request.args.get('month')
    day = request.args.get('day')
    amount = request.args.get('amount')
    message = request.args.get('message')
    if accountNo is None:
        return "accountNo paramater is needed"
    if not accountOwner(accountNo, loginStatus):
        return Response("Permission denied", status=403)
    jsonString = json.dumps(get_all_transactions(accountNo, year, month, day, amount, message))
    return jsonString


@app.route('/Transfer', methods=["POST"])
def MakeTransfer():
    """
    Handles transfer from one account to another.
    Only valid if the transferer and receiver belong to the current user.
    Parameters must be specified with form.
    """
    amount = request.form.get('amount')
    fromAccount = request.form.get('from')
    toAccount = request.form.get('to')

    message = request.form.get('message')

    if toAccount == fromAccount:
        return "Transfer unsuccessful: to and from account are the same"

    if amount is None or fromAccount is None or toAccount is None:
        return "Transfer unsuccessful: One or more details not specified"

    amount = int(amount)
    fromAccount = int(fromAccount)
    toAccount = int(toAccount)

    isOwnerOne = accountOwner(fromAccount, loginStatus)
    isOwnerTwo = accountOwner(toAccount, loginStatus)
    if not isOwnerOne or not isOwnerTwo:
        return "Transfer unsuccessful: account(s) don't belong to user "

    date = datetime.datetime.now()
    transfer(from_account_num=fromAccount, to_account_num=toAccount,
             amount=amount, message=message, year=date.year, month=date.month, day = date.day, time=date.strftime("%H-%M"))
    return "Transfer successful"

@app.route('/Transaction', methods=["POST"])
def MakeTransaction():
    """
    Handles transaction from one account to another.
    Only valid if fromAccount belongs to owner
    and toAccount belongs to someone else.
    Parameters must be specified with form.
    """
    amount = request.form.get('amount')
    fromAccount = request.form.get('from')
    toAccount = request.form.get('to')
    message = request.form.get('message')
    if amount is None or fromAccount is None or toAccount is None:
        return "Transfer unsuccessful: One or more details not specified"

    amount = int(amount)
    fromAccount = int(fromAccount)
    toAccount = int(toAccount)
    isOwnerOne = accountOwner(fromAccount, loginStatus)
    isOwnerTwo = accountOwner(toAccount, loginStatus)

    if not isOwnerOne:
        return "Transfer unsuccessful: account don't belong to owner"
    if isOwnerTwo:
        return "Transfer unsuccessful: either account doesn't exist or account belongs to current user. For internal transfer, please use transfer endpoint."
    if not is_current_account(fromAccount):
        return "Transferring account must be a current account!"

    date = datetime.datetime.now()
    transaction(current_account_num=toAccount, saving_account_num=fromAccount,
             amount=amount, message=message, year=date.year, month=date.month, day=date.strftime("%H-%M"))
    return "Transaction successful"

if __name__ == "__main__":
    app.run(debug=True)
