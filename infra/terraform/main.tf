# Terraform IaC: AICTE Centralized Security Deposit Portal (PSID 26265)
# Infrastructure Baseline for Development, Staging, Production & DR

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.22.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30.0"
    }
  }
}

variable "environment" {
  type        = string
  description = "Target environment: dev, test, staging, prod, dr"
  default     = "prod"
}

variable "db_instance_class" {
  type    = string
  default = "db.m6g.xlarge"
}

# PostgreSQL Database Configuration for FDR Portal
resource "kubernetes_namespace" "aicte_fdr" {
  metadata {
    name = "aicte-fdr-${var.environment}"
    labels = {
      app         = "aicte-fdr-portal"
      environment = var.environment
      governance  = "sovereign-moe"
    }
  }
}

# ConfigMap with Application Runtime Configuration
resource "kubernetes_config_map" "fdr_portal_config" {
  metadata {
    name      = "fdr-portal-config"
    namespace = kubernetes_namespace.aicte_fdr.metadata[0].name
  }

  data = {
    "SPRING_PROFILES_ACTIVE"    = var.environment
    "SPRING_DATASOURCE_URL"     = "jdbc:postgresql://postgres-ha:5432/aicte_fdr_${var.environment}?sslmode=verify-full"
    "TZ"                        = "Asia/Kolkata"
    "NIST_SESSION_IDLE_TIMEOUT" = "900"
    "MAX_ABSOLUTE_SESSION_SECS" = "28800"
    "AUDIT_HASH_ALGORITHM"      = "SHA-256"
  }
}
