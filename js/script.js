
document.addEventListener("DOMContentLoaded", function(event) { 

	var mainDivForHomes = document.getElementsByClassName('wrapper')[0];
	function ConstructorForHomes(_city, _region, _address, _type, _price, _rooms, _floors, _land_area, _total_area, _living_space, _lat, _lng, _img, _owner, _contacts, _description) {
		this.city = _city;
		this.region = _region;
		this.address = _address;
		this.type = _type;
		this.price = _price;
		this.rooms = _rooms;
		this.floors = _floors;
		this.land_area = _land_area;
		this.total_area = _total_area;
		this.living_space = _living_space;
		this.lat = _lat;
		this.lng = _lng;
		this.img = _img;
		this.owner = _owner;
		this.contacts = _contacts;
		this.description = _description;
	}

	ConstructorForHomes.prototype.render = function() {
		var wrap = document.createElement('div');
		wrap.setAttribute("class", "homes__wrap");

		var getMap = document.createElement('a');
		getMap.setAttribute('class', 'geo');
		getMap.setAttribute('href', 'geo.html');
		getMap.textContent = 'Посмотреть на карте';

		var city = document.createElement('span');
		city.innerHTML = '<b>Город:</b> ' + this.city;
		
		var region = document.createElement('span');
		region.innerHTML = '<b>Область:</b> ' + this.region;

		var address = document.createElement('span');
		address.innerHTML = '<b>Адрес:</b> ' + this.address;
		
		var type = document.createElement('span');
		type.innerHTML = '<b>Тип:</b> ' + this.type;
		
		var price = document.createElement('span');
		price.innerHTML = '<b>Цена:</b> ' + this.price + '$';
		
		var rooms = document.createElement('span');
		rooms.innerHTML = '<b>Комнат:</b> ' + this.rooms;
		
		var floors = document.createElement('span');
		floors.innerHTML = '<b>Этажей:</b> ' + this.floors;

		var land_area = document.createElement('span');
		land_area.innerHTML = '<b>Участок:</b> ' + this.land_area + ' соток';
		
		var total_area = document.createElement('span');
		total_area.innerHTML = '<b>Общая площадь:</b> ' + this.total_area + ' м2';
		
		var living_space = document.createElement('span');
		living_space.innerHTML = '<b>Жилая площадь:</b> ' + this.living_space + ' м2';

		var lat = document.createElement('span');
		lat.textContent = this.lat;
		lat.setAttribute("class", "homes__lat");
		
		var lng = document.createElement('span');
		lng.textContent = this.lng;
		lng.setAttribute("class", "homes__lng");
		
		var img = document.createElement('img');
		img.setAttribute("class", "homes__image");
		img.setAttribute('src', 'data:image/jpg;base64,' + this.img);

		var owner = document.createElement('span');
		owner.innerHTML = '<b>Собственник:</b> ' + this.owner;
		
		var contacts = document.createElement('span');
		contacts.innerHTML = '<b>Контакты:</b> ' + this.contacts;
		
		var description = document.createElement('p');
		description.innerHTML = '<b>Описание:</b> ' + this.description;

		wrap.appendChild(getMap);
		wrap.appendChild(img);
		wrap.appendChild(city);
		wrap.appendChild(region);
		wrap.appendChild(address);
		wrap.appendChild(type);
		wrap.appendChild(price);
		wrap.appendChild(rooms);
		wrap.appendChild(floors);
		wrap.appendChild(land_area);
		wrap.appendChild(total_area);
		wrap.appendChild(living_space);
		wrap.appendChild(lat);
		wrap.appendChild(lng);
		wrap.appendChild(owner);
		wrap.appendChild(contacts);
		wrap.appendChild(description);

		return wrap
	}

// _______________________________________________________________________________________

var transparency = document.getElementsByClassName('transparency')[0];
var closeMap = document.getElementsByClassName('closeMap')[0];
closeMap.addEventListener('click', function(){
	transparency.style.cssText = 'display: none;';
	document.body.style.cssText = 'overflow: none;';
});

function find() {

	mainDivForHomes.innerHTML = '';
	var homes = [];
	var home = [];

	function reqListener() {
		var obj = JSON.parse(this.responseText);
		var str = '';    
		for(var i = 0; i < obj.length; i++) {
			var arr = [ obj[i]['city'], obj[i]['region'], obj[i]['address'], obj[i]['type'], obj[i]['price'], obj[i]['rooms'], obj[i]['floors'], obj[i]['land_area'], obj[i]['total_area'], obj[i]['living_space'], obj[i]['lat'], obj[i]['lng'], obj[i]['data'], obj[i]['owner'], obj[i]['contacts'], obj[i]['description']];
			homes.push(arr);
		}

		for(var i = 0; i < homes.length; i++) {
			home.push( new ConstructorForHomes( homes[i][0],  homes[i][1], homes[i][2], homes[i][3],  homes[i][4], homes[i][5], homes[i][6],  homes[i][7], homes[i][8], homes[i][9],  homes[i][10], homes[i][11], homes[i][12],  homes[i][13], homes[i][14], homes[i][15]) );
		};

		for(var i = 0; i < home.length; i++) {
			mainDivForHomes.appendChild( home[i].render() );
		};

		var getMapLinks = document.getElementsByClassName('geo');
		for(var i = 0; i < getMapLinks.length; i++) {
			getMapLinks[i].addEventListener('click', function(event) {
				event.preventDefault();
				var parElem = this.parentElement;
				var expLat = '';
				var expLng = '';
				for(var j = 0; j < parElem.children.length; j++) {
					if(parElem.children[j].getAttribute('class') === 'homes__lat'){
						expLat = parElem.children[j].textContent;
					}
					if(parElem.children[j].getAttribute('class') === 'homes__lng'){
						expLng = parElem.children[j].textContent;
					}
				}
					// console.log(expLat + ' x ' + expLng);
					initMap(expLat, expLng);
					transparency.style.cssText = 'display: block;';
					document.body.style.cssText = 'overflow: hidden;';
				});
		}

	}

	function reqError(error) {
		console.log(error);
	}

	var searchStr = document.getElementsByClassName('fix__inputText')[0];
	var address = 'https://secure-waters-60346.herokuapp.com/api/posts/homes?city=' + searchStr.value;
	var oReq = new XMLHttpRequest();
	oReq.onload = reqListener;
	oReq.onerror = reqError;
	oReq.open('get', address, true);
	oReq.send();
}

var btn = document.getElementsByClassName('fix__link')[0];
btn.addEventListener('click', find);

function initMap(_lat, _lng) {
	var pos = {lat: +_lat, lng: +_lng};
	var map = new google.maps.Map(document.getElementById('map'), {
		center: pos,
		zoom: 16
	});
	var infoWindow = new google.maps.InfoWindow({map: map});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				title: 'Hello World!'
			});
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}

});