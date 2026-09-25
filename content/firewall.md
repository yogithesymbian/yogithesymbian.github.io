# Resolving "Open SSH port" and "Open RDP port" Vulnerabilities

To resolve the "Open SSH port" and "Open RDP port" high vulnerability findings, you'll need to modify the associated firewall rules in your Google Cloud project.

## Step-by-step instructions

### Access Security Command Center Findings

1. In the Google Cloud Console, navigate to **Security Command Center**
2. From the left-hand navigation, select **Findings**
3. Filter the findings to show **Severity: High** and look for categories like "Open SSH port" and "Open RDP port"

### Identify the Affected Firewall Rule for "Open SSH port"

1. Click on the "Open SSH port" finding
2. In the finding details pane, locate the **Resource path** or similar information that points to the specific Google Cloud Firewall rule responsible for this vulnerability (typically a Google Compute Engine firewall rule)

```
Navy Projects  gcp_low_extra  gcp_low_extra navy-01  qwiklabs-gcp-01-417bbf485867
```

3. Note down the name of this firewall rule

### Modify the "Open SSH port" Firewall Rule

1. In the Google Cloud Console, navigate to **VPC network > Firewall**
2. Locate the firewall rule you identified in the previous step
3. Click on the rule name to open its details, then click **Edit**
4. Find the section for **Source IPv4 ranges** (or similar, indicating the allowed source IPs)
5. You will likely see `0.0.0.0/0` listed, which means the rule is open to the entire internet
6. Change this range to `35.235.240.0/20`
7. Click **Save**

### Identify the Affected Firewall Rule for "Open RDP port"

1. Go back to **Security Command Center > Findings**
2. Click on the "Open RDP port" finding
3. Similar to the SSH finding, locate the **Resource path** or other identifying information for the firewall rule allowing RDP traffic
4. Note down the name of this firewall rule

### Modify the "Open RDP port" Firewall Rule

1. In the Google Cloud Console, navigate to **VPC network > Firewall**
2. Locate the firewall rule you identified in the previous step
3. Click on the rule name to open its details, then click **Edit**
4. Find the section for **Source IPv4 ranges**
5. Change the range from `0.0.0.0/0` to `35.235.240.0/20`
6. Click **Save**

## Result

After these changes, Security Command Center will eventually re-scan your environment. The "Open SSH port" and "Open RDP port" findings should then either disappear or show as resolved in a subsequent scan, as the firewall rules will no longer allow public internet access.
