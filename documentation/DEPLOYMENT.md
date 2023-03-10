# Deployment options for the Fiori Launchpad plugin

There are multiple ways to deploy the plugin to your target evironement. This section focuses on AS ABAP and SAP Build Workzone, standard edition (formerly SAP Launchpad service).

## Deployment to AS ABAP from Business Application Studio

Deploy the plugin to your ABAP repos from SAP Business Application Studio using below command (assuming configured SAP Cloud Connector, SAP Private Link Service, Azure API Management or other Gateway). Project assumes existing destination setup as per [ui5-deploy.yaml](https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/ui5-deploy.yaml). Learn more on the [SAP Fiori Tools docs](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/607014e278d941fda4440f92f4a324a6.html?#deployment-to-abap).

```cmd
npm run deploy
```

### (Alternative) Deployment to AS ABAP with URL to ZIP file

This repos uses [ui5-task-zipper](https://github.com/ui5-community/ui5-ecosystem-showcase/tree/main/packages/ui5-task-zipper) that is [available via npm](https://www.npmjs.com/package/ui5-task-zipper) to create a zip file for your convenience. For more info about the zip file upload process, see [this](https://sapui5.hana.ondemand.com/sdk/docs/topics/a560bd6ed4654fd1b338df065d331872.html) SAPUI5 docs entry.

Maintain your [Azure Application Insights Connection String](https://learn.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net#find-your-connection-string) on the [Component.js](https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/webapp/Component.js#L36).

1. Supply the build result via a URL. One option would be hosting it here on the GitHub repos as zazureflpplugin.zip file. To do so move it from the dist folder after build and commit.
2. Feed the link to the report **/UI5/UI5_REPOSITORY_LOAD_HTTP** via transaction **SE38** to upload the zip file. For more info, see SAP documentation [Using the SAPUI5 Repository Upload and Download Reports to Synchronize](https://help.sap.com/docs/SAP_NETWEAVER_750/0ce0b8c56fa74dd897fffda8407e8272/a560bd6ed4654fd1b338df065d331872.html) and [SAPUI5 ABAP repos guide](https://sapui5.hana.ondemand.com/sdk/#/topic/91f346786f4d1014b6dd926db0e91070).
3. Consider running the report in test mode on first try.
4. Make sure the file contains all artifacts that you require (external libs etc.).

### No internet access to reach the zip file? Use file system instead

1. Store the zip where your SAPGUI has access to.
2. Open [Component.js](https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/webapp/Component.js#L36) and replace placeholder 'YOUR-CONNECTION-STRING' with your [Azure Application Insights Connection String](https://learn.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net#find-your-connection-string).
3. Utilize report **/UI5/UI5_REPOSITORY_LOAD** instead of http to upload.

> **Note**
> Working on adding the zipping process to the build process for ease of use with [this](https://github.com/ui5-community/ui5-ecosystem-showcase/tree/main/packages/ui5-task-zipper) community extension.

### Undeploy and clean up of the plugin from your AS ABAP system

```cmd
npm run undeploy
```

Learn more on the [SAP Fiori Tools Docs](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/70872c402edd425d8612ea722ad81287.html?#undeployment-from-abap).

Or delete from your transport request (transaction SE01), BSP application on ABAP (for example using transaction SE80), and Fiori configuration (transaction /UI2/FLP_CONF_DEF).

## Deployment to SAP Build Workzone, Standard edition

This repos is setup for deployment to AS ABAP by default. To configure for Cloud Foundry and multi-target-application (mta) setup follow below guidance:

<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>p</kbd> and choose `Fiori: Add Deployment Configuration` and Cloud Foundry as target environment. Choose to override existing deployment configuration. Finalize configuration in manifest.json as described by SAP at the end of step 3 [here](https://blogs.sap.com/2020/09/17/developing-a-shell-plugin-for-sap-fiori-launchpad-on-sap-cloud-platform-cloud-foundry-environment-with-sap-business-application-studio/).

Verify new mta.yaml, xs-app.json, xs-security.json and adapated package.json.

Use BAS features right-click mta.yaml -> Build MTA project, wait for completion, right click mta_archives/microsoft-com-flpmonitor_0.0.1.mtar -> Deploy MTA archive.

Or use CLI instead:

```cmd
mbt build
cd mta_archives
cf deploy microsoft-com-flpmonitor_0.0.1.mtar
```

Learn more about the launchpad plugin devlopment for Build Work Zone on the [SAP community](https://blogs.sap.com/2020/09/17/developing-a-shell-plugin-for-sap-fiori-launchpad-on-sap-cloud-platform-cloud-foundry-environment-with-sap-business-application-studio/).
