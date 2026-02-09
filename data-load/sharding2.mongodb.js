
sh.addShardTag("atlas-ewfst6-shard-0", "MumbaiZone")
sh.addShardTag("atlas-ewfst6-shard-1", "MumbaiZone")
sh.addShardTag("atlas-ewfst6-shard-2", "HyderabadZone")


use('config');
db.shards.find().forEach(function(shard) {
    print("Shard Name: " + shard._id + ", tags: " + shard.tags);
});

use('admin');

// Enable sharding on the database.
sh.enableSharding('customersdb')

// Shard the collection on the 'region' field, which is a common query predicate.
sh.shardCollection('customersdb.customers2', { region: 1, email: 1 })

sh.addTagRange("customersdb.customers2", { region: MinKey, email: MinKey },
    { region: "ap-south-1", email: MinKey },
    "MumbaiZone")


sh.addTagRange("customersdb.customers2", { region: "ap-south-1", email: MinKey },
    { region: "ap-south-1", email: MaxKey },
    "MumbaiZone")

sh.addTagRange("customersdb.customers2", { region: "ap-south-1", email: MaxKey },
    { region: "ap-south-2", email: MinKey },
    "MumbaiZone")


sh.addTagRange("customersdb.customers2", { region: "ap-south-2", email: MinKey },
    { region: "ap-south-2", email: MaxKey },
    "HyderabadZone")

sh.addTagRange("customersdb.customers2", { region: "ap-south-2", email: MaxKey },
    { region: MaxKey, email: MaxKey },
    "HyderabadZone")

use('config');
db.tags.find().forEach(function(tag) {
    print("Tag: " + tag.tag + ", ns: " + tag.ns);
});

// Get the shard distribution for the collection.

use('config');

collectionName = "customersdb.customers2";

print("Processing collection: " + collectionName + "\n");
print("\n" + "Shard".padEnd(25) + " | " + "Region Range".padEnd(30) + " | " + "Email Range".padEnd(25));
print("=".repeat(85));


uuid = db.collections.findOne({ _id: collectionName }).uuid;

db.chunks.find({ uuid: uuid })
  .sort({ shard: 1, "min.region": 1 })
  .forEach(function(chunk) {
    var minReg = chunk.min.region ? 
      (typeof chunk.min.region === 'object' ? '$minKey' : chunk.min.region) : '$minKey';
    var maxReg = chunk.max.region ? 
      (typeof chunk.max.region === 'object' ? '$maxKey' : chunk.max.region) : '$maxKey';
    var minEmail = chunk.min.email ?
      (typeof chunk.min.email === 'object' ? '$minKey' : chunk.min.email) : '$minKey';
    var maxEmail = chunk.max.email ?
      (typeof chunk.max.email === 'object' ? '$maxKey' : chunk.max.email) : '$maxKey';
    
    print(
      chunk.shard.padEnd(25) + " | " +
      minReg.padEnd(12) + " → " + maxReg.padEnd(12) + " | " +
      minEmail.padEnd(12) + " → " + maxEmail.padEnd(12) 
    );
  });
