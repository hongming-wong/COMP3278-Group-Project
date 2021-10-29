from backend_func import *


"""Constants defining login status"""
SUCCESS = 0
LOGGED_IN = 1
NO_USER = 2 # no user is in session right now
USER_NOT_EXIST = 2
ERROR = 3

def accountOwner(accountNo, loginStatus):
    """Checks if account belongs to user"""
    details = get_account_details(accountNo)
    if details is None:
        return False
    if details[0] == str(loginStatus.currentUser):
        return True
    return False

def authentication():
    """forks another process to perform authentication,
    and wait till authentication is complete or time is up"""
    # t_end = time.time() + 2
    # while time.time() < t_end:
    #     pass
    # return "Done"
    return 1

class LoginMethods():
    def __init__(self):
        """
        currentUser determines if a user is in session right now.
        There is a better way of doing this by using flask-sessions,
        but I'm too lazy to learn it sorry
        """
        self.currentUser = None

    def LogIn(self, customerID):
        """
        This function logs a user into the system, which allows the user to use restricted endpoints.
        NOTE: For simplicity's sake, only one user can log in at any time.
        """

        if self.currentUser == customerID:
            return LOGGED_IN
        elif self.currentUser is None:
            cursor.execute(f"SELECT * FROM customer WHERE customerID = {customerID}")
            account = cursor.fetchone()
            if account is None or len(account) == 0:
                return USER_NOT_EXIST
            self.currentUser = int(customerID)
            return SUCCESS
        return ERROR


    def GetCredentials(self):
        """
        Checks if there is a user.
        If there is a user, return the customerID
        """
        if self.currentUser is not None:
            return self.currentUser
        return NO_USER

    def LogOut(self):
        if self.currentUser is None:
            return NO_USER
        self.currentUser = None
        return SUCCESS
