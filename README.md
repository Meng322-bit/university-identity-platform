# University Identity Platform - AWS EC2 Deployment

Microservices deployed across 3 Ubuntu EC2 instances.

| EC2 Instance | Public IP | Private IP | Services (port) |
|---|---|---|---|
| EC2-1-Gateway | 13.223.2.161 | 172.31.89.97 | api-gateway (3000), register-service (3001), login-service (3002) |
| EC2-2-Admin | 3.86.91.8 | 172.31.80.28 | admin-service (3003) |
| EC2-3-User | 3.84.83.214 | 172.31.93.40 | user-service (3004) |

## Entry point
All requests go through the API Gateway: `http://13.223.2.161:3000`

- POST /register/userregister
- POST /auth/login
- GET /admin/viewalluser
- PUT /user/updateprofile

The gateway reaches the Admin and User services through their private IPs (set in each service's `.env`, which is not stored in GitHub).
