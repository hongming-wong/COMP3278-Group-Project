from flask import Flask, request, Response
from server_func import *
import json
import datetime
from flask_cors import CORS

"""
This file contains the endpoints of the api.
Please inform me if more endpoints are needed.
- Hong Ming
"""

app = Flask(__name__)

# allows for cross origin resource sharing
CORS(app)

# deals with logging in and logging out
loginStatus = LoginMethods()


@app.route('/')
def Index():
    """Test endpoint, not used in production"""
    bypass = request.args.get("bypass")
    if bypass is not None:

        loginStatus.LogIn(bypass)
        return "bypass ok"

    return "Server is active, please eat my pants"


@app.route('/Login', methods=['POST'])
def LoginEndpoint():
    """
    When received a post request, it triggers the authentication function.
    If successful, returns (Customer Name, Last Login Date, Last Login Time).
    If another user is logged in, or user doesn't exist, return response status = 401.
    Parameters: None
    """
    if request.method == 'POST':
        if loginStatus.GetCredentials() is LOGGED_IN:
            return "User is already logged in"

        customerID, customerName, date, time = authentication()
        if customerID is not False:
            status = loginStatus.LogIn(customerID)
            if status == SUCCESS or status == LOGGED_IN:
                jsonString = json.dumps([customerID, customerName, date, time])
                return jsonString
        return Response("User doesn't exist", status=401)


@app.route('/Logout', methods=['POST'])
def LogOutEndpoint():
    """
    Logs out of the account.
    Parameters: None
    """
    if request.method == 'POST':
        status = loginStatus.LogOut()
        if status == SUCCESS:
            return "Successfully Logged Out"
        elif status == NO_USER:
            return "No User is logged in"
    return Response("Failed", status=401)


@app.route('/Accounts')
def accounts():
    """
    Return An array of accounts that belong to a user. User is required to login first.
    Optional Parameters: accountType
    """
    if loginStatus.GetCredentials() == NO_USER:
        return Response("Permission Denied", status= 403)
    accountType = request.args.get('accountType')
    if accountType is None:
        allAccount = get_all_accounts(loginStatus.currentUser)
    elif accountType == "saving" or accountType == "current":
        allAccount = get_all_accounts(loginStatus.currentUser, accountType)
    else:
        return Response("Query parameters not valid!", status=401)
    jsonString = json.dumps(allAccount)
    return jsonString


@app.route('/AccountDetails')
def accountDetails():
    """
    Returns an array of details about an account. If accountNo doesn't belong to user,
    return permission denied error status.
    Required parameters: accountNo
    """
    if loginStatus.GetCredentials() == NO_USER:
        return "Login first"
    accountNo = request.args.get('accountNo')
    if accountNo is None:
        return "accountNo parameter is needed"
    if not accountOwner(accountNo, loginStatus):
        return Response("Permission denied", status=403)
    jsonString = json.dumps(get_account_details(accountNo))
    return jsonString


@app.route('/SeeTransactions')
def transactions():
    """
    Returns all transactions associated with an account.
    Required parameters: accountNo
    Optional parameters: year, month, day, amount, message
    """

    if loginStatus.GetCredentials() == NO_USER:
        return "Login first"

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
    IMPORTANT:
    1. transferring from one account to another must involve one current account, and one saving account.
    2. Both accounts have to belong to the same owner.
    3. Parameters must be specified with form (See front-end/src/app.js example

    Required parameters: amount, from, to, message

    Note: the accounts have to be valid; account validation will be added later on.
    """
    if loginStatus.GetCredentials() == NO_USER:
        return "Login first"
    amount = request.form.get('amount')
    fromAccount = request.form.get('from')
    toAccount = request.form.get('to')
    message = request.form.get('message')

    if amount is None or fromAccount is None or toAccount is None:
        return "Transfer unsuccessful: One or more details not specified"

    if toAccount == fromAccount:
        return "Transfer unsuccessful: to and from account are the same"

    isOwnerOne = accountOwner(fromAccount, loginStatus)
    isOwnerTwo = accountOwner(toAccount, loginStatus)

    if not isOwnerOne or not isOwnerTwo:
        return "Transfer unsuccessful: account(s) don't belong to user "

    if is_current_account(isOwnerOne) and is_current_account(toAccount):
        return "Transfer unsuccessful: Both accounts must be of different types."

    amount = int(amount)
    if amount <= 0:
        return "Transfer unsuccessful: amount has to be greater than 0"
    date = datetime.datetime.now()
    result = transfer(from_account_num=fromAccount,
             to_account_num=toAccount,
             amount=amount,
             message=message,
             year=str(date.year),
             month=str(date.month),
             day = str(date.day),
             time=date.strftime("%H-%M"))
    if not result:
        return "Transfer unsuccessful: insufficient amount"
    return "Transfer successful"

@app.route('/Transaction', methods=["POST"])
def MakeTransaction():
    """
    Handles transaction from one account to another
    1. fromAccount has to be a current account, toAccount must be a savings account
    2. Only valid if fromAccount belongs to owner and toAccount belongs to someone else.
    2. Parameters must be specified with form (See front-end/src/App.js example)

    Required parameters: amount, from, to, message

    Note: the accounts have to be valid; account validation will be added later on.
    """
    if loginStatus.GetCredentials() == NO_USER:
        return "Login first"
    amount = request.form.get('amount')
    fromAccount = request.form.get('from')
    toAccount = request.form.get('to')
    message = request.form.get('message')
    if amount is None or fromAccount is None or toAccount is None:
        return "Transfer unsuccessful: One or more details not specified"

    isOwnerOne = accountOwner(fromAccount, loginStatus)
    isOwnerTwo = accountOwner(toAccount, loginStatus)
    amount = int(amount)

    if amount <= 0:
        return "Transaction unsuccessful: Transfer amount has to be greater than 0"

    if not isOwnerOne:
        return "Transaction unsuccessful: account don't belong to owner"
    if isOwnerTwo:
        return "Transaction unsuccessful: either account doesn't exist or account belongs to current user. " \
               "For internal transfer, please use transfer endpoint."

    if not is_current_account(fromAccount):
        return "Transaction unsuccessful: fromAccount must be a current account!"

    if is_current_account(toAccount):
        return "Transaction unsuccessful: Receiving account must be a saving account!"

    date = datetime.datetime.now()
    result = transaction(
        str(date.year),
        str(date.month),
        str(date.day),
        date.strftime("%H-%M"),
        amount,
        message,
        fromAccount,
        toAccount
    )
    if not result:
        return "Transaction unsuccessful: Insufficient amount in account"
    return "Transaction successful"

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
