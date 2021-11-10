from backend_func import *
from face_capture import *
from faces_gui import *
from train import *
import datetime
from multiprocessing import Process, Pipe


"""
This file deals with functions that are implemented in app.py.
It acts as the medium between app.py and backend_func.py
"""


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
    FR = FaceRecognition()
    return FR.authenticate()

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

            cursor, _ = c()
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

class FaceRecognition:
    def __init__(self):
        self.customerID = False
        self.name = False

    def collectData(self, name):
        """
        Opens the camera and collect images.
        Then trains the model.
        """
        face_capture(name)
        train()

    def setData(self, arg1, arg2):
        self.customerID = arg1
        self.name = arg2

    def authenticate(self):
        """
        Forks another process to perform authentication,
        and wait till authentication is complete or time is up

        I tried multithreading but it doesn't work with consistency. So creating
        another process is the best way to go.
        """

        # gui = threading.Thread(target=verify, args=(self.setData, ))
        # gui.start()
        # gui.join()

        parent_conn, child_conn = Pipe()
        gui = Process(target=verify, args=(child_conn,))
        print("Starting authentication")
        gui.start()
        # waiting till authentication is over
        gui.join()
        self.customerID, self.name = parent_conn.recv()
        parent_conn.close()
        print("Done")
        if self.customerID is False or self.name is False:
            return False, False, False, False

        today = datetime.datetime.today()
        now = datetime.datetime.now()
        date = today.strftime("%Y-%m-%d")
        current_time = now.strftime("%H-%M")

        update = "UPDATE Customer SET login_date=%s WHERE customerID=%s"
        val = (date, self.customerID)
        cursor, myconn = c()
        cursor.execute(update, val)
        update = "UPDATE Customer SET login_time=%s WHERE customerID=%s"
        val = (current_time, self.customerID)
        cursor.execute(update, val)
        myconn.commit()
        return self.customerID, self.name, date, current_time

if __name__ == "__main__":
    authentication()

