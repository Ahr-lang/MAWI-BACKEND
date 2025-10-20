# Quick Deploy Guide - Observability Stack for Coolify

## What Changed?

Instead of mounting config files as volumes (which doesn't work in Coolify), we now **embed configs into Docker images**.

## Files Created

1. **`docker/Dockerfile.prometheus`** - Builds Prometheus with embedded config
2. **`docker/Dockerfile.otel-collector`** - Builds OTEL Collector with embedded config
3. **`docker/Dockerfile.grafana`** - Builds Grafana with embedded config

## Updated Files

1. **`docker/docker-compose.prod.yml`** - Now builds custom images for all services
2. **`src/telemetry/tracing.ts`** - Made OTEL optional/graceful

## Deploy Steps

```bash
# 1. Commit all changes
git add docker/ src/telemetry/tracing.ts
git commit -m "Fix Coolify deployment - embed observability configs in images"
git push origin master

# 2. Redeploy in Coolify (it will build all 4 services)
```

## What You Get

✅ **API Service** (port 3000) - Your main application
✅ **Prometheus** (port 9090) - Metrics storage
✅ **Grafana** (port 3002) - Dashboards
✅ **OTEL Collector** (port 4318) - Metrics/trace collection

## Accessing Grafana

After deployment, to access Grafana externally:
1. Go to Coolify → Your Application → Configuration
2. Scroll to "Ports" section
3. Add port mapping: `3002`
4. Coolify generates a public URL
5. Login: `admin` / (set password via `GRAFANA_ADMIN_PASSWORD` env var)

## How It Works Now

```
Your App → OTEL Collector → Prometheus → Grafana
           (port 4318)      (port 9090)   (port 3002)
```

All services run in the same Docker network and communicate internally.

## Key Difference from Before

**Before:** ❌ Volume mounts → Files don't exist in Coolify
```yaml
volumes:
  - ./observability/prometheus.yml:/etc/prometheus/prometheus.yml  # Fails!
```

**After:** ✅ Embedded in image → Works everywhere
```dockerfile
COPY observability/prometheus.yml /etc/prometheus/prometheus.yml  # Success!
```

## Environment Variables to Set in Coolify

Required for observability:
- `OTEL_SERVICE_NAME` (optional, defaults to "mawi-backend")
- `GRAFANA_ADMIN_PASSWORD` (optional, defaults to "admin")

All other environment variables (DB, MinIO, JWT) remain the same.
