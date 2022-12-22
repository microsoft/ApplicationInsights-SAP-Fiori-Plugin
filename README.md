# Azure Application Insights SAP-Fiori-Plugin (PREVIEW)

[SAP Fiori Launchpad Plugin](https://assets.cdn.sap.com/sapcom/docs/2019/03/b2dff710-427d-0010-87a3-c30de2ffd8ff.pdf) to gain insights into Fiori metrics with [Azure Application Insights](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview?tabs=net).

> **Note**
> Find official API documentation for the Azure Application Insights JS snippet [here](https://github.com/microsoft/ApplicationInsights-JS#snippet-setup-ignore-if-using-npm-setup).

🧪Tested with Business Suite NW 7.51 and S/4HANA 2022 using Edge Browser.

A typical single instance setup would look like below. The reverse proxy is required in case of strict [CORS policies](https://github.com/microsoft/ApplicationInsights-SAP-Fiori-Plugin#how-to-deal-with-cross-origin-resource-sharing-cors-errors). Proxy choices range from managed services like [Azure Front Door](https://learn.microsoft.com/azure/frontdoor/front-door-overview) or [Azure Application Gateway](https://learn.microsoft.com/azure/application-gateway/overview) to self-hosted solutions like Apache.

![Architecture overview](img/overview.png)

> **Note**
> The same approach can be applied to [SAP Build Workzone, standard edition](https://help.sap.com/docs/Launchpad_Service/8c8e1958338140699bd4811b37b82ece/9db48fa44f7e4c62a01bc74c82e74e07.html) (formerly SAP Launchpad Service) hosted on the SAP Business Technology Platform (SAP BTP). Connection to the SAP workload is established via the [SAP Cloud Connector](https://help.sap.com/docs/CP_CONNECTIVITY/cca91383641e40ffbe03bdc78f00f681/e6c7616abb5710148cfcf3e75d96d596.html) (SCC) for any-premises or the [SAP Private Link Service for Azure](https://blogs.sap.com/2021/12/29/getting-started-with-btp-private-link-service-for-azure/).

## Prerequisites

1. Azure Application Insights instance (access to [connection string](https://learn.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net#find-your-connection-string))
2. Imported [Azure Monitor Workbook](Fiori-Performance-Analysis.workbook) (Create new, open code view '</>', select Gallery template, copy&paste the json into it and save)
3. Fiori Launchpad with SAPUI5 1.71.39+
4. Fiori Launchpad configured to use custom PlugIns. See [SAP's Fiori docs](https://www.sap.com/documents/2019/03/b2dff710-427d-0010-87a3-c30de2ffd8ff.html) (especially steps 76 onwards) to get started.

| Parameter   | Value       | Description |
| ----------- | ----------- | ----------- |
| Launchpad Plugin ID      | `ZAZUREFLPPLUGIN`       | Retrieve from builder.customTasks.configuration.app.name in [ui5-deploy.yaml](ui5-deploy.yaml)       |
| Launchpad Plugin URL   | `/sap/bc/ui5_ui5/sap/`        | Re-use from here or collect from `npm run deploy` output        |
| UI5 Component ID   | `microsoft.com.flpmonitor`        | Verify from `sap.app.id` in [manifest.json](/webapp/manifest.json)        |

> **Note**
> Optionally add Azure Monitor for SAP Solutions Instance for infrastructure telemetery correlation

## Local build instructions (SAP Business Application Studio)

```cmd
git clone https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin.git
```

This app has been generated using the SAP Fiori tools - App Generator in [SAP Business Application Studio](https://help.sap.com/docs/SAP%20Business%20Application%20Studio), as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following commands from the generated app root folder:

```cmd
npm install
```

Maintain your [Azure Application Insights Connection String](https://learn.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net#find-your-connection-string) and [AICloudRole](https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/webapp/Component.js#L38) attributes on the [Component.js](https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/webapp/Component.js#L36).

```cmd
npm run build
```

```cmd
npm start
```

## Deployment to AS ABAP from Business Application Studio

Deploy the plugin to your ABAP repos from SAP Business Application Studio using below command (assuming configured SAP Cloud Connector, SAP Private Link Service, Azure API Management or other Gateway). Project assumes existing destination setup as per [ui5-deploy.yaml](https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/ui5-deploy.yaml). Learn more on the [SAP Fiori Tools docs](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/607014e278d941fda4440f92f4a324a6.html?#deployment-to-abap).

```cmd
npm run deploy
```

## (Alternative) Deployment to AS ABAP with URL to ZIP file

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

## Undeploy and clean up of the plugin from your AS ABAP system

```cmd
npm run undeploy
```

Learn more on the [SAP Fiori Tools Docs](https://help.sap.com/docs/SAP_FIORI_tools/17d50220bcd848aa854c9c182d65b699/70872c402edd425d8612ea722ad81287.html?#undeployment-from-abap).

Or delete from your transport request (transaction SE01), BSP application on ABAP (for example using transaction SE80), and Fiori configuration (transaction /UI2/FLP_CONF_DEF).

## How to deal with Cross-Origin Resource Sharing (CORS) errors

Consider the `crossOrigin` setting of the App Insights [configuration](https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/webapp/Component.js). Read more about it [here](https://learn.microsoft.com/azure/azure-monitor/app/javascript?tabs=snippet#configuration).

In case relaxation of the CORS policy is not an option, consider adding a reverse proxy. This is a standard practice with SAP Fiori integration with SAP Business Objects for instance. To do so adjust the hostname accordingly on the App Insights SDK by changing the [connection string](/webapp/Component.js#L36).

## Troubleshooting hints

Use the hot-key `CTRL+SHIFT+ALT+S` provided for SAPUI5 to [enable debug mode](https://sapui5.hana.ondemand.com/sdk/#/topic/c9b0f8cca852443f9b8d3bf8ba5626ab.html#loioc9b0f8cca852443f9b8d3bf8ba5626ab) from your Fiori Launchpad instance to load the non-minified sources for this plugin and the Azure App Insights SDK.

### Changelog

- 2022-12-14 Azure Monitor workbook added
- 2022-12-07 CORS guidance
- 2022-10-21 Automatic build process note for SAPGUI upload added

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit [CLA open-source](https://cla.opensource.microsoft.com).

When you submit a pull request, a CLA bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party's policies.
