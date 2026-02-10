# MongoDB Geo-Sharded Data Load and Configuration

This directory contains scripts and templates for configuring zone-based sharding and loading test data into a MongoDB Atlas geo-sharded cluster.

## Overview

The setup implements **zone-based sharding** across two geographic regions:
- **MumbaiZone** (ap-south-1): Handles India-based customer data
- **USZone** (us-east-1): Handles US-based customer data

### Files in This Directory

- **`sharding.mongodb.js`**: Main configuration script for zone-based sharding setup
- **`chunks.mongodb.js`**: Utility script to display chunk distribution in a formatted table
- **`CustomerSingleView.json`**: mgeneratejs template for generating customer test data
- **`README.md`**: This documentation file

### Architecture

- **Shard 0 & 1**: Tagged with `MumbaiZone` → stores ap-south-1 region data
- **Shard 2**: Tagged with `USZone` → stores us-east-1 region data
- **Shard Key**: `{ region: 1, email: 1 }` - compound key for geographic distribution and uniqueness

## Prerequisites

1. MongoDB Atlas cluster configured with geo-sharding
2. MongoDB URI connection string set as environment variable:
   ```bash
   export MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
   ```
3. Tools installed:
   - `mgeneratejs` - for generating test data
   - `mongoimport` - for importing data
   - `mongosh` - for running configuration scripts

## Step 1: Configure Sharding

Run the sharding configuration script to set up zone tags and shard key ranges:

```bash
mongosh $MONGO_URI < sharding.mongodb.js
```

This script will:
1. Assign zone tags to shards (MumbaiZone, USZone)
2. Enable sharding on `customersdb` database
3. Shard the `customers` collection on `{ region: 1, email: 1 }`
4. Define zone tag ranges to ensure all data is zone-aware
5. Display chunk distribution across shards

## Step 2: Load Customer Data

Generate and import 1,000,000 random customer records based on the `CustomerSingleView.json` template:

```bash
mgeneratejs CustomerSingleView.json -n 1000000 | \
  mongoimport --uri $MONGO_URI \
  --db customersdb \
  --collection customers \
  --numInsertionWorkers=10
```

### Data Distribution

The data will be automatically distributed across zones based on the `region` field:
- **ap-south-1** documents → MumbaiZone (shards 0, 1)
- **us-east-1** documents → USZone (shard 2)

Expected distribution: ~50% to each region (500,000 documents per zone)

## Step 3: Verify Data Distribution

### View Chunk Distribution

Use the dedicated chunks script for a formatted view of chunk distribution:

```bash
mongosh $MONGO_URI < chunks.mongodb.js
```

This displays a table showing:
- Which shard owns each chunk
- Region key ranges (e.g., ap-south-1 → ap-south-1, $minKey → $maxKey)
- Email key ranges within each chunk

### Check Overall Shard Status

For MongoDB's built-in shard status:

```bash
mongosh $MONGO_URI --eval "sh.status()" | grep -A 20 "customersdb.customers"
```

### Query Data Counts

Verify data distribution per region:

```javascript
use customersdb
db.customers.countDocuments({ region: "ap-south-1" })  // ~500,000
db.customers.countDocuments({ region: "us-east-1" })   // ~500,000

// Check total documents
db.customers.countDocuments()  // ~1,000,000
```

## CustomerSingleView.json Template

The template generates realistic insurance customer data with:
- **Region**: Randomly selected from `["ap-south-1", "us-east-1"]`
- **Personal Info**: First/last name, email, cell, year of birth, gender
- **Address**: US-based address with geolocation coordinates
- **Policies**: 3-6 random insurance policies (auto, home, or life)

## Troubleshooting

### Orphaned Chunks
If you see chunks on untagged shards, ensure all tag ranges cover the entire key space from `MinKey` to `MaxKey`.

**Check for orphaned chunks:**
```bash
mongosh $MONGO_URI < chunks.mongodb.js
```
Look for chunks that aren't aligning with expected zones (e.g., ap-south-1 data on USZone shards).

### Uneven Distribution
Wait for the balancer to complete migrations. Check balancer status:
```javascript
sh.isBalancerRunning()
db.getSiblingDB("config").locks.findOne({ _id: "balancer" })
```

### Connection Issues
Verify your `$MONGO_URI` is correct and includes proper authentication:
```bash
echo $MONGO_URI | grep -o "mongodb+srv://[^@]*@"
```

## Quick Reference

### Common Commands

```bash
# Configure sharding
mongosh $MONGO_URI < sharding.mongodb.js

# View chunk distribution
mongosh $MONGO_URI < chunks.mongodb.js

# Load 1M customer records
mgeneratejs CustomerSingleView.json -n 1000000 | \
  mongoimport --uri $MONGO_URI --db customersdb --collection customers --numInsertionWorkers=10

# Check balancer status
mongosh $MONGO_URI --eval "sh.isBalancerRunning()"

# View shard status
mongosh $MONGO_URI --eval "sh.status()"
```

## Additional Resources

- [MongoDB Sharding Documentation](https://www.mongodb.com/docs/manual/sharding/)
- [Zone Sharding for High Availability](https://www.mongodb.com/docs/manual/tutorial/sharding-high-availability-writes/)
- [Shard Key Selection](https://www.mongodb.com/docs/manual/core/sharding-shard-key/)
