/**
 * Fiori Launchpad Shell Plugin central entry point
 * 
 * Configration Hints:
 *  Is your ABAP repos active? Check OData service /UI5/ABAP_REPOSITORY_SRV and https://help.sap.com/docs/ABAP_PLATFORM_NEW/468a97775123488ab3345a0c48cadd8f/a883327a82ef4cc792f3c1e7b7a48de8.html
 *  Be aware of Azure Application Insights Limits: https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics#limits
 * 
 * Maintain ai.cloud.role tags (see method "sendSAPTraceToAzureAppInsights") to customize Azure App Insights application map
 *---
 * Tested with S4 2021, SAPUI5 1.38+
 *
 * @license Apache-2.0 license, https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/LICENSE
 * @version 0.2
 * @author  MartinPankraz, https://github.com/MartinPankraz
 * @updated 2022-11-28
 * @link    https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin/blob/main/README.md#changelog
 *
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "sap/ui/performance/trace/Passport",
        "microsoft/com/flpmonitor/model/models",
        "sap/ui/model/resource/ResourceModel",
        "sap/m/MessageToast",
        "microsoft/com/flpmonitor/libs/ai.2.min"
    ],
    function (UIComponent, Device, Passport, models, ResourceModel, MessageToast, myAppInsights) {
        "use strict";
        
        //switch between "magic wand" button to de/activate tracing manually or always load as soon as possible (required for Home page tracing for instance.)
        const ENABLE_TRACE_BUTTON_EXPERIENCE        = false;
        //https://learn.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net#find-your-connection-string
        //Consider reverse proxy for IngestionEndpoint URL in case of CORS challenges
        const AZURE_APP_INSIGHTS_CONNECTION_STRING  = "";
        //custom label for Application Map on Azure App Insights
        const AI_CLOUD_ROLE                         = "SAP Fiori";
        //custom instance label for detailed view
        const AI_CLOUD_ROLE_INSTANCE                = "SAPGW-PM4";

        return UIComponent.extend("microsoft.com.flpmonitor.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
             init: function () {
                var that = this;

                //Refer to i18n settings here: https://sapui5.hana.ondemand.com/#/topic/df86bfbeab0645e5b764ffa488ed57dc
                this.i18nModel = new ResourceModel({
                    bundleName: "microsoft.com.flpmonitor.i18n.i18n"
                });
                this.resourceBundle = that.i18nModel.getResourceBundle();

                const TraceInactiveIcon = "sap-icon://activate";
                const TraceInactiveTooltip = that.resourceBundle.getText("traceInactiveTooltip");
                const TraceActiveIcon = "sap-icon://record";
                const TraceActiveTooltip = that.resourceBundle.getText("traceActiveTooltip");
                
                this.traceActive = false;

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                // enable routing
                this.getRouter().initialize();
                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                this.SAPLogonSystem = sap.ushell.Container.getLogonSystem();
                this.SAPLogonSystem = this.SAPLogonSystem.alias + "-" + this.SAPLogonSystem.platform;
                //SAPUI5 docs for renderer and shell extensions: https://help.sap.com/docs/ABAP_PLATFORM_BW4HANA/a7b390faab1140c087b8926571e942b7/3e4ba0dbef874eb5a6bc88bb9f0787e5.html?locale=en-US
                //https://blogs.sap.com/2019/08/12/fiori-launchpad-plugin-extension-with-headeritem-disappears-solution-and-configuration-options/
                if(ENABLE_TRACE_BUTTON_EXPERIENCE){
                    var oRenderer = sap.ushell.Container.getRenderer("fiori2");
                    //add trace button to shell only once!
                    if(!this.traceButton){
                        this.traceButton = oRenderer.addHeaderItem({
                            id: "AppInsightsTraceButton",
                            icon: TraceInactiveIcon,
                            ariaLabel: "activate-deactivate-appinsights-trace",
                            tooltip: TraceActiveTooltip,
                            visible: true,
                            press: function (oEvent) {
                                window.traceActive = (oEvent.getSource().getIcon() == TraceActiveIcon);
                                //swap state -> if active disable tracing on button press and vice versa
                                if(window.traceActive){
                                    window.traceActive = false;//remember state swap
                                    that.handleAppInsightsLoading(false, that);
                                    oEvent.getSource().setIcon(TraceInactiveIcon);
                                    oEvent.getSource().setTooltip(TraceActiveTooltip);
                                    MessageToast.show(that.resourceBundle.getText("traceInactiveToastMsg"));
                                }else{
                                    window.traceActive = true;//remember state swap
                                    that.handleAppInsightsLoading(true, that);
                                    that.prepareSAPTraceForAzureAppInsights(that);
                                    oEvent.getSource().setIcon(TraceActiveIcon);
                                    oEvent.getSource().setTooltip(TraceInactiveTooltip);
                                    MessageToast.show(that.resourceBundle.getText("traceActiveToastMsg"));
                                }
                            }
                        }, true, false,[oRenderer.LaunchpadState.Home]);// keep tracing button on home page only!
                    }
                }else{
                    //in case Shell button shall not be used
                    window.traceActive = true;
                    that.handleAppInsightsLoading(true, that);
                    that.prepareSAPTraceForAzureAppInsights(that);
                }
            },
            /**
             *   Load Azure Application Insights SDK snippet. See API documentation here:
             *       https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript?tabs=snippet
             */
            handleAppInsightsLoading: function(activate, that){
                var snippet = {
                    crossOrigin: "anonymous",//https://github.com/Microsoft/ApplicationInsights-JS#snippet-configuration-options
                    config: {
                        connectionString: AZURE_APP_INSIGHTS_CONNECTION_STRING,
                        /** ...Other Configuration Options...
                         *   Find the API docs here: https://github.com/microsoft/ApplicationInsights-JS#snippet-setup-ignore-if-using-npm-setup
                         */
                        //enableDebug: true,
                        
                        // time in milliseconds a user spends on each page On each new page view, the duration the user spent on the previous page is sent as a custom metric named PageVisitTime. This custom metric is viewable in the Metrics Explorer as a log-based metric.
                        autoTrackPageVisitTime: true,
                        //enable distributed tracing
                        distributedTracingMode: 2, // DistributedTracingModes.W3C
                        //handle state-based route changing that occurs in single page applications
                        enableAutoRouteTracking: true
                    }
                };
                if(activate){
                    if(!that.myAppInsights){
                        that.init = new Microsoft.ApplicationInsights.ApplicationInsights(snippet);
                        //consider delaying till SAP load duration akquired.
                        that.myAppInsights = that.init.loadAppInsights();
                    }
                }else{//unload App Insights
                    if(that.myAppInsights){
                        that.myAppLifeCycle.detachAppLoaded(that.handleFioriAppLoaded, that);
                        that.init.unload();
                        that.init = null;
                        that.myAppInsights = null;
                    }
                }
            },
            /**  transmit Fiori app metadata to Azure Application Insights
             *  See API details here: https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics
             */
            sendSAPTraceToAzureAppInsights: function (appName,that){
                //don't track if deactivated
                if(window.traceActive){
                    //put initializer on the stack only once but feed dynamic objects to handler
                    if(!that.myInitializer){
                        var telemetryInitializer = (envelope) => {
                            var insightsName = envelope.name.substring(envelope.name.lastIndexOf(".") + 1);//extract name for convenience
                            const trackedEvents = ["PageviewPerformance","Pageview","Metric"/*,"RemoteDependency"*/];//track only selected events
                            if(trackedEvents.indexOf(insightsName) != -1){
                                //ensure tags exist
                                envelope.tags = envelope.tags || {};
                                envelope.tags["ai.cloud.role"] = AI_CLOUD_ROLE; //custom label for Application Map on Azure App Insights
                                envelope.tags["ai.cloud.roleInstance"] = AI_CLOUD_ROLE_INSTANCE; //custom instance label for detailed view
                                //enrich with SAP request metadata
                                envelope.data = envelope.data || {};
                                //TODO: replace with polyfill https://github.com/christiansany/object-assign-polyfill/blob/master/index.js
                                Object.assign(envelope.data,that.payload);
                            }
                        };
                        that.myInitializer = that.myAppInsights.addTelemetryInitializer(telemetryInitializer);
                    }
                    //call initializer instead of track to avoid duplicates
                    /*that.myAppInsights.trackPageView({
                        name: appName,
                        properties: that.payload
                    });*/
                }
            },
            handleFioriAppLoaded: function(oEvent){
                var that = this;//inject bound this context from attached Fiori app load
                const _UNKNOWN = "UNKNOWN";
                var oParameters = oEvent.getParameters();
                var intent = oParameters.getIntent().then(function(event){
                    that.payload.SAPsemanticObject = event.semanticObject;
                })
                var appManifest = _UNKNOWN;
                var appID = _UNKNOWN;
                that.payload = {SAPTraceRootID: that._rootID, SAPTraceTransactionID: that._transactionID, SAPLogonSystem: that.SAPLogonSystem};

                var currentApp = that.myAppLifeCycle.getCurrentApplication();
                that.payload.SAPApplicationType = currentApp.applicationType;//UI5|WDA|NWBC|URL|TR
                that.payload.SAPFioriUserID = that._UserID;
                that.payload.SAPFioriUserEmail = that._UserEmail;
                that.payload.SAPFioriUserFullName = that._UserFullName;

                //leverage getInfo promise if available
                if(currentApp.getInfo){
                    currentApp.getInfo(["appId","technicalAppComponentId","appSupportInfo","productName","appIntent"]).then(
                        function(info){
                            if(info.appId){
                                appID = info.appId;
                            }else{
                                //default to componentId in case no appId (e.g. apps of type NWBC does't have one)
                                appID = info.technicalAppComponentId || _UNKNOWN;
                            }
                            that.payload.SAPTechnicalAppComponentID = info.technicalAppComponentId || _UNKNOWN;
                            that.payload.SAPAppSupportInfo = info.appSupportInfo || _UNKNOWN;
                            if(info.productName){
                                that.payload.SAPProductName = info.productName;   
                            }
                            that.payload.SAPAppIntent = info.appIntent || _UNKNOWN;

                            that.sendSAPTraceToAzureAppInsights(appID,that);
                        },
                        function(error){
                            console.log(error);
                        }
                    );
                }else if(currentApp.componentInstance){
                    //only available for UI5
                    appManifest = currentApp.componentInstance.getManifest()["sap.app"];
                    appID = appManifest.id;
                    //Get SAP app component hierarchy
                    if(appManifest.ach){
                        that.payload.SAPTechnicalAppComponentID = appManifest.ach;
                    }

                    that.sendSAPTraceToAzureAppInsights(appID,that);
                }else{
                    //other cases? adjust defaults?
                    console.log("Unhandled SAP app type. Please open an Issue at https://github.com/MartinPankraz/az-monitor-sap-fiori-plugin");
                }
            },
            /**
             * Hook into sap.ushell.Container to get UserInfo and app life cycle to enrich tracked Azure AppInsights requests
             */
            prepareSAPTraceForAzureAppInsights: function (that){
                const _UNKNOWN = "UNKNOWN";
                that._User = _UNKNOWN;
                that._UserID = _UNKNOWN;
                that._rootID = _UNKNOWN;

                /**
                 *  if SAP Passport not available use legacy jQuery commands to load IDs. See SAP documentation for reference: https://help.sap.com/docs/ABAP_PLATFORM_NEW/468a97775123488ab3345a0c48cadd8f/a075ed88ef324261bca41813a6ac4a1c.html
                 *  and https://sapui5.hana.ondemand.com/sdk/#/topic/a075ed88ef324261bca41813a6ac4a1c.html
                 */
                if(Passport.getRootId){
                    that._rootID = Passport.getRootId() || _UNKNOWN;
                }else{
                    if(jQuery.sap.fesr){
                        that._rootID = jQuery.sap.fesr.getRootId()|| _UNKNOWN;
                    }
                }

                if(Passport.getTransactionId){
                    that._transactionID = Passport.getTransactionId()|| _UNKNOWN;
                }else{
                    if(jQuery.sap.fesr){
                        that._transactionID = jQuery.sap.fesr.getCurrentTransactionId()|| _UNKNOWN;
                    }
                }

                /**
                 *  See the SAP docs for more details about the public Shell API
                 *   https://sapui5.hana.ondemand.com/sdk/#/api/sap.ushell.services.AppLifeCycle
                 *
                 *  See community contribution for additional details:
                 *   https://stackoverflow.com/questions/49229045/sap-fiori-get-logged-in-user-details-in-ui5-application          
                 */
                sap.ushell.Container.getServiceAsync("UserInfo").then(
                    function(UserInfoService) {         
                        //Remember user at first load
                        that._UserID = UserInfoService.getId();
                        //public getters added with SAPUI5 1.86+
                        if(UserInfoService.getUser){
                            that._User = UserInfoService.getUser() || _UNKNOWN;
                            that._UserEmail = that._User.getEmail() || _UNKNOWN;
                            that._UserFullName = that._User.getFullName() || _UNKNOWN;
                            if(!that._UserID){
                                that._UserID = that._User.getId() || _UNKNOWN;
                            }
                            /**
                             * OPTIONALLY: transmit the SAP user context to Azure Application Insights
                             *
                             *   Consult the "managing personal data" guide Azure Application Insights to learn more about the implications of personal data processing.
                             *       https://learn.microsoft.com/azure/azure-monitor/logs/personal-data-mgmt
                             */
                            that.myAppInsights.setAuthenticatedUserContext(that._UserID);
                        }

                        //register subsequent Fiori app loadings (keep track of user navigations)
                        sap.ushell.Container.getServiceAsync("AppLifeCycle").then(function(AppLifeCycleService) {         
                            that.myAppLifeCycle = AppLifeCycleService;
                            //act on each Fiori app load and bind "this" context by injecting "that"
                            that.myAppLifeCycle.attachAppLoaded(that.handleFioriAppLoaded,that);
                        });
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
        });
    }
);