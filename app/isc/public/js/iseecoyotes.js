/*!
  * I See Coyotes v1.0.1 (https://iseecoyotes.com)
*/

var map, infoWindow, geocoder;
var siteURL = "https://iseecoyotes.com";
var apiURL = "https://9no00wsnwh.execute-api.us-east-2.amazonaws.com/prod/";
var apiHeaders = {
		"x-api-key": "kAB6Qwjsmz82vcdJ4VxLs4axxrLEz7Pu1nrFjmnn"
    };
var pageArr = [];
var pageNumber = 0;
var widgetComments, widgetNotifications;

function validateEmail(inputValue) {
	var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return mailFormat.test(inputValue);
}
function validatePostalcode(inputValue){
	var postalcodeFormat = /^\d{5}$|^\d{5}-\d{4}$/;
	return postalcodeFormat.test(inputValue);
}
function validateReCaptcha(divID,widgetID) {
	if (widgetID != null) {
		var response = grecaptcha.getResponse(widgetID);
	} else {
		var response = grecaptcha.getResponse();
	}
	if(response.length == 0) {
		document.getElementById(divID).style.display = "block";
		return false;
	} else {
		document.getElementById(divID).style.display = "none";
		return true;
	}
}
/******************************************************************************
index.html	DONE
******************************************************************************/
function initMapIndex() {
	var image = 'img/mapicon.png';
	var markers = [];
	var settings = {
		"url": apiURL + "sightingsget",
		"method": "POST",
		"headers": apiHeaders
	}
	$.ajax(settings).done(function (response) {
		response.Items.forEach(function(value) {
			var lat = value.isc_lat;
			var long = value.isc_long;
			var date = new Date(value.isc_date);
			date = date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
			hours = value.isc_time.substring(0,2);
			minutes = value.isc_time.substring(3,5);
			suffix = (hours >= 12)? 'pm' : 'am';
			hours = (hours > 12)? hours -12 : hours;
			hours = (hours == '00')? 12 : hours;
			time = hours + ":" + minutes + " " + suffix;
			if (value.isc_images != "none") {
				var infotext = "<a href='view.html'>" + date + " " + time + "</a><br /><br />" + value.isc_notes + "<br /><br /><img width='100px' src='" + siteURL + "/assets/" + value.sightingid + "_01." + value.isc_images + "' />";
			} else {
				var infotext = "<a href='view.html'>" + date + " " + time + "</a><br /><br />" + value.isc_notes;
			}
			switch(value.isc_options) {
				case 'Cougar':
					image = "img/mapicon2.png";
					break;
				default:
					image = 'img/mapicon.png';
			}
			var latLng = new google.maps.LatLng(
				lat,
				long
			);
			var marker = new google.maps.Marker({
				position: latLng,
				icon: image
			});
			var infowindow = new google.maps.InfoWindow({
				content: infotext
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
			markers.push(marker);
		})
		var markerCluster = new MarkerClusterer(map, markers);
	});
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.67897950734105, lng: -96.89238409999999},
		zoom: 4,
		mapTypeControl: false,
		streetViewControl: false,
		fullscreenControl: false,
		mapTypeId: "terrain"
	});
}

/******************************************************************************
report.html	Needs CAPTCHA, TEMP Removed
******************************************************************************/
function validate_fileupload(fileName) {
	var allowed_extensions = new Array("jpg","png","gif");
	var file_extension = fileName.split('.').pop().toLowerCase();
	for(var i = 0; i <= allowed_extensions.length; i++) {
		if(allowed_extensions[i]==file_extension) {
			return true;
		}
	}
	return false;
}

function postDB() {
	var recaptchavalid = validateReCaptcha("reportWarning");
	isc_filename = '';
	isc_filetype = '';
	isc_file = '';
	fileuploadvalid = true;

	if (document.getElementById('uploads').value != "") {
		if (validate_fileupload(document.getElementById('uploads').value) == true) {
			isc_filename = document.getElementById('uploads').files[0].name.toLowerCase();
			isc_filetype = document.getElementById('uploads').files[0].type.toLowerCase();
			isc_file = document.getElementById('uploads').files[0];
		} else {
			document.getElementById("uploads").className = "form-control is-invalid";
			fileuploadvalid = false;
		}
	}

	if(recaptchavalid == true && fileuploadvalid == true) {
		if (document.getElementById("notes").value == "") {
			isc_notes = "%00";
		} else {
			isc_notes = encodeURIComponent(document.getElementById("notes").value);
		}
		var formOptions = document.getElementsByName('options');
		for(i = 0; i < formOptions.length; i++) {
			if(formOptions[i].checked) {
				isc_options = formOptions[i].value;
			}
		}
		isc_address = encodeURIComponent(document.getElementById("address").value);
		year = document.getElementById("date").value.substring(0,4);
		month = document.getElementById("date").value.substring(5,7);
		day = document.getElementById("date").value.substring(8,11);
		hours = document.getElementById("time").value.substring(0,2);
		minutes = document.getElementById("time").value.substring(3,5);
		datum = new Date(Date.UTC(year,month-1,day,hours,minutes,"0"));
		isc_timestamp = datum.getTime()/1000;
		baseURL = "https://p2oeyph6oi.execute-api.us-east-2.amazonaws.com/prod/sightingspost"
		const postData = JSON.stringify({
			"isc_date" : document.getElementById("date").value,
			"isc_time" : document.getElementById("time").value,
			"isc_lat" : document.getElementById("lat").value,
			"isc_long" : document.getElementById("long").value,
			"isc_notes" : isc_notes,
			"isc_options" : isc_options,
			"isc_filename" : isc_filename,
			"isc_filetype" : isc_filetype,
			"isc_address" : isc_address,
			"isc_postalcode" : document.getElementById("postalcode").value,
			"isc_timestamp" : isc_timestamp
		});
		document.getElementById("reportform").style.display = "none";
		document.getElementById("reportsuccess").style.display = "block";
		var settings = {
			"url": apiURL + "sightingspost",
			"method": "POST",
			"headers": apiHeaders,
			"contentType": "application/json",
			"data": postData,
			"dataType": "json"
		}
		$.ajax(settings).done(function (response) {
			if(isc_file != '') {
				settings = {
					type: 'PUT',
					url: response.data,
					processData: false,
					contentType: isc_filetype,
					data: isc_file,
					success: function(json) { },
					Error function (XMLHttpRequest, textStatus, errorThrown) {	}
				}
				$.ajax(settings).done(function (response) { });
			}
		});
	}
}

function geocodePosition(pos) {
	geocoder.geocode({latLng: pos}, function(responses) {
		if (responses && responses.length > 0) {
			document.getElementById("address").value = responses[0].formatted_address;
			for(let component of responses[0].address_components) {
				if(component.types[0] == "postal_code") {
					document.getElementById("postalcode").value = component.long_name;
				}
			}
		} else {
			document.getElementById("address").value = 'Unknown';
			document.getElementById("postalcode").value = 'Unknown';
		}
	});
}

function initMapReport() {
	geocoder = new google.maps.Geocoder();
	var today = new Date();
	var time = (today.getHours() < 10 ? '0' : '') + today.getHours()  + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
	document.getElementById("date").valueAsDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
	document.getElementById("time").value = time;
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.50, lng: -98.35},
		zoom: 18,
		mapTypeControl: false,
		streetViewControl: false
	});
	infoWindow = new google.maps.InfoWindow;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				document.getElementById("lat").value = pos.lat;
				document.getElementById("long").value = pos.lng;
				geocodePosition(pos);

				var marker = new google.maps.Marker({
					position: pos,
					map: map,
					draggable:true,
					title:"Drag me!"
				});

				google.maps.event.addListener(marker,'dragend',function(event) {
					document.getElementById("lat").value = this.getPosition().lat();
					document.getElementById("long").value = this.getPosition().lng();
					geocodePosition(marker.getPosition());
				});

				map.setCenter(pos);
			},

			function() {
				handleLocationError(true, infoWindow, map.getCenter());
			});
	} else {
		//Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
	'Error The Geolocation service failed.' :
	'Error Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

/******************************************************************************
view.html
******************************************************************************/
function viewNext() {
	var divContent = "";

	const postData = JSON.stringify({
			"isc_key1" : pageArr[pageNumber][0],
			"isc_key2" : pageArr[pageNumber][1],
			"isc_key3" : pageArr[pageNumber][2]
	});
	var settings = {
		"url": apiURL + "sightingsgetlist",
		"method": "POST",
		"headers": apiHeaders,
		"contentType": "application/json",
		"data": postData,
		"dataType": "json"
	}
	$.ajax(settings).done(function (response) {
		pageNumber ++;
		if (response.Key != null) {
			if (pageArr[pageNumber] == null) {
				pageArr.push([response.Key.isc_sort,response.Key.isc_timestamp,response.Key.sightingid]);
			}
			response.Items.forEach(function(value, index) {
				lat = value.isc_lat;
				long = value.isc_long;
				year = value.isc_date.substring(0,4);
				month = value.isc_date.substring(5,7);
				day = value.isc_date.substring(8,11);
				date = month + '-' + day + '-' + year;
				hours = value.isc_time.substring(0,2);
				minutes = value.isc_time.substring(3,5);
				suffix = (hours >= 12)? 'pm' : 'am';
				hours = (hours > 12)? hours -12 : hours;
				hours = (hours == '00')? 12 : hours;
				time = hours + ":" + minutes + " " + suffix;
				if (value.isc_images != "none") {
					var images = "<img width='100%' src='" + siteURL + "/assets/" + value.sightingid + "_01." + value.isc_images + "' />";
				}
				switch(value.isc_options) {
					case 'Cougar':
						optionImage = "mapicon2.png";
						break;
					default:
						optionImage = 'mapicon.png';
				}
				divContent = divContent + "<h4>" + value.isc_options + " <img src='" + siteURL + "/img/" + optionImage + "' /></h4>";
				divContent = divContent + "<p>" + date + " at " + time + "<br />";
				divContent = divContent + value.isc_address + "<br />";
				if (value.isc_notes) {
					divContent = divContent + value.isc_notes + "<br />";
				}
				if (value.isc_images != "none") {
					divContent = divContent + images;
				}
			});

			if (pageNumber >= 1) {
				document.getElementById('viewPrev').style.visibility = "visible";
			}
		}
		if (response.Key == null) {
			document.getElementById('viewNext').style.visibility = "hidden";
			viewPrev(1);
		}
		document.getElementById("divContent").innerHTML = divContent;
	});
}

function viewPrev(hideNext) {
	var divContent = "";

	if (pageNumber == 1) {
		viewDefault();
		return;
	}

	const postData = JSON.stringify({
			"isc_key1" : pageArr[pageNumber-2][0],
			"isc_key2" : pageArr[pageNumber-2][1],
			"isc_key3" : pageArr[pageNumber-2][2]
	});
	var settings = {
		"url": apiURL + "sightingsgetlist",
		"method": "POST",
		"headers": apiHeaders,
		"contentType": "application/json",
		"data": postData,
		"dataType": "json"
	}
	$.ajax(settings).done(function (response) {
		pageNumber = pageNumber - 1;
		if (response.Key != null) {
			response.Items.forEach(function(value, index) {
				lat = value.isc_lat;
				long = value.isc_long;
				year = value.isc_date.substring(0,4);
				month = value.isc_date.substring(5,7);
				day = value.isc_date.substring(8,11);
				date = month + '-' + day + '-' + year;
				hours = value.isc_time.substring(0,2);
				minutes = value.isc_time.substring(3,5);
				suffix = (hours >= 12)? 'pm' : 'am';
				hours = (hours > 12)? hours -12 : hours;
				hours = (hours == '00')? 12 : hours;
				time = hours + ":" + minutes + " " + suffix;
				if (value.isc_images != "none") {
					var images = "<img width='100%' src='" + siteURL + "/assets/" + value.sightingid + "_01." + value.isc_images + "' />";
				}
				switch(value.isc_options) {
					case 'Cougar':
						optionImage = "mapicon2.png";
						break;
					default:
						optionImage = 'mapicon.png';
				}
				divContent = divContent + "<h4>" + value.isc_options + " <img src='" + siteURL + "/img/" + optionImage + "' /></h4>";
				divContent = divContent + "<p>" + date + " at " + time + "<br />";
				divContent = divContent + value.isc_address + "<br />";
				if (value.isc_notes) {
					divContent = divContent + value.isc_notes + "<br />";
				}
				if (value.isc_images != "none") {
					divContent = divContent + images;
				}
			});

			if (pageNumber > 1) {
				document.getElementById('viewPrev').style.visibility = "visible";
			}
			if (hideNext != 1) {
				document.getElementById('viewNext').style.visibility = "visible";;
			}
			document.getElementById("divContent").innerHTML = divContent;
		}
	});
}

function viewDefault() {
	pageNumber = 0;
	var divContent = "";

	var settings = {
		"url": apiURL + "sightingsgetlist",
		"method": "POST",
		"headers": apiHeaders
	}
	$.ajax(settings).done(function (response) {
		if (response.Key != null) {
			if (pageArr[pageNumber] == null) {
				pageArr.push([response.Key.isc_sort,response.Key.isc_timestamp,response.Key.sightingid]);
			}
		}
		response.Items.forEach(function(value, index) {
			lat = value.isc_lat;
			long = value.isc_long;
			year = value.isc_date.substring(0,4);
			month = value.isc_date.substring(5,7);
			day = value.isc_date.substring(8,11);
			date = month + '-' + day + '-' + year;
			hours = value.isc_time.substring(0,2);
			minutes = value.isc_time.substring(3,5);
			suffix = (hours >= 12)? 'pm' : 'am';
			hours = (hours > 12)? hours -12 : hours;
			hours = (hours == '00')? 12 : hours;
			time = hours + ":" + minutes + " " + suffix;
			if (value.isc_images != "none") {
				var images = "<img width='100%' src='" + siteURL + "/assets/" + value.sightingid + "_01." + value.isc_images + "' />";
			}
			switch(value.isc_options) {
				case 'Cougar':
					optionImage = "mapicon2.png";
					break;
				default:
					optionImage = 'mapicon.png';
			}
			divContent = divContent + "<h4>" + value.isc_options + " <img src='" + siteURL + "/img/" + optionImage + "' /></h4>";
			divContent = divContent + "<p>" + date + " at " + time + "<br />";
			divContent = divContent + value.isc_address + "<br />";
			if (value.isc_notes) {
				divContent = divContent + value.isc_notes + "<br />";
			}
			if (value.isc_images != "none") {
				divContent = divContent + images;
			}
		});
		if (pageNumber == 0) {
			document.getElementById('viewPrev').style.visibility = "hidden";
		}
		if (response.Key == null) {
			document.getElementById('viewNext').style.visibility = "hidden";
		}
		document.getElementById("divContent").innerHTML = divContent;
	});
}
/******************************************************************************
fsmode.html
******************************************************************************/
function initMapFSMode() {
	var image;
	var markers = [];
	var settings = {
		"url": apiURL + "sightingsget",
		"method": "POST",
		"headers": apiHeaders
	}
	$.ajax(settings).done(function (response) {
		response.Items.forEach(function(value) {
			var lat = value.isc_lat;
			var long = value.isc_long;
			var date = new Date(value.isc_date);
			date = date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
			hours = value.isc_time.substring(0,2);
			minutes = value.isc_time.substring(3,5);
			suffix = (hours >= 12)? 'pm' : 'am';
			hours = (hours > 12)? hours -12 : hours;
			hours = (hours == '00')? 12 : hours;
			time = hours + ":" + minutes + " " + suffix;
			if (value.isc_images != "none") {
				var infotext = "<a href='view.html'>" + date + " " + time + "</a><br /><br />" + value.isc_notes + "<br /><br /><img width='100px' src='" + siteURL + "/assets/" + value.sightingid + "_01." + value.isc_images + "' />";
			} else {
				var infotext = "<a href='view.html'>" + date + " " + time + "</a><br /><br />" + value.isc_notes;
			}
			switch(value.isc_options) {
				case 'Coyote':
					image = 'img/mapicon.png';
					break;
				case 'Cougar':
					image = "img/mapicon2.png";
					break;
				default:
					image = 'img/mapicon.png';
			}
			var latLng = new google.maps.LatLng(
				lat,
				long
			);
			var marker = new google.maps.Marker({
				position: latLng,
				icon: image
			});
			var infowindow = new google.maps.InfoWindow({
				content: infotext
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
			markers.push(marker);
		})
		var markerCluster = new MarkerClusterer(map, markers);
	});
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.67897950734105, lng: -96.89238409999999},
		zoom: 5,
		gestureHandling: 'greedy',
		mapTypeControl: false,
		streetViewControl: false,
		fullscreenControl: false,
		mapTypeId: "terrain"
	});
}

/******************************************************************************
email.html
******************************************************************************/
function emailReadQuery() {
	var urlParams = new URLSearchParams(window.location.search);
	var postData = "";
	if(urlParams.has("a") == true ) {
		switch(urlParams.get("a")) {
			case "c":
				var baseURL = apiURL + "confirmationget";
				postData = JSON.stringify({
					"isc_confirmationid" : urlParams.get("id")
				});
				var settings = {
					"url": baseURL,
					"method": "POST",
					"headers": apiHeaders,
					"contentType": "application/json",
					"data": postData,
					"dataType": "json"
				}
				$.ajax(settings).done(function (response) {
					if(Array.isArray(response.Items) && response.Items.length) {
						var email = response.Items[0].isc_email;
						var postalcode = response.Items[0].isc_postalcode;
						var confirmid = response.Items[0].confirmationid;
						var confirmationInfo = email + "<br />" + postalcode;
						document.getElementById("txtHeader").innerHTML = "Confirm Email Notification";
						document.getElementById("emailConfirmationInfo").innerHTML = confirmationInfo;
						document.getElementById("emailConfirmationID").value = confirmid;
						document.getElementById("emailConfirmationEmail").value = email;
						document.getElementById("emailConfirmationPostalcode").value = postalcode;
						document.getElementById("emailConfirmation").style.display = "block";
					} else {
						document.getElementById("txtHeader").innerHTML = "Confirm Email Notification";
						document.getElementById("emailConfirmationInfo").innerHTML = "This confirmation number has already been used or has expired, please register again.<br /><a href='email.html?a=n'>Click here</a>";
						document.getElementById("emailConfirmationQuestion").innerHTML = "";
						document.getElementById("emailConfirmationForm").style.display = "none";
						document.getElementById("emailConfirmation").style.display = "block";
					}
				});
				break;
			case "n":
				document.getElementById("txtHeader").innerHTML = "Sign Up For Email Notifications";
				document.getElementById("emailNotifications").style.display = "block";
			break;
			case "d":
				var baseURL = apiURL + "notificationget";
				postData = JSON.stringify({
					"isc_notificationid" : urlParams.get("id")
				});
				var settings = {
					"url": baseURL,
					"method": "POST",
					"headers": apiHeaders,
					"contentType": "application/json",
					"data": postData,
					"dataType": "json"
				}
				$.ajax(settings).done(function (response) {
					if(Array.isArray(response.Items) && response.Items.length) {
						var email = response.Items[0].isc_email;
						var postalcode = response.Items[0].isc_postalcode;
						var notificationid = response.Items[0].notificationid;
						var confirmationInfo = email + "<br />" + postalcode;
						document.getElementById("txtHeader").innerHTML = "Stop Recieving Email Notifications";
						document.getElementById("emailDiscontinueInfo").innerHTML = confirmationInfo;
						document.getElementById("emailDiscontinueID").value = notificationid;
						document.getElementById("emailDiscontinue").style.display = "block";
					} else {
						document.getElementById("txtHeader").innerHTML = "Stop Recieving Email Notifications";
						document.getElementById("emailDiscontinueQuestion").innerHTML = "This notifcation has already been discontinued, please register again.<br /><a href='email.html?a=n'>Click here</a>";
						document.getElementById("emailDiscontinueInfo").innerHTML = "";
						document.getElementById("emailDiscontinueForm").style.display = "none";
						document.getElementById("emailDiscontinue").style.display = "block";
					}
				});
			default:
		}
	} else {
		document.getElementById("txtHeader").innerHTML = "Comments";
		document.getElementById("emailComments").style.display = "block";
	}
	widgetComments = grecaptcha.render(document.getElementById('recaptchaComments'), {'sitekey' : '6Lf1_eEUAAAAAM26kWVVch5woewrXjAeNDzQLINW'});
    widgetNotifications = grecaptcha.render(document.getElementById('recaptchaNotifications'), {'sitekey' : '6Lf1_eEUAAAAAM26kWVVch5woewrXjAeNDzQLINW'});
}
function emailConfirmationYesFunc() {
	var baseURL = apiURL + "confirmationtonotification";
	const postData = JSON.stringify({
		"isc_confirmationid" : document.getElementById("emailConfirmationID").value,
		"isc_email" : document.getElementById("emailConfirmationEmail").value,
		"isc_postalcode" : document.getElementById("emailConfirmationPostalcode").value
	});
	var settings = {
		"url": baseURL,
		"method": "POST",
		"headers": apiHeaders,
		"contentType": "application/json",
		"data": postData,
		"dataType": "json"
	}
	document.getElementById("emailConfirmationQuestion").innerHTML = "";
	document.getElementById("emailConfirmationInfo").innerHTML = "Your email address has been confirmed. You will now be notified about sightings in " + document.getElementById("emailConfirmationPostalcode").value;
	document.getElementById("emailConfirmationForm").style.display = "none";
	$.ajax(settings).done(function (response) { });
}
function emailConfirmationNoFunc(inputValue) {
	var baseURL = apiURL + "confirmationremove";
	const postData = JSON.stringify({
		"isc_confirmationid" : document.getElementById("emailConfirmationID").value
	});
	var settings = {
		"url": baseURL,
		"method": "POST",
		"headers": apiHeaders,
		"contentType": "application/json",
		"data": postData,
		"dataType": "json"
	}
	document.getElementById("emailConfirmationQuestion").innerHTML = "";
	document.getElementById("emailConfirmationInfo").innerHTML = "This notification request has been cancelled.<br />To register a different email or postal code please register again.<br /><a href='email.html?a=n'>Click here</a>";
	document.getElementById("emailConfirmationForm").style.display = "none";
	$.ajax(settings).done(function (response) { });
}

function cancel() {
	window.location.href = "index.html";
}

function emailNotificationsSubmitFunc() {
	var baseURL = apiURL + "confirmationpost";
	var emailvalid = validateEmail(document.getElementById("emailNotificationsEmail").value);
	var postalcodevalid = validatePostalcode(document.getElementById("emailNotificationsPostalcode").value);
	var recaptchavalid = validateReCaptcha("emailNotificationsWarning",widgetNotifications);
	if(emailvalid == true) {
		document.getElementById("emailNotificationsEmail").className = "form-control is-valid";
	}
	if(emailvalid == false) {
		document.getElementById("emailNotificationsEmail").className = "form-control is-invalid";
	}
	if(postalcodevalid == true) {
		document.getElementById("emailNotificationsPostalcode").className = "form-control is-valid";
	}
	if(postalcodevalid == false) {
		document.getElementById("emailNotificationsPostalcode").className = "form-control is-invalid";
	}
	if(emailvalid == true && postalcodevalid == true && recaptchavalid == true) {
		var baseURL = apiURL + "confirmationpost";
		var iscInnerHTML = "<p>Your sign up request has been initiated.<br />An email has been sent with a URL that needs to be followed to confirm your notifcation preferences.</p>";
		iscInnerHTML = iscInnerHTML + "<p><i>Verification must be completed within 48 hours</i></p>";
		document.getElementById("emailNotificationsForm").style.display = "none"
		document.getElementById("emailNotificationsPara").innerHTML = iscInnerHTML;
		const postData = JSON.stringify({
			"isc_email" : document.getElementById("emailNotificationsEmail").value,
			"isc_postalcode" : document.getElementById("emailNotificationsPostalcode").value
		});

		var settings = {
			"url": baseURL,
			"method": "POST",
			"headers": apiHeaders,
			"contentType": "application/json",
			"data": postData,
			"dataType": "json"
		}
		$.ajax(settings).done(function (response) { });
	}
}

function emailDiscontinueYesFunc() {
	var baseURL = apiURL + "notificationremove";
	const postData = JSON.stringify({
		"isc_notificationid" : document.getElementById("emailDiscontinueID").value
	});
	var settings = {
		"url": baseURL,
		"method": "POST",
		"headers": apiHeaders,
		"contentType": "application/json",
		"data": postData,
		"dataType": "json"
	}

	document.getElementById("emailDiscontinueQuestion").innerHTML = "";
	document.getElementById("emailDiscontinueInfo").innerHTML = "Your notifications have been discontinued.<br /><br />To register again <a href='email.html?a=n'>click here</a>";
	document.getElementById("emailDiscontinueForm").style.display = "none";
	$.ajax(settings).done(function (response) { });
}

function emailCommentsSubmitFunc() {
	var commentsvalid = validatePostalcode(document.getElementById("emailCommentsText").value);
	var recaptchavalid = validateReCaptcha("emailCommentsWarning",widgetComments);
	if(commentsvalid == true) {
		document.getElementById("emailCommentsText").className = "form-control is-valid";
	}
	if(commentsvalid == false) {
		document.getElementById("emailCommentsText").className = "form-control is-invalid";
	}
	if(commentsvalid == true && recaptchavalid == true) {
		var baseURL = apiURL + "commentpost";
		const postData = JSON.stringify({
			"isc_comment" : document.getElementById("emailCommentsText").value
		});
		var settings = {
			"url": baseURL,
			"method": "POST",
			"headers": apiHeaders,
			"contentType": "application/json",
			"data": postData,
			"dataType": "json"
		}
		$.ajax(settings).done(function (response) { });
		document.getElementById("emailCommentsForm").style.display = "none";
		document.getElementById("emailCommentsPara").innerHTML = "<p>Your comments have been sent to our team for review.</p>";
	}
}
