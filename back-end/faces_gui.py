import mysql.connector
import cv2
import pyttsx3
import pickle
import PySimpleGUI as sg
import time

"""
This is the gui program for face recognition.
verify() should be used with a subprocess and the childConn is one end of the pipe.
If unable to recognize face for a period longer than TIMEOUT, the program will terminate.
"""

TIMEOUT = 5

def verify(childConn):
    # 1 Create database connection
    myconn = mysql.connector.connect(host="localhost", user="root", passwd="CebWXrQC", database="facerecognition") # Change back a sohai
    cursor = myconn.cursor()


    #2 Load recognize and read label from model
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read("train.yml")

    labels = {"person_name": 1}
    with open("labels.pickle", "rb") as f:
        labels = pickle.load(f)
        labels = {v: k for k, v in labels.items()}

    # create text to speech
    engine = pyttsx3.init()
    rate = engine.getProperty("rate")
    engine.setProperty("rate", 175)

    # Define camera and detect face
    face_cascade = cv2.CascadeClassifier('haarcascade/haarcascade_frontalface_default.xml')
    cap = cv2.VideoCapture(0)

    CONFIDENCE = 60

    # 3 Define pysimplegui setting
    layout =  [[sg.OK(), sg.Cancel()]]
    win = sg.Window('Face Recognition System',
            default_element_size=(21,1),
            text_justification='center',
            auto_size_text=False).Layout(layout)
    event, values = win.Read()
    if event is None or event =='Cancel':
        exit()
    args = values
    gui_confidence = CONFIDENCE
    win_started = False

    # 4 Open the camera and start face recognition
    t_end = time.time() + TIMEOUT
    success = False
    while True:
        if time.time() > t_end:
            break
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.5, minNeighbors=3)


        end = False
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y + h, x:x + w]
            roi_color = frame[y:y + h, x:x + w]
            # predict the id and confidence for faces
            id_, conf = recognizer.predict(roi_gray)

            # 4.1 If the face is recognized
            if conf >= gui_confidence:
                font = cv2.QT_FONT_NORMAL
                id = 0
                id += 1
                customerID = labels[id_]
                color = (255, 0, 0)
                stroke = 2
                cv2.putText(frame, customerID, (x, y), font, 1, color, stroke, cv2.LINE_AA)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), (2))

                # Find the customer information in the database.
                select = "SELECT name FROM Customer WHERE customerID='%s'" % (customerID)
                name = cursor.execute(select)
                result = cursor.fetchall()
                data = "error"

                for x in result:
                    data = x

                # If the customer's information is not found in the database
                if data == "error":
                    # the customer's data is not in the database
                    print("Customer with customerID", customerID, "is NOT FOUND in the database.")
                    end = True
                # If the customer's information is found in the database
                else:
                    """
                    Implement useful functions here.
                    """
                    print("Face Recognition Success")
                    print(result)
                    childConn.send((customerID, result[0][0]))
                    childConn.close()
                    end = True
                    success = True

            # 4.2 If the face is unrecognized
            else:
                color = (255, 0, 0)
                stroke = 2
                font = cv2.QT_FONT_NORMAL
                cv2.putText(frame, "UNKNOWN", (x, y), font, 1, color, stroke, cv2.LINE_AA)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), (2))
                hello = ("Your face is not recognized")
                print(hello)
                engine.say(hello)
                # engine.runAndWait()

        if end:
            break
        # GUI
        imgbytes = cv2.imencode('.png', frame)[1].tobytes()
        if not win_started:
            win_started = True
            layout = [
                [sg.Text('iKYC System Interface', size=(30,1))],
                [sg.Image(data=imgbytes, key='_IMAGE_')],
                [sg.Text('Confidence'),
                    sg.Slider(range=(0, 100), orientation='h', resolution=1, default_value=60, size=(15, 15), key='confidence')],
                [sg.Exit()]
            ]
            win = sg.Window('iKYC System',
                    default_element_size=(14, 1),
                    text_justification='right',
                    auto_size_text=False).Layout(layout).Finalize()
            image_elem = win.FindElement('_IMAGE_')
        else:
            image_elem.Update(data=imgbytes)

        event, values = win.Read(timeout=20)
        if event is None or event == 'Exit':
            break
        gui_confidence = values['confidence']

    if not success:
        childConn.send((False, False))
    childConn.close()
    win.Close()
    cap.release()
