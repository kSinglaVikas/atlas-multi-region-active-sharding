# MongoDB Atlas Geo-Sharded Cluster Infrastructure

This Terraform configuration provisions a MongoDB Atlas geo-sharded cluster optimized for high availability with zone-based sharding across multiple regions.

## Overview

The infrastructure creates a **GEOSHARDED** MongoDB cluster with:
- **3 Shards** distributed across zones
- **2 Geographic Regions**: ap-south-1 (Mumbai) and ap-south-2 (Hyderabad)
- **Autoscaling**: M30-M40 instances with dynamic compute scaling
- **High Availability**: Multiple replica sets per shard

## Architecture

### Sharding Configuration

```
┌─────────────────────────────────────────────────────────────┐
│                   GeoShardedCluster                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MumbaiZone (Shard 1 & 2)         HyderabadZone (Shard 3)   │
│  ├─ AP_SOUTH_1 (Primary)          ├─ AP_SOUTH_2 (Primary)   │
│  │  └─ 2x M40 nodes               │  └─ 2x M30 nodes        │
│  └─ AP_SOUTH_2 (Secondary)        └─ AP_SOUTH_1 (Secondary) │
│     └─ 1x M40 node                   └─ 1x M30 node         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Compute Scaling

- **Minimum**: M30 instances
- **Maximum**: M40 instances
- **Autoscaling**: Enabled for automatic capacity management

## Files

- **`main.tf`**: Core MongoDB Atlas cluster configuration
- **`variables.tf`**: Input variables (project ID, etc.)
- **`versions.tf`**: Required provider versions
- **`provider.tf`**: MongoDB Atlas provider configuration
- **`terraform.tfvars`**: Variable values (create before deployment)

## Prerequisites

1. **MongoDB Atlas Account** with API keys
2. **Terraform** >= 1.0
3. **Environment Variables**:
   ```bash
   export MONGODB_ATLAS_PUBLIC_KEY="your_public_key"
   export MONGODB_ATLAS_PRIVATE_KEY="your_private_key"
   ```

## Usage

### 1. Initialize Terraform

```bash
cd terraform/
terraform init
```

### 2. Set Variables

Create or edit `terraform.tfvars`:

```hcl
project_id = "your_mongodb_atlas_project_id"
```

Or pass variables inline:

```bash
terraform plan -var="project_id=your_project_id"
```

### 3. Plan Deployment

```bash
terraform plan
```

Review the planned changes to ensure correctness.

### 4. Apply Configuration

```bash
terraform apply
```

Confirm when prompted. The cluster will take 25-30 minutes to provision.

### 5. Get Connection String

After successful deployment:

```bash
terraform output
```

Or retrieve from MongoDB Atlas UI under "Connect" → "Drivers"

## Key Resources

### Cluster Configuration

- **Cluster Type**: GEOSHARDED
- **Name**: GeoShardedCluster

### Shard 1: MumbaiZone Shard 1
- **AWS ap-south-1** (Priority: 7) — 1x M40 nodes
- **AWS ap-south-2** (Priority: 6) — 1x M40 node
- **GCP ap-south-2** (Priority: 5) — 1x M40 node

### Shard 2: MumbaiZone Shard 2
- **AWS ap-south-1** (Priority: 7) — 1x M40 nodes
- **AWS ap-south-2** (Priority: 6) — 1x M40 node
- **GCP ap-south-2** (Priority: 5) — 1x M40 node

### Shard 3: USZone
- **AWS us-east-1** (Priority: 7) — 1x M30 nodes
- **AWS us-west-1** (Priority: 6) — 1x M30 node
- **GCP eastern-us** (Priority: 5) — 1x M30 node

## Terraform Commands

```bash
# Initialize provider and download modules
terraform init

# Validate configuration syntax
terraform validate

# Show planned changes
terraform plan

# Apply changes to create resources
terraform apply

# Target specific resource
terraform apply -target="mongodbatlas_advanced_cluster.global_cluster"

# Check the state of resources
terraform show

# Destroy all resources
terraform destroy
```

## State Management

- **State File**: `terraform.tfstate` (gitignored)
- **Backup**: `terraform.tfstate.backup`
- **Remote State**: Consider using Terraform Cloud for production

## Variables

### Required

- **`project_id`** (string): MongoDB Atlas project ID

### Optional

Customize in `main.tf`:
- Instance sizes (M30, M40)
- Auto-scaling min/max values
- Region configurations

## Troubleshooting

### Connection Timeout

If you see "dial tcp timeout" during `terraform apply`:
- Wait for cluster to stabilize (takes 10-15 minutes)
- Verify MongoDB Atlas API endpoints are accessible
- Check network security and firewall rules

### State Lock Issues

If stuck on a previous operation:

```bash
terraform force-unlock <lock_id>
```

### Verify Cluster Status

Check in MongoDB Atlas UI:
1. Navigate to "Clusters"
2. Select "GeoShardedCluster"
3. View "Deployment" tab
4. Check "Replication" for shard health

## Cost Estimation

Run before deployment:

```bash
terraform plan -out=tfplan
# Check the resource counts and sizes
```

Costs depend on:
- Number of nodes (M30 vs M40)
- Data transfer between regions
- Backup storage

## Cleanup

To destroy the cluster:

```bash
terraform destroy
```

Confirm when prompted. This will remove:
- MongoDB Atlas cluster
- All data in the cluster
- Associated backups

## Next Steps

After cluster deployment:

1. **Configure Sharding**: Run `sharding.mongodb.js` from `../data-load/`
2. **Load Test Data**: Use `mgeneratejs` and `mongoimport`
3. **Verify Distribution**: Run `chunks.mongodb.js` script

See `../data-load/README.md` for detailed instructions.

## Additional Resources

- [MongoDB Atlas Terraform Provider](https://registry.terraform.io/providers/mongodb/mongodbatlas/latest/docs)
- [MongoDB Sharding Documentation](https://www.mongodb.com/docs/manual/sharding/)
- [Zone Sharding for High Availability](https://www.mongodb.com/docs/manual/tutorial/sharding-high-availability-writes/)
- [Terraform Documentation](https://www.terraform.io/docs)

## Support

For issues:
1. Check MongoDB Atlas API logs
2. Review Terraform debug logs: `TF_LOG=DEBUG terraform apply`
3. Consult MongoDB Atlas documentation
4. Open an issue in the repository
