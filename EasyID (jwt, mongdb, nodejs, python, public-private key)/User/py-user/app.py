# importing the requests library 
import requests 
import getpass
import json

isLoggedIn = 'n'
token = ''

while 1:
    while isLoggedIn == 'n':
        print('Login to get your EASYID access card')
        email = input('Enter email: ')
        pswd = getpass.getpass('Password: ')
        URL = 'http://localhost:3001/api/user/login'
        r = requests.post(URL, json={'email': email, 'password': pswd})
        data = r.json()
        # if no token was sent back
        if 'token' not in data:
            print('\n'+data['message']+'\n')
        else:    
            #print('\nBody:\n'+data['token']+'\n')
            #print('\nHeader:\n'+r.headers['auth-token']+'\n')
            token = r.headers['auth-token']
            isLoggedIn = 'y'

    print('\nOptions: \n1 SKAT\n2 BANK\n0 Sign out')
    choice = input('Press a number: ')

    if choice == '1':
        URL = 'http://localhost:3002/api/user/skat'
        r = requests.get(URL, headers={'auth-token': token})
        data = r.json()
        # if no debt was sent back
        if 'debt' not in data:
            print('\n'+data['message']+'\n')
        else:    
            print('\nYour debt at SKAT is: '+str(data['debt'])+' DKK')
    elif choice == '2':
        URL = 'http://localhost:3003/api/user/bank'
        r = requests.get(URL, headers={'auth-token': token})
        data = r.json()
        # if no debt was sent back
        if 'balance' not in data:
            print('\n'+data['message']+'\n')
        else:    
            print('\nYour balance at the BANK is: '+str(data['balance'])+' DKK')
    elif choice == '0':
        print('\nGoodbye!\n')
        isLoggedIn = 'n'
        token = ''
    else:
        print('\nPlease enter a valid number')
