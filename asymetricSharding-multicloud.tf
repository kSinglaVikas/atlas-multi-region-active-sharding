# asymetricSharding-multicloud.tf
# Terraform configuration for a MongoDB Atlas cluster with 3 shards, each split across AWS Mumbai, Azure Pune, and GCP Delhi.
# Shard 1: AWS Mumbai is primary
# Shard 2: Azure is primary
# Shard 3: GCP is primary

resource "mongodbatlas_advanced_cluster" "multicloud_sharded" {
  project_id       = var.project_id
  name             = "multicloud-sharded-cluster"
  cluster_type     = "GEOSHARDED"
  global_cluster_self_managed_sharding = true
  replication_specs = [
    # Shard 1: AWS Mumbai is primary
    {
      zone_name = "Shard1"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "AWS"
          priority      = 7
          region_name   = "AP_SOUTH_1"
        },
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "AZURE"
          priority      = 6
          region_name   = "INDIA_CENTRAL"
        },
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "GCP"
          priority      = 5
          region_name   = "CENTRAL_US"
        }
      ]
    },
    # Shard 2: Azure is primary
    {
      zone_name = "Shard2"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "AZURE"
          priority      = 7
          region_name   = "INDIA_CENTRAL"
        },
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "AWS"
          priority      = 6
          region_name   = "AP_SOUTH_1"
        },
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "GCP"
          priority      = 5
          region_name   = "CENTRAL_US"
        }
      ]
    },
    # Shard 3: GCP is primary
    {
      zone_name = "Shard3"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
          }
          provider_name = "GCP"
          priority      = 7
          region_name   = "CENTRAL_US"
        },
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
          }
          provider_name = "AWS"
          priority      = 6
          region_name   = "AP_SOUTH_1"
        },
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
          }
          provider_name = "AZURE"
          priority      = 5
          region_name   = "INDIA_CENTRAL"
        }
      ]
    }
  ]
}
