
sh.addShardTag("atlas-ewfst6-shard-0", "MumbaiZone")
sh.addShardTag("atlas-ewfst6-shard-1", "MumbaiZone")
sh.addShardTag("atlas-ewfst6-shard-2", "HyderabadZone")


use('config');
db.shards.find().forEach(function (shard) {
    print("Shard Name: " + shard._id + ", tags: " + shard.tags);
});

use('admin');

// Enable sharding on the database.
sh.enableSharding('customersdb')

// Shard the collection on the 'region' field, which is a common query predicate.
sh.shardCollection('customersdb.customers', { region: 1, email: 1 })


sh.addTagRange("customersdb.customers", { region: "Mumbai", email: MinKey },
    { region: "Mumbai", email: MaxKey },
    "MumbaiZone")

sh.addTagRange("customersdb.customers", { region: "Hyderabad", email: MinKey },
    { region: "Hyderabad", email: MaxKey },
    "HyderabadZone")

use('config');
db.tags.find().forEach(function (tag) {
    print("Tag: " + tag.tag + ", ns: " + tag.ns);
});


