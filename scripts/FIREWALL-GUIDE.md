# Firewall Configuration Guide

## Quick Setup

Choose the firewall system for your Linux distribution:

### Ubuntu/Debian (UFW)
```bash
sudo bash scripts/firewall-ufw.sh
```

### Any Linux (iptables)
```bash
sudo bash scripts/firewall-iptables.sh
```

### CentOS/RHEL/Fedora (firewalld)
```bash
sudo bash scripts/firewall-firewalld.sh
```

## Required Ports

| Port | Protocol | Purpose | Exposed? |
|------|----------|---------|----------|
| 22 | TCP | SSH - Server management and deployments | ✅ Yes |
| 80 | TCP | HTTP - Let's Encrypt validation & redirect to HTTPS | ✅ Yes |
| 443 | TCP | HTTPS - Main application (joshai.jamsocial.app) | ✅ Yes |
| 3000 | TCP | Next.js - Internal only (via nginx proxy) | ❌ No |

## Port Details

### Port 22 (SSH)
- **Required for:** Server access, deployments, git operations
- **Security:** Use SSH keys, disable password auth
- **Recommendation:** Consider restricting to specific IPs if you have a static IP

### Port 80 (HTTP)
- **Required for:** Let's Encrypt SSL certificate validation
- **Behavior:** nginx automatically redirects to HTTPS
- **Security:** No sensitive data transmitted (redirects immediately)

### Port 443 (HTTPS)
- **Required for:** Main application access
- **URL:** https://joshai.jamsocial.app
- **Security:** SSL/TLS encrypted, password protected app

### Port 3000 (Next.js)
- **Accessibility:** Localhost only (127.0.0.1:3000)
- **Proxy:** nginx reverse proxies to it
- **Security:** NEVER expose this port to the internet
- **Test blocked:** `curl http://YOUR_IP:3000` should timeout

## Testing Firewall

After configuration, test from outside your network:

```bash
# Test HTTPS (should work)
curl -I https://joshai.jamsocial.app
# Expected: HTTP/2 200

# Test HTTP (should redirect)
curl -I http://joshai.jamsocial.app
# Expected: 301 redirect to HTTPS

# Test port 3000 is blocked (should fail)
curl http://YOUR_SERVER_IP:3000
# Expected: Connection timeout or refused

# Test SSH (should work)
ssh josh@YOUR_SERVER_IP
# Expected: SSH login prompt
```

## Checking Firewall Status

### UFW
```bash
sudo ufw status verbose
```

### iptables
```bash
sudo iptables -L -v -n
```

### firewalld
```bash
sudo firewall-cmd --list-all
```

## Common Issues

### Issue: Can't access app after firewall setup
**Solution:** Make sure port 443 is open
```bash
# UFW
sudo ufw allow 443/tcp

# iptables
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4

# firewalld
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Issue: Let's Encrypt fails
**Solution:** Make sure port 80 is open
```bash
# UFW
sudo ufw allow 80/tcp

# iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4

# firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

### Issue: Locked out via SSH
**Prevention:** ALWAYS configure SSH access first before enabling firewall

**Recovery:** Access via hosting provider's console and run:
```bash
sudo ufw allow 22/tcp
# or
sudo iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT
```

## Additional Security

### Restrict SSH to Specific IP

If you have a static IP, restrict SSH access:

**UFW:**
```bash
sudo ufw delete allow 22/tcp
sudo ufw allow from YOUR_IP_ADDRESS to any port 22
```

**iptables:**
```bash
iptables -A INPUT -p tcp -s YOUR_IP_ADDRESS --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP
```

### Rate Limiting

Prevent brute force attacks:

**UFW:**
```bash
sudo ufw limit 22/tcp
```

**iptables:**
```bash
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
```

### Fail2ban

Install fail2ban for automatic IP blocking:

```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Cloud Provider Firewalls

If using a cloud provider (AWS, GCP, Azure, Hetzner, etc.), you may also need to configure their firewall:

### AWS Security Groups
- Inbound: 22, 80, 443
- Outbound: All

### GCP Firewall Rules
```bash
gcloud compute firewall-rules create allow-http --allow tcp:80
gcloud compute firewall-rules create allow-https --allow tcp:443
```

### Azure Network Security Groups
- Add inbound rules for ports 22, 80, 443

### Hetzner Cloud Firewall
- Create firewall in cloud console
- Allow TCP: 22, 80, 443

## Verification Checklist

After firewall setup:

- [ ] Can SSH to server
- [ ] Can access https://joshai.jamsocial.app
- [ ] HTTP redirects to HTTPS
- [ ] Port 3000 is NOT accessible externally
- [ ] SSL certificate working
- [ ] Can login to voice chat app
- [ ] Chat functionality works

## Maintenance

### Backup Firewall Rules

**UFW:**
```bash
sudo cp /etc/ufw/user.rules /root/ufw-backup.rules
```

**iptables:**
```bash
sudo iptables-save > /root/iptables-backup.rules
```

**firewalld:**
```bash
sudo firewall-cmd --runtime-to-permanent
sudo cp /etc/firewalld/zones/public.xml /root/firewalld-backup.xml
```

### Restore Firewall Rules

If something goes wrong:

**UFW:**
```bash
sudo cp /root/ufw-backup.rules /etc/ufw/user.rules
sudo ufw reload
```

**iptables:**
```bash
sudo iptables-restore < /root/iptables-backup.rules
```

**firewalld:**
```bash
sudo cp /root/firewalld-backup.xml /etc/firewalld/zones/public.xml
sudo firewall-cmd --reload
```

## Scripts Provided

| Script | Firewall | OS |
|--------|----------|-----|
| `firewall-ufw.sh` | UFW | Ubuntu, Debian |
| `firewall-iptables.sh` | iptables | Any Linux |
| `firewall-firewalld.sh` | firewalld | CentOS, RHEL, Fedora |

All scripts:
- ✅ Prompt for confirmation
- ✅ Show current status
- ✅ Configure required ports
- ✅ Save rules (persist across reboots)
- ✅ Display final configuration

---

**Choose your script and run it to secure your server!**
