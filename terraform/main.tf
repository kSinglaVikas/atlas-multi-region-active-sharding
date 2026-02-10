resource "mongodbatlas_advanced_cluster" "global_cluster" {
  project_id   = var.project_id
  name         = "GeoShardedCluster"
  cluster_type = "GEOSHARDED"
  global_cluster_self_managed_sharding = true
  replication_specs = [
    # MumbaiZone Shard 1
    {
      zone_name = "MumbaiZone"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
            autoscaling = {
              compute = {
                enabled            = true
                min_instance_size = "M30"
                max_instance_size = "M40"
              }
            }
          }
          provider_name = "AWS"
          priority      = 7
          region_name   = "AP_SOUTH_1"
        },
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
            autoscaling = {
              compute = {
                enabled            = true
                min_instance_size = "M30"
                max_instance_size = "M40"
              }
            }
          }
          provider_name = "AWS"
          priority      = 6
          region_name   = "AP_SOUTH_2"
        },
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
            autoscaling = {
              compute = {
                enabled            = true
                min_instance_size = "M30"
                max_instance_size = "M40"
              }
            }
          }
          provider_name = "GCP"
          priority      = 5
          region_name   = "ASIA_SOUTH_2"
        }
      ]
    },
    # MumbaiZone Shard 2 (same topology as Shard 1)
    {
      zone_name = "MumbaiZone"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
            autoscaling = {
              compute = {
                enabled            = true
                min_instance_size = "M30"
                max_instance_size = "M40"
              }
            }
          }
          provider_name = "AWS"
          priority      = 7
          region_name   = "AP_SOUTH_1"
        },
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
            autoscaling = {
              compute = {
                enabled            = true
                min_instance_size = "M30"
                max_instance_size = "M40"
              }
            }
          }
          provider_name = "AWS"
          priority      = 6
          region_name   = "AP_SOUTH_2"
        },
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 1
            autoscaling = {
              compute = {
                enabled            = true
                min_instance_size = "M30"
                max_instance_size = "M40"
              }
            }
          }
          provider_name = "GCP"
          priority      = 5
          region_name   = "ASIA_SOUTH_2"
        }
      ]
    },
    # USZone Shard 1: AWS is primary
    {
      zone_name = "USZone"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "AWS"
          priority      = 7
          region_name   = "US_EAST_1"
        },
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "AWS"
          priority      = 6
          region_name   = "US_WEST_1"
        },
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 1
          }
          provider_name = "GCP"
          priority      = 5
          region_name   = "EASTERN_US"
        }
      ]
    }
  ]
}