# MongoDB Atlas Geo-Sharded Cluster - Infrastructure as Code

A complete infrastructure-as-code solution for provisioning and managing a MongoDB Atlas geo-sharded cluster with zone-based sharding across multiple AWS regions.

## Project Overview

This project demonstrates production-ready geo-sharding with MongoDB Atlas, featuring:

- **Geo-Distributed Sharding**: Data automatically routed to regional shards based on geographic zones
- **High Availability**: Multi-region replica sets with automatic failover
- **Autoscaling**: Dynamic compute scaling from M30 to M40 instances
- **Infrastructure as Code**: Complete Terraform configuration for reproducible deployments
- **Data Load Tools**: Scripts and templates for testing and data distribution

## Directory Structure

```
/
├── terraform/                    # Infrastructure provisioning
│   ├── main.tf                   # Core cluster configuration
│   ├── provider.tf               # MongoDB Atlas provider setup
│   ├── variables.tf              # Input variables
│   ├── versions.tf               # Terraform and provider versions
│   └── README.md                 # → See for deployment instructions
│
├── data-load/                    # Data loading and sharding configuration
│   ├── sharding.mongodb.js       # Zone-based sharding setup script
│   ├── chunks.mongodb.js         # Chunk distribution viewer
│   ├── CustomerSingleView.json   # mgeneratejs test data template
│   └── README.md                 # → See for data loading instructions
│
└── README.md                     # This file
```

## Quick Start

1. **Deploy Infrastructure**: See [terraform/README.md](terraform/README.md)
2. **Configure Sharding**: See [data-load/README.md](data-load/README.md)
3. **Load Test Data**: See [data-load/README.md](data-load/README.md)

## Architecture at a Glance

### Zone-Based Sharding

```
Geographic Data       Zone Tag         Target Shards
─────────────────────────────────────────────────
ap-south-1    →   MumbaiZone    →   Shard 0, 1
us-east-1     →   USZone        →   Shard 2
```

### Cluster Configuration

- **Type**: GEOSHARDED
- **Shards**: 3 (MumbaiZone x2, USZone x1)
- **Shard Key**: `{ region: 1, email: 1 }`
- **Autoscaling**: M30-M40 instances
- **Replication**: Automatic across availability zones

## Documentation

| Component | Documentation |
|-----------|---------------|
| **Infrastructure** | [terraform/README.md](terraform/README.md) - Terraform deployment, variables, troubleshooting |
| **Data Loading** | [data-load/README.md](data-load/README.md) - Sharding setup, data generation, verification |

## Security Considerations

1. **Never commit secrets**:
   - API keys (MONGODB_ATLAS_PUBLIC_KEY, MONGODB_ATLAS_PRIVATE_KEY)
   - Connection strings with credentials
   - terraform.tfvars file

2. **Access Control**:
   - Use MongoDB Atlas IP allowlists
   - Restrict API key permissions
   - Enable two-factor authentication

3. **State Management**:
   - Terraform state files are `.gitignore`d
   - Consider using Terraform Cloud for remote state
   - Enable state encryption

## License & Disclaimer

**LICENSE**: This project is provided AS-IS and may be freely used, modified, and distributed.

**DISCLAIMER**: 

THE SOFTWARE AND DOCUMENTATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS, CONTRIBUTORS, OR OWNERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE, DOCUMENTATION, OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Use at your own risk.** Users are responsible for:
- Validating configurations for their use case
- Testing in non-production environments first
- Monitoring costs and resource usage
- Maintaining security and access controls
- Backing up critical data
- Understanding MongoDB Atlas billing

## Additional Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [MongoDB Sharding Guide](https://www.mongodb.com/docs/manual/sharding/)
- [Terraform Documentation](https://www.terraform.io/docs)
- [MongoDB Atlas Terraform Provider](https://registry.terraform.io/providers/mongodb/mongodbatlas/latest/docs)