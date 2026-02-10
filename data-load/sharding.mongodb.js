
// ============================================================================
// MongoDB Sharding Configuration Script for customersdb.customers
// ============================================================================

// Step 1: Assign zone tags to shards
// ---------------------------------
// MumbaiZone: handles ap-south-1 region
sh.addShardTag("atlas-ewfst6-shard-0", "MumbaiZone");
sh.addShardTag("atlas-ewfst6-shard-1", "MumbaiZone");

// USZone: handles us-east-1 region
sh.addShardTag("atlas-ewfst6-shard-2", "USZone");

// Verify shard tags
use('config');
print("\n[INFO] Shard Tag Configuration:");
print("=".repeat(50));
db.shards.find().forEach(function(shard) {
  print("  Shard: " + shard._id + " | Tags: " + JSON.stringify(shard.tags));
});

// Step 2: Enable sharding and create sharded collection
// -------------------------------------------------------
use('admin');

// Enable sharding on the database
sh.enableSharding('customersdb');

// Shard the collection on composite key (region, email) for geographic + uniqueness
sh.shardCollection('customersdb.customers', { region: 1, email: 1 });

// Step 3: Define zone tag ranges for geographic distribution
// -----------------------------------------------------------
// Coverage Map:
//   [$minKey, ap-south-1)     → MumbaiZone (shard-0, shard-1)
//   [ap-south-1, us-east-1)  → USZone (shard-2)
//   [us-east-1, $maxKey]     → USZone (shard-2)

// Range 1: Everything before ap-south-1 → MumbaiZone
sh.addTagRange(
  "customersdb.customers",
  { region: MinKey, email: MinKey },
  { region: "ap-south-1", email: MinKey },
  "MumbaiZone"
);

// Range 2: ap-south-1 region data → MumbaiZone
sh.addTagRange(
  "customersdb.customers",
  { region: "ap-south-1", email: MinKey },
  { region: "ap-south-1", email: MaxKey },
  "MumbaiZone"
);

// Range 3: Gap between ap-south-1 and us-east-1 → MumbaiZone
sh.addTagRange(
  "customersdb.customers",
  { region: "ap-south-1", email: MaxKey },
  { region: "us-east-1", email: MinKey },
  "MumbaiZone"
);

// Range 4: us-east-1 region data → USZone
sh.addTagRange(
  "customersdb.customers",
  { region: "us-east-1", email: MinKey },
  { region: "us-east-1", email: MaxKey },
  "USZone"
);

// Range 5: Everything after us-east-1 → USZone
sh.addTagRange(
  "customersdb.customers",
  { region: "us-east-1", email: MaxKey },
  { region: MaxKey, email: MaxKey },
  "USZone"
);

// Step 4: Verify zone tag configuration
// ----------------------------------------
use('config');
print("\n[INFO] Zone Tag Range Configuration:");
print("=".repeat(70));
db.tags.find().forEach(function(tag) {
  var min = JSON.stringify(tag.min);
  var max = JSON.stringify(tag.max);
  print("  Tag: " + tag.tag + " | Range: " + min + " → " + max);
});

// Execute the load using CustomerSingleView.json template and verify data distribution after load completes.
print("\n[INFO] Sharding configuration complete! Please proceed to load data using CustomerSingleView.json template and verify distribution across shards using chunks.mongodb.js script.");
