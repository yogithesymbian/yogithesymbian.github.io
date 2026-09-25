# Running a Web Security Scan on Cymbal Bank Application

To run a Web Security scan against the Cymbal Bank application, you need to first reserve a static external IP for the cls-vm instance and then configure and run the scan.

## Step-by-step instructions

### Navigate to VM Instances

1. In the Google Cloud Console, use the **Navigation menu** (three horizontal lines) on the top left
2. Select **Compute Engine > VM instances**

### Edit cls-vm Instance

1. Find the VM instance named `cls-vm` in the list
2. Click on the `cls-vm` instance name to open its VM instance details page
3. Click the **EDIT** button at the top of the page

### Reserve a Static External IP

1. Scroll down to the **Network interfaces** section
2. Expand the default network interface (or the one where the external IP is configured)
3. Locate the **External IPv4 address** dropdown menu
4. Click on this dropdown and select **Reserve Static External IP address**
5. In the "Reserve a new static IP address" dialog:
   - For **Name**, enter `static-ip`
   - Click **Reserve**
6. Scroll to the bottom of the VM instance details page and click **Save**

### Find the External IP Address

1. Once the VM instance updates, return to the `cls-vm` VM instance details page
2. Locate the **External IP address** listed for the instance
3. Copy this IP address

### Verify the Application is Accessible

1. Open a new browser tab
2. Construct the URL using the copied External IP address and port `8080`
   - The URL should look like: `http://<YOUR_EXTERNAL_IP>:8080`
   - Example: `http://34.123.45.67:8080`

   ```
   34.145.123.119
   ```

3. Paste this URL into the new browser tab and press Enter
4. You should see the Cymbal Bank corporate banking portal

### Navigate to Web Security Scanner

1. In the Google Cloud Console, use the **Navigation menu**
2. Select **Security Command Center > Web Security Scanner**

### Create a New Scan

1. Click the **New scan** button

### Configure the Scan

1. **Name**: Enter a descriptive name (e.g., `cymbal-bank-app-scan`)
2. **Starting URLs**: In the text field, enter the full URL of your Cymbal Bank application, including the static IP and port 8080
   - Example: `http://<YOUR_EXTERNAL_IP>:8080`
3. **Schedule**: Set this to **One-time** for this task
4. Ensure **Export to Security Command Center** is checked
5. Leave other settings at their defaults for this basic scan

### Save the Scan

1. Click the **Save** button at the bottom of the "Create a new scan" page

### Run the Scan

1. On the **Web Security Scanner** page, find your newly created scan (`cymbal-bank-app-scan`)
2. Click on the scan name to go to its overview page
3. Click the **Run scan** button
4. The scan will be queued. It may take some time for the scan to start and complete
5. Once finished, you can view the results on the scan's overview page or in **Security Command Center Findings**

---

gcloud scc findings list ORGANIZATION_ID --location=us-west1
