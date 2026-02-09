
// ============================================================================
// MongoDB Sharding Configuration Script for customersdb.customers2
// ============================================================================

// Step 1: Assign zone tags to shards
// ---------------------------------
// MumbaiZone: handles ap-south-1 region
sh.addShardTag("atlas-ewfst6-shard-0", "MumbaiZone");
sh.addShardTag("atlas-ewfst6-shard-1", "MumbaiZone");

// HyderabadZone: handles ap-south-2 region
sh.addShardTag("atlas-ewfst6-shard-2", "HyderabadZone");

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
sh.shardCollection('customersdb.customers2', { region: 1, email: 1 });

// Step 3: Define zone tag ranges for geographic distribution
// -----------------------------------------------------------
// Coverage Map:
//   [$minKey, ap-south-1)     → MumbaiZone (shard-0, shard-1)
//   [ap-south-1, ap-south-2)  → HyderabadZone (shard-2)
//   [ap-south-2, $maxKey]     → HyderabadZone (shard-2)

// Range 1: Everything before ap-south-1 → MumbaiZone
sh.addTagRange(
  "customersdb.customers2",
  { region: MinKey, email: MinKey },
  { region: "ap-south-1", email: MinKey },
  "MumbaiZone"
);

// Range 2: ap-south-1 region data → MumbaiZone
sh.addTagRange(
  "customersdb.customers2",
  { region: "ap-south-1", email: MinKey },
  { region: "ap-south-1", email: MaxKey },
  "MumbaiZone"
);

// Range 3: Gap between ap-south-1 and ap-south-2 → MumbaiZone
sh.addTagRange(
  "customersdb.customers2",
  { region: "ap-south-1", email: MaxKey },
  { region: "ap-south-2", email: MinKey },
  "MumbaiZone"
);

// Range 4: ap-south-2 region data → HyderabadZone
sh.addTagRange(
  "customersdb.customers2",
  { region: "ap-south-2", email: MinKey },
  { region: "ap-south-2", email: MaxKey },
  "HyderabadZone"
);

// Range 5: Everything after ap-south-2 → HyderabadZone
sh.addTagRange(
  "customersdb.customers2",
  { region: "ap-south-2", email: MaxKey },
  { region: MaxKey, email: MaxKey },
  "HyderabadZone"
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

// Step 5: Display chunk distribution across shards
// --------------------------------------------------
use('config');
var collectionName = "customersdb.customers2";
var uuid = db.collections.findOne({ _id: collectionName }).uuid;

print("\n[INFO] Chunk Distribution for: " + collectionName);
print("=".repeat(90));
print("Shard".padEnd(25) + " | " + "Region Range".padEnd(30) + " | " + "Email Range");
print("=".repeat(90));

db.chunks.find({ uuid: uuid })
  .sort({ shard: 1, "min.region": 1 })
  .forEach(function(chunk) {
    // Extract region values
    var minReg = chunk.min.region ? 
      (typeof chunk.min.region === 'object' ? '$minKey' : chunk.min.region) : '$minKey';
    var maxReg = chunk.max.region ? 
      (typeof chunk.max.region === 'object' ? '$maxKey' : chunk.max.region) : '$maxKey';
    
    // Extract email values
    var minEmail = chunk.min.email ?
      (typeof chunk.min.email === 'object' ? '$minKey' : chunk.min.email) : '$minKey';
    var maxEmail = chunk.max.email ?
      (typeof chunk.max.email === 'object' ? '$maxKey' : chunk.max.email) : '$maxKey';
    
    // Print chunk info
    print(
      chunk.shard.padEnd(25) + " | " +
      (minReg + " → " + maxReg).padEnd(30) + " | " +
      minEmail + " → " + maxEmail
    );
  });

print("\n[SUCCESS] Sharding configuration complete!");
