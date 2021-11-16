-- Table creation
DROP DATABASE IF EXISTS `facerecognition`;

CREATE DATABASE `facerecognition`;

USE `facerecognition`;

CREATE TABLE Customer(
    customerID VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    login_date VARCHAR(20) NOT NULL,
    login_time VARCHAR(10) NOT NULL
);

-- A account can either be a saving account or current account, but not both.
CREATE TABLE Account (
    account_number VARCHAR(10) NOT NULL PRIMARY KEY,
    customerID VARCHAR(10) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    balance INT NOT NULL,
    FOREIGN KEY(customerID) REFERENCES Customer(customerID)
);

CREATE TABLE SavingAccount(
    account_number VARCHAR(10) NOT NULL references Account(account_number),
    PRIMARY KEY(account_number)
);

CREATE TABLE CurrentAccount(
    account_number VARCHAR(10) NOT NULL references Account(account_number),
    PRIMARY KEY(account_number)
);

-- The Record Table records cash deposits made by customers into saving acccounts.
CREATE TABLE Record(
    recordID VARCHAR(10) NOT NULL,
    date_year VARCHAR(10) NOT NULL,
    date_month VARCHAR(10) NOT NULL,
    date_day VARCHAR(10) NOT NULL,
    date_time VARCHAR(10) NOT NULL,
    amount INT NOT NULL,
    account_number VARCHAR(10) NOT NULL,
    PRIMARY KEY(recordID),
    FOREIGN KEY(account_number) REFERENCES SavingAccount(account_number)
);

-- Transactions records movement of money from a current account to a saving account of different users.
-- Assumption: Current accounts can only transfer money. Likewise, saving account can only receive money.
create table Transaction(
    transactionID VARCHAR(10) NOT NULL,
    date_year VARCHAR(10) NOT NULL,
    date_month VARCHAR(10) NOT NULL,
    date_day VARCHAR(10) NOT NULL,
    date_time VARCHAR(10) NOT NULL,
    amount INT NOT NULL,
    message VARCHAR(50) NOT NULL,
    CurrentAccount_number VARCHAR(10) NOT NULL,
    SavingAccount_number VARCHAR(10) NOT NULL,
    FOREIGN KEY(CurrentAccount_number) REFERENCES CurrentAccount(account_number),
    FOREIGN KEY(SavingAccount_number) REFERENCES SavingAccount(account_number),
    PRIMARY KEY(transactionID)
);

-- Transfer records movement of money between saving and current account of the same user.
create table Transfer(
    transferID VARCHAR(10) NOT NULL,
    date_year VARCHAR(10) NOT NULL,
    date_month VARCHAR(10) NOT NULL,
    date_day VARCHAR(10) NOT NULL,
    date_time VARCHAR(10) NOT NULL,
    amount INT NOT NULL,
    message VARCHAR(50) NOT NULL,
    SavingAccount_number VARCHAR(10) NOT NULL,
    CurrentAccount_number VARCHAR(10) NOT NULL,
    FOREIGN KEY(CurrentAccount_number) REFERENCES CurrentAccount(account_number),
    FOREIGN KEY(SavingAccount_number) REFERENCES SavingAccount(account_number)
);

-- Dummy Data
INSERT INTO
    Customer (customerID, login_date, login_time, name)
VALUES
    ('1', '2021-09-01', '20-45', 'Joe');

INSERT INTO
    Customer (customerID, login_date, login_time, name)
VALUES
    ('2', '2021-09-03', '15-45', 'Mary');

INSERT INTO
    Customer (customerID, login_date, login_time, name)
VALUES
    ('3', '2021-09-05', '20-40', 'John');

INSERT INTO
    Customer (customerID, login_date, login_time, name)
VALUES
    ('4', '2021-09-07', '20-41', 'Cindy');

INSERT INTO
    Customer (customerID, login_date, login_time, name)
VALUES
    ('5', '2021-09-08', '20-44', 'Leon');

INSERT INTO
    Customer (customerID, login_date, login_time, name)
VALUES
    ('6', '2021-09-10', '20-42', 'Janice');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('1', 'HKD', 500, '1');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('2', 'HKD', 500, '1');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('3', 'USD', 500, '2');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('4', 'USD', 500, '3');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('5', 'HKD', 500, '5');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('6', 'USD', 500, '4');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('7', 'HKD', 500, '6');

INSERT INTO
    Account (account_number, currency, balance, customerID)
VALUES
    ('8', 'USD', 500, '1');

INSERT INTO
    SavingAccount (account_number)
VALUES
    ('1');

INSERT INTO
    SavingAccount (account_number)
VALUES
    ('2');

INSERT INTO
    SavingAccount (account_number)
VALUES
    ('3');

INSERT INTO
    SavingAccount (account_number)
VALUES
    ('4');

INSERT INTO
    CurrentAccount (account_number)
VALUES
    ('5');

INSERT INTO
    CurrentAccount (account_number)
VALUES
    ('6');

INSERT INTO
    CurrentAccount (account_number)
VALUES
    ('7');

INSERT INTO
    CurrentAccount (account_number)
VALUES
    ('8');

INSERT INTO
    Record (
        recordID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        account_number
    )
VALUES
    ('1', '2021', '10', '26', '10-00', 50, '1');

INSERT INTO
    Record (
        recordID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        account_number
    )
VALUES
    ('2', '2021', '10', '26', '10-01', 20, '1');

INSERT INTO
    Record (
        recordID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        account_number
    )
VALUES
    ('3', '2021', '10', '26', '10-02', 10, '1');

INSERT INTO
    Record (
        recordID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        account_number
    )
VALUES
    ('4', '2021', '10', '26', '10-03', 100, '3');

INSERT INTO
    Record (
        recordID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        account_number
    )
VALUES
    ('5', '2021', '10', '26', '10-04', 30, '2');

INSERT INTO
    Record (
        recordID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        account_number
    )
VALUES
    ('6', '2021', '10', '26', '10-05', 60, '4');

INSERT INTO
    Transaction (
        transactionID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        CurrentAccount_number,
        SavingAccount_number
    )
VALUES
    (
        '1',
        '2021',
        '10',
        '26',
        '11-00',
        50,
        'Hello',
        '5',
        '2'
    );

INSERT INTO
    Transaction (
        transactionID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        CurrentAccount_number,
        SavingAccount_number
    )
VALUES
    (
        '2',
        '2021',
        '10',
        '26',
        '11-02',
        10,
        'Hi',
        '5',
        '1'
    );

INSERT INTO
    Transaction (
        transactionID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        CurrentAccount_number,
        SavingAccount_number
    )
VALUES
    (
        '3',
        '2021',
        '10',
        '26',
        '11-04',
        20,
        'Hellooo',
        '6',
        '3'
    );

INSERT INTO
    Transaction (
        transactionID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        CurrentAccount_number,
        SavingAccount_number
    )
VALUES
    (
        '4',
        '2021',
        '10',
        '26',
        '11-05',
        50,
        'HelloHI',
        '7',
        '4'
    );

INSERT INTO
    Transaction (
        transactionID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        CurrentAccount_number,
        SavingAccount_number
    )
VALUES
    (
        '5',
        '2021',
        '10',
        '26',
        '11-07',
        100,
        'Hellohiihi',
        '7',
        '4'
    );

INSERT INTO
    Transaction (
        transactionID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        CurrentAccount_number,
        SavingAccount_number
    )
VALUES
    (
        '6',
        '2021',
        '10',
        '26',
        '11-09',
        70,
        'Helloiii',
        '6',
        '3'
    );

INSERT INTO
    Transaction (
        transactionID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        CurrentAccount_number,
        SavingAccount_number
    )
VALUES
    (
        '7',
        '2021',
        '10',
        '26',
        '11-10',
        20,
        'Hello',
        '6',
        '1'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '1',
        '2021',
        '10',
        '26',
        '11-00',
        350,
        'Hello',
        '1',
        '5'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '2',
        '2021',
        '10',
        '27',
        '11-00',
        250,
        'Helloo',
        '2',
        '6'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '3',
        '2021',
        '10',
        '28',
        '11-00',
        150,
        'He',
        '2',
        '6'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '4',
        '2021',
        '10',
        '28',
        '11-00',
        20,
        'Hi',
        '3',
        '6'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '5',
        '2021',
        '10',
        '28',
        '11-00',
        40,
        'HelloWorld',
        '4',
        '5'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '6',
        '2021',
        '10',
        '29',
        '11-00',
        30,
        'Hellowww',
        '4',
        '6'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '7',
        '2021',
        '10',
        '29',
        '11-00',
        20,
        'Halo',
        '4',
        '5'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '8',
        '2021',
        '10',
        '29',
        '11-00',
        100,
        'Helloeveryone',
        '3',
        '5'
    );

INSERT INTO
    Transfer (
        transferID,
        date_year,
        date_month,
        date_day,
        date_time,
        amount,
        message,
        SavingAccount_number,
        CurrentAccount_number
    )
VALUES
    (
        '9',
        '2021',
        '10',
        '29',
        '11-00',
        1050,
        'Hello',
        '2',
        '7'
    );