import mysql.connector
import uuid

host = 'localhost'
user = 'root'
passwd = '12345'

myconn = mysql.connector.connect(host=host, user=user, passwd=passwd, database="facerecognition")
cursor = myconn.cursor()

def main():
    """For testing purposes"""
    if host == '' or user == '':
        return None
    print("Running")
    return get_all_accounts(1)

########################################################################################################################

# This returns a list of tuples of a Customer's accounts
# in the format tuple(account_number, saving/current)
# If filter is applied, a single tuple of account nums will be returned
# (since it is not necessary to indicate the type of each account)
def get_all_accounts(customer_id, type_filter=None):
    if type_filter is None:
        select = 'SELECT account_number, (CASE WHEN account_number IN (SELECT * FROM CurrentAccount) THEN "Current" ' \
                 f'ELSE "Saving" END) FROM Account WHERE customerID = "{customer_id}" ORDER BY account_number; '
    else:
        select = f'SELECT account_number FROM Account WHERE customerID = {customer_id} AND account_number ' \
                 f'IN (SELECT * FROM {"SavingAccount" if type_filter == "saving" else "CurrentAccount"});'
    cursor.execute(select)
    return cursor.fetchall() if type_filter is None else tuple(map(lambda x: x[0], cursor.fetchall()))


# Example: Obtain all accounts, including savings and current account, of a customer
# with customer id = 1
# print(get_all_accounts('1', 'saving'))

########################################################################################################################

# This returns a list of all transaction IDs and dates
# for an account.  Filters can be applied.
def get_all_transactions(account_number, year=None, month=None, day=None, amount=None, message=None):
    cursor.execute('SELECT * FROM CurrentAccount;')
    select = 'SELECT transactionID, date_year, date_month, date_day, amount FROM Transaction WHERE ' + (
        'CurrentAccount_number' if account_number in map(lambda x: x[0], cursor.fetchall())
        else 'SavingAccount_number') + f' = "{account_number}" ' + (
                 f'AND date_year = "{year}" ' if year else '') + (
                 f'AND date_month = "{month}" ' if month else '') + (f'AND date_day = "{day}" ' if day else '') + (
                 f'AND amount = {amount} ' if amount else '') + (
                 f'AND message LIKE "%{message}%"' if message else '') + ';'
    cursor.execute(select)
    return cursor.fetchall()


# Example: Obtain all transaction records for current account with
# account num = 6 and amount = 20 (filter)
# print(get_all_transactions('6', amount=20))

########################################################################################################################

# Returns the balance of an account (works for both current and saving accounts)
# This directly returns a number instead of a list of tuples
def get_balance(account_number):
    select = f'SELECT balance FROM Account WHERE account_number = {account_number};'
    cursor.execute(select)
    tup = next(iter(cursor.fetchall()), None)
    return tup[0] if tup else tup


# Example: Obtain the balance of account with account num = 5
# print(get_balance('5'))

########################################################################################################################

# Returns the details of a customer with a specified customer id
# Format: tuple(name, login_date, login_time, Total Balance, Number of accounts)
def get_customer_details(customer_id):
    select = 'SELECT Customer.name, Customer.login_date, Customer.login_time, ' \
             'SUM(Account.balance), COUNT(Account.account_number) FROM Customer, Account WHERE ' \
             f'Account.customerID = {customer_id} AND Account.customerID = Customer.customerID;'
    cursor.execute(select)
    tup = next(iter(cursor.fetchall()), None)
    return tuple([float(tup[i]) if i == 4 else tup[i] for i in range(len(tup))])


# Example: Obtain the customer detail of customer with customer id = 1
# print(get_customer_details('1'))

########################################################################################################################

# Returns the details of a transaction with a specified transaction id
# Format: tuple(transactionID, date (YYYY-MM-DD), time (HH:MM), amount, message, saving account id, current account id)
def get_transaction_details(transaction_id):
    select = f'SELECT * FROM Transaction WHERE transactionID = {transaction_id};'
    cursor.execute(select)
    tup = next(iter(cursor.fetchall()), None)
    return (tup[0], '{}-{}-{}'.format(*tup[1:4]), '{}:{}'.format(*tup[4].split('-')), *tup[5:len(tup)]) if tup else tup


# Example: Obtain the transaction details of transaction with transaction id = 1
# print(get_transaction_details('1'))

########################################################################################################################

# Returns the details of an account with a specified account number
# Format: tuple(account number, customer id, currency, balance, account type (saving/current))
def get_account_details(account_number):
    select = 'SELECT customerID, currency, balance, (CASE WHEN account_number IN (SELECT * FROM CurrentAccount) ' \
             f'THEN "Current" ELSE "Saving" END) FROM Account WHERE account_number = {account_number};'
    cursor.execute(select)
    return next(iter(cursor.fetchall()), None)


# Example: Obtain the account detail of the account with account number = 6
# print(get_account_details('6'))

########################################################################################################################

# Returns a list of all transfers of a saving account (to current accounts).  Filters can be applied.
# Format: list of tuple(date (YYYY-MM-DD), time (HH:MM), amount, message, current account number)
def get_all_transfers(saving_account_number, year=None, month=None, day=None, amount=None, message=None):
    select = 'SELECT date_year, date_month, date_day, date_time, amount, message, CurrentAccount_number ' \
             f'FROM Transfer WHERE SavingAccount_number = "{saving_account_number}" ' + (
                 f'AND date_year = "{year}" ' if year else '') + (
                 f'AND date_month = "{month}" ' if month else '') + (f'AND date_day = "{day}" ' if day else '') + (
                 f'AND amount = {amount} ' if amount else '') + (
                 f'AND message LIKE "%{message}%"' if message else '') + ';'
    cursor.execute(select)
    return list(map(lambda tup: ('{}-{}-{}'.format(*tup[0:3]), '{}:{}'.format(*tup[3].split('-')), *tup[4:len(tup)]),
                    cursor.fetchall()))


# Example: Obtain all transfer of a saving account
# print(get_all_transfers('2'))

########################################################################################################################

def get_all_records(saving_account_number, year=None, month=None, day=None, amount=None, message=None):
    cursor.execute(
        f'SELECT account_number FROM Account WHERE account_number = {saving_account_number} AND account_number IN '
        '(SELECT * FROM SavingAccount);')
    if len(cursor.fetchall()) == 0:  # not a saving account
        return None
    pass  # TODO


########################################################################################################################

# check if an account is a current account or not
def is_current_account(account_number):
    cursor.execute('SELECT account_number FROM SavingAccount;')
    return next(iter([acc[0] for acc in cursor.fetchall() if account_number == acc[0]]), None) is None


# Example:
# print(is_current_account("6"))

########################################################################################################################

# This function transfers money from saving account to current account and vice versa between the same customer
# from_account_num is the account_number in which the money is transferred from
# to_account_num is the account_number in which the money is transferred to
# Assumption made: customer_id of 2 accounts must be the same
def transfer(year=None, month=None, day=None, time=None, amount=None, message=None, from_account_num=None,
             to_account_num=None):
    if get_balance(from_account_num) >= amount:
        if is_current_account(from_account_num):
            transfer_cash = 'INSERT INTO Transfer VALUES ( ' \
                            f'"{year}", "{month}", "{day}", "{time}", "{amount}", "{message}", "{to_account_num}", ' \
                            f'"{from_account_num}" );'
        else:
            transfer_cash = 'INSERT INTO Transfer VALUES ( ' \
                            f'"{year}", "{month}", "{day}", "{time}", "{amount}", "{message}", "{from_account_num}", ' \
                            f'"{to_account_num}" );'
        update_from_account = 'UPDATE Account SET balance = balance -' \
                              f'"{amount}" WHERE account_number = "{from_account_num}";'
        update_to_account = 'UPDATE Account SET balance = balance +' \
                            f'"{amount}" WHERE account_number = "{to_account_num}";'
        cursor.execute(transfer_cash)
        cursor.execute(update_from_account)
        cursor.execute(update_to_account)
        myconn.commit();
        return True;
    return False;


# example to test transfer function
# transfer('2021', '10', '29', '11-00', 200, 'Hello', '1', '6')

# to test if transfer made is updated in table
# def testTransfer():
#     print("test transfer")
#     cursor.execute('SELECT * FROM TRANSFER;')
#     print(cursor.fetchall())

# testTransfer()

########################################################################################################################

# This function helps record the transaction from current account to saving account between customers Assumption
# made:  1. customer_id of 2 accounts must be different
#        2. money must be transferred from current account of 1
#           customer to saving account of another customer
def transaction(year=None, month=None, day=None, time=None, amount=None, message=None, saving_account_num=None,
                current_account_num=None):
    if get_balance(current_account_num) >= amount:
        # choose the max + 1 as the key from the database doesn't work
        # because our key is varchar, this means mysql will compare first char
        # which means "10" will be ordered before "9".
        # therefore a randomly generated key will work better here.
        # - Hong Ming
        key = str(uuid.uuid4())[:10]
        insert = 'INSERT INTO Transaction VALUES (' \
                 f' "{key}", "{year}", "{month}", "{day}", "{time}", "{amount}", "{message}", ' \
                 f'"{saving_account_num}", "{current_account_num}" ); '
        update_saving_account = 'UPDATE Account SET balance = balance +' \
                                f'"{amount}" WHERE account_number = "{saving_account_num}";'
        update_current_account = 'UPDATE Account SET balance = balance -' \
                                 f'"{amount}" WHERE account_number = "{current_account_num}";'
        cursor.execute(update_saving_account)
        cursor.execute(update_current_account)
        cursor.execute(insert)
        myconn.commit()
        # If transaction is success
        return True
    # If transaction failed
    return False

# example to test transaction function
# transaction('2021', '11', '26', '11-05', 10, 'Hellooo', '6', '2')
# print(get_all_transactions('6'))

# to test if transaction made is updated in table
# def testTransaction():
#     print("test transaction")
#     cursor.execute('SELECT * FROM TRANSACTION;')
#     print(cursor.fetchall())

# testTransaction()
########################################################################################################################

if __name__ == "__main__":
    transaction("2022", "11", "26", "11-05", 49, "cunt", "6", "2")