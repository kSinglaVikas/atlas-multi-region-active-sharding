// ============================================================================
// Display chunk distribution across shards
// ============================================================================
use('config');

var collectionName = "customersdb.customers";
var collection = db.collections.findOne({ _id: collectionName });

if (!collection) {
  print("[ERROR] Collection " + collectionName + " not found!");
  quit(1);
}

var uuid = collection.uuid;
var chunks = db.chunks.find({ uuid: uuid }).sort({ shard: 1, "min.region": 1 }).toArray();

print("\n[INFO] Chunk Distribution for: " + collectionName);
print("=".repeat(100));
print("Shard".padEnd(25) + " | " + "Region Range".padEnd(30) + " | " + "Email Range");
print("=".repeat(100));

if (!chunks || chunks.length === 0) {
  print("[WARNING] No chunks found!");
} else {
  chunks.forEach(function(chunk) {
    // Convert region values - handle both flat strings and MinKey/MaxKey objects
    var minReg = chunk.min.region === undefined ? '$minKey' : 
                 (typeof chunk.min.region === 'object' ? '$minKey' : String(chunk.min.region));
    var maxReg = chunk.max.region === undefined ? '$maxKey' : 
                 (typeof chunk.max.region === 'object' ? '$maxKey' : String(chunk.max.region));
    
    // Convert email values - truncate to 20 chars and handle MinKey/MaxKey
    var minEmail = chunk.min.email === undefined ? '$minKey' : 
                   (typeof chunk.min.email === 'object' ? '$minKey' : String(chunk.min.email).substring(0, 20));
    var maxEmail = chunk.max.email === undefined ? '$maxKey' : 
                   (typeof chunk.max.email === 'object' ? '$maxKey' : String(chunk.max.email).substring(0, 20));
    
    // Format region and email ranges
    var regionRange = minReg + " → " + maxReg;
    var emailRange = minEmail + " → " + maxEmail;
    
    // Print chunk info with proper padding
    print(
      chunk.shard.padEnd(25) + " | " +
      regionRange.padEnd(30) + " | " +
      emailRange
    );
  });

  print("=".repeat(100));
  print("[SUCCESS] Total chunks: " + chunks.length);
}
