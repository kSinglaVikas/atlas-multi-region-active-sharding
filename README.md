# Asymmetric Sharding with MongoDB Atlas Global Cluster

This repository contains Terraform code to provision a MongoDB Atlas Global Cluster with shards in AWS Mumbai and Hyderabad regions.

## Structure
- `main.tf`: Terraform configuration for the global cluster
- `variables.tf`: Input variables
- `provider.tf`: Provider configuration
- `terraform.tfvars`: Example variable values (do not commit secrets)
- `.gitignore`: Standard ignores for Terraform and editors

## Usage
1. Install [Terraform](https://www.terraform.io/)
2. Configure your Atlas API keys and project ID in `terraform.tfvars`
3. Run:
   ```
   terraform init
   terraform plan
   terraform apply
   ```

## Destroying Resources
To destroy all resources managed by this configuration:
```
terraform destroy
```

## Checking State
To inspect the current Terraform state and resources:
```
terraform show
```

## Security
- Do not commit your `terraform.tfvars` or any files containing secrets.

## License
MIT License