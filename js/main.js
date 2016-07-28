var serviceApplicationId = "0ldXwBNODO.bluetoothleservice";
var remotePort;
var bluetoothEnabled;


function setAdv(command, lat, lng, stamp)
{
	console.log("ADV ", command, lat, lng, stamp);
	remotePort.sendMessage([{
		key : "command",
		value : "setAdv" // string
	} , 
	{
		key: "subcommand",
		value: command
	},
	{
		key: "lat",
		value: lat // string
	} ,
	{
		key: "lng",
		value: lng // string
	},
	{
		key: "stamp",
		value: stamp // string
	}]);
}

function stopAdv()
{
	remotePort.sendMessage([{
		key : "command",
		value : "stopAdv"
	}]);
}

function startScan()
{
	remotePort.sendMessage([ {
		key : "command",
		value : "startScan"
	} ]);
}

function stopScan()
{
	remotePort.sendMessage([ {
		key : "command",
		value : "stopScan"
	} ]);
}

function getMsg(data, replyPort) 
{
	for (var i = 0; i < data.length; i++) {
		console.log("key:" + data[i].key + " / value:" + data[i].value);
	}
	if (replyPort) {
		console.log("replyPort given: " + replyPort.messagePortName);
	}
}

tizen.application.launch(serviceApplicationId, function() {
		console.log("Service started");
		
		setTimeout(function(){
			console.log("RemotePort");
			remotePort = tizen.messageport.requestRemoteMessagePort(serviceApplicationId, "BLE_NATIVE");
		}, 1000);
		
	}, function() {
		console.error("Service failed");
	});


function sendGeoposition()
{
	navigator.geolocation.getCurrentPosition(
			function(l){
				console.log(l);
				globalStampCounter++;
				setAdv("0", l.coords.latitude.toString(), l.coords.longitude.toString(), globalStampCounter.toString());
				}, 
				function(e)
				{
					console.error(e);
				});
}

window.onload = function() {

var localPort = tizen.messageport.requestLocalMessagePort("BLE_WEB");
var localPortWatchId = localPort.addMessagePortListener(getMsg);



bluetoothEnabled = localStorage.getItem("bluetoothEnabled");
if (bluetoothEnabled === null)
{
	bluetoothEnabled = false;
	localStorage.setItem("bluetoothEnabled", false);
}
$("#bluetoothCheckbox").prop("checked", bluetoothEnabled);
$("#bluetoothCheckbox").click(function(){
	bluetoothEnabled = $(this).prop("checked");
});





window.addEventListener(
					'tizenhwkey',
					function(ev) {
						
						if (ev.keyName === "menu")
						{
							tau.changePage("#menuPage");
						}
						
						if (ev.keyName !== "back")
							return;

						var page = document
								.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id
								: "";

						switch (pageid) {
						case "mainPage":
							console.log("pop from main, exiting");
							tizen.application.getCurrentApplication().exit();
							break;
						case "menuPage":
							console.log("pop from menu to mainPage");
							tau.changePage("#mainPage");
							break;
						case "routesMain":
							console.log("pop from routes main to menuPage");
							tau.changePage("#menuPage");
							break;

						case "searchByAddressPage":
							console
									.log("pop from searchByAddressPage main to menuPage");
							tau.changePage("#menuPage");
							break;
						default:
							console.log("BACK KEY STATE IS UNPREDICTABLE: " + pageid);

						}

					});

};
function googleInit() {
	console.log("google was inited");
}