from dotenv import load_dotenv

import os, subprocess, time
from datetime import datetime, timedelta
from os.path import exists
from pymongo import MongoClient

load_dotenv()

database_connection_string = os.environ['DATABASE_CONNECTION_STRING']
start_time = datetime.now()

client = MongoClient(database_connection_string)
dbName = client['notscrapyet']
dbDealers = dbName['dealers']
dbAds = dbName['ads']
dbAdsErrors = dbName['ads_errors']

last_run_time = datetime.now() + timedelta(hours=24)
# query = { '$or': [{'status': 'active', 'update_status': {'$eq': None}, 'completed_time': {'$eq' : None}}, {'status': 'active', 'update_status': 'complete', 'completed_time': {'$lte': 'last_run_time'}}]}
query = {'status': 'active'}

dealer_details = dbDealers.find(query)
for dealer in dealer_details:
    id = str(dealer['_id'])
    name = dealer['name']

    print(name + ' (' + id + ')')
    if exists(id + '.py') == True:
        dbDealers.update_one({'_id': id}, {'$set': {'update_status': 'in_progress'}})
        dbAds.update_many({'dealer_id': id}, {'$set': {'status': 'in_progress'}})
        dbAdsErrors.update_many({'dealer_id': id}, {'$set': {'status': 'in_progress'}})
        result = subprocess.call('python3 ' + id + ".py " + id, shell=True)
        # if result != 0:
        #     if result == 5:
        #         print('Exiting for proxy is blocked: ' + str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        #         exit()
        #     elif result == 6:
        #         print('Unable to read search page, continuing')
        #     else:
        #         print('Code error'); exit()

        # else: print('No sources need updating, sleeping for 10 minutes: ' + str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))); time.sleep(600)
        dbAds.delete_many({'dealer_id': id, 'update_status': 'in_progress'})
        dbAdsErrors.delete_many({'dealer_id': id, 'update_status': 'in_progress'})
        dbDealers.update_one({'_id': id},{'$set': {'update_status': 'complete', 'completed_time' :datetime.now()}})

        print('Source updated successfully')
    else:
        print('File does not exist')

end_time = datetime.now()
completion_time = end_time - start_time
print('The overnight script took ' + str(completion_time) + ' to complete')
