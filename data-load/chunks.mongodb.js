// Step 1: Display chunk distribution across shards
// --------------------------------------------------
use('config');
var collectionName = "customersdb.customers";
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
