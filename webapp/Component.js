/**
 * Fiori Launchpad Shell Plugin central entry point
 * 
 * Configration Hints:
 *  Is your ABAP repos active? Check OData service /UI5/ABAP_REPOSITORY_SRV and https://help.sap.com/docs/ABAP_PLATFORM_NEW/468a97775123488ab3345a0c48cadd8f/a883327a82ef4cc792f3c1e7b7a48de8.html
 *  Be aware of Azure Application Insights Limits: https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics#limits
 * 
 * Maintain ai.cloud.role tags (see method "sendSAPTraceToAzureAppInsights") to customize Azure App Insights application map
 *---
 *
 * @version 0.5
 * @author  MartinPankraz, https://github.com/MartinPankraz
 * @updated 2022-12-22
 * @link    https://github.com/microsoft/ApplicationInsights-SAP-Fiori-Plugin#changelog
 *
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
var that;
!function(T,l,y){var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}if(!e[C]){var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),l.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,p)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:N,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(l,p))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit&&y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
    src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
    //crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag
    onInit: function (sdk) {// Once the application insights instance has loaded and initialized this callback function will be called with 1 argument -- the sdk instance (DO NOT ADD anything to the sdk.queue -- As they won't get called)
        sdk.addTelemetryInitializer(function (envelope) {
            var insightsName = envelope.name.substring(envelope.name.lastIndexOf(".") + 1);//extract name for convenience
            const trackedEvents = ["PageviewPerformance","Pageview","Metric"/*,"RemoteDependency"*/];//track only selected events
            if(trackedEvents.indexOf(insightsName) != -1){
                //ensure tags exist
                envelope.tags = envelope.tags || {};
                envelope.tags["ai.cloud.role"] = "SAP Fiori"; //custom label for Application Map on Azure App Insights
                envelope.tags["ai.cloud.roleInstance"] = "SAPGW-PM4"; //custom instance label for detailed view
                //enrich with SAP request metadata
                envelope.data = envelope.data || {};
                //TODO: replace with polyfill https://github.com/christiansany/object-assign-polyfill/blob/master/index.js
                Object.assign(envelope.data,that.payload);
            }
        });
    },
    cfg: { // Application Insights Configuration
        //https://learn.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net#find-your-connection-string
        connectionString: "CONNECTION-STRING",
        //overridePageViewDuration: true,
        //Automatically track route changes in Single Page Applications (SPA). If true, each route change will send a new Pageview to Application Insights. Hash route changes changes (example.com/foo#bar) are also recorded as new page views
        enableAutoRouteTracking: false
    }
});
sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "sap/ui/performance/trace/Passport",
        "sap/ui/performance/trace/Interaction",
        "microsoft/com/flpmonitor/model/models"
    ],
    function (UIComponent, Device, Passport, Interaction, models) {
        "use strict";

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
                that = this;

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                // enable routing
                this.getRouter().initialize();
                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                //remember which entries were read last from the Interactions array
                that.indexPointer = 0;
                that.lastReportedInteractionId = null;

                //Called when the Fiori hash is changed
                //$(window).hashchange(function () {
                    //ensure listeners are only attached once per session.
                that.prepareSAPTraceForAzureAppInsights(that);
                //}.bind(this));

            },

            /**  transmit Fiori app metadata to Azure Application Insights
             *  See API details here: https://learn.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics
             */
            sendSAPTraceToAzureAppInsights: function (appName,that){
                var myInteractions = Interaction.getAll();
                var request = {name: appName};
                
                //id of last forwarded interaction
                var idx = myInteractions.findIndex(el => el.id === that.lastReportedInteractionId)
                if (idx == -1){
                    that.indexPointer = 0;
                }else{
                    //exclude last item
                    that.indexPointer = idx + 1;
                }
                //report collected session Interactions (continous array per session) correlated with "app-loaded event" to App Insights manually
                for(var i=that.indexPointer;i<myInteractions.length;i++){
                    var element = myInteractions[i];

                    //supply standard duration field
                    that.payload.duration = element.duration || null;
                    //map custom fields
                    that.payload.SAPinteractionBytesReceived = element.bytesReceived || null;
                    that.payload.SAPinteractionBytesSent = element.bytesSent || null;
                    that.payload.SAPinteractionNavigationTime = element.navigation || null;
                    that.payload.SAPinteractionNetworkTime = element.networkTime || null;
                    that.payload.SAPinteractionProcessingTime = element.processing || null;
                    that.payload.SAPinteractionRequestTime = element.requestTime || null;
                    that.payload.SAPRoundTrips = element.completeRoundtrips || null;
                    that.payload.SAPinteractionEvent = element.event || null;
                    that.payload.SAPinteractionTrigger = element.trigger || null;
                    that.payload.SAPinteractionComponent = element.component || null;
                    
                    request.properties = that.payload;
                    //track Fiori interactions as custom event
                    window.appInsights.trackEvent(request);   
                    //remember last forwarded interaction to iterate interactions array continously according to its lifecycle
                    that.lastReportedInteractionId = element.id;
                }
                
            },
            
            handleFioriAppLoaded: function(oEvent){
                var that = this;//inject bound this context from attached Fiori app load
                const _UNKNOWN = "UNKNOWN";
                var appManifest = _UNKNOWN;
                var appID = _UNKNOWN;
                that.payload = {SAPTraceRootID: that._rootID, SAPTraceTransactionID: that._transactionID, SAPLogonSystem: that.SAPLogonSystem};

                var oParameters = oEvent.getParameters();
                oParameters.getIntent().then(function(event){
                    that.payload.SAPsemanticObject = event.semanticObject;
                });

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
                }

                if(Passport.getTransactionId){
                    that._transactionID = Passport.getTransactionId()|| _UNKNOWN;
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
                             window.appInsights.setAuthenticatedUserContext(that._UserID);
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