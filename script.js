var map = L.map('map').setView([51.505, -0.09], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '© OpenStreetMap contributors',
}).addTo(map);

var marker;

function findCity() {
	var city = document.getElementById('city-input').value;
	if (city) {
		fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`)
			.then((response) => response.json())
			.then((data) => {
				if (data.length > 0) {
					var lat = data[0].lat;
					var lon = data[0].lon;

					map.setView([lat, lon], 10);

					if (marker) {
						map.removeLayer(marker);
					}

					marker = L.marker([lat, lon])
						.addTo(map)
						.bindPopup(`<b>${city}</b>`)
						.openPopup();

					// Call the weather API
					fetchWeather(lat, lon, city);
				} else {
					alert('City not found. Please try again.');
				}
			})
			.catch((error) => {
				alert('Error fetching city coordinates:', error);
			});
	} else {
		alert('Please enter a city name.');
	}
}

function fetchWeather(lat, lon, city) {
	var apiKey = '8dad3db309e50de33c8cdefbe69cec74'; // Replace with your OpenWeatherMap API key
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
	)
		.then((response) => response.json())
		.then((data) => {
			var weatherDesc = data.weather[0].description;
			var temp = data.main.temp;

			document.getElementById('weather-info').innerHTML = `
                       <div> <strong>City:</strong> ${city} </div>
                      <div>  <strong>Weather:</strong> ${weatherDesc} </div>
                       <div> <strong>Temperature:</strong> ${temp}°C </div>
                       
                    `;
		})
		.catch((error) => {
			console.error('Error fetching weather data:', error);
		});
}
