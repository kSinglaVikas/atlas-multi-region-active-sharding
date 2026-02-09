# Load Generator Examples

__1. Load Customer Data In The Atlas Cluster__
* Generate 1,000,000 random JSON documents representing insurance customer 'single view' records, based on the `CustomerSingleView.json` template:

  ```bash
  mgeneratejs CustomerSingleView.json -n 10000 | mongoimport --uri $MONGO_URI --db customersdb --collection customers --numInsertionWorkers=10
  ```
Paste the copied URI into the `--uri` parameter, replacing the username & password fields with those you created earlier.
