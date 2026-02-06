resource "mongodbatlas_advanced_cluster" "global_cluster" {
  project_id   = var.project_id
  name         = "GeoShardedCluster"
  cluster_type = "GEOSHARDED"

  replication_specs = [
    {
      zone_name = "MumbaiZone"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M40"
            node_count    = 2
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
          provider_name = "GCP"
          priority      = 6
          region_name   = "EASTERN_US"
        }
      ]
    },
    {
      zone_name = "HyderabadZone"
      region_configs = [
        {
          electable_specs = {
            instance_size = "M30"
            node_count    = 3
          }
          provider_name = "AWS"
          priority      = 7
          region_name   = "AP_SOUTH_2"
        },
      ]
    }
  ]
}
