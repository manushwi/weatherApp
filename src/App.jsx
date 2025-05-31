import { useState, useEffect } from 'react';

function App() {
  const today = new Date();
  const dateOnly = today.toDateString();
  const [city, setCity] = useState("Ghaziabad")
  const [state, setState] = useState("Uttar Pradesh")
  const [country, setCountry] = useState("India")
  const [data, setData] = useState({})
  const [error, setError] = useState("")

  const fetchWeatherData = async (cityName, stateName, countryName) => {
    
    setError("")
    try {
      const response = await fetch(`https://api.airvisual.com/v2/city?city=${encodeURIComponent(cityName)}&state=${encodeURIComponent(stateName)}&country=${encodeURIComponent(countryName)}&key=47491c3e-812b-4d0a-a60f-85fee30ed94c`)
      const result = await response.json()
      
      if (response.ok && result.status === "success") {
        setData(result.data)
      } else {
        setError(result.data?.message || "Failed to fetch weather data")
      }
    } catch (err) {
      setError("Network error - please check your connection")
    } finally {
      
    }
  }

  useEffect(() => {
    fetchWeatherData(city, state, country)
  }, [])

  const handleSubmit = () => {
    if (city.trim() && state.trim() && country.trim()) {
      fetchWeatherData(city, state, country)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  // Get weather data safely
  const weather = data.current?.weather || {}
  const pollution = data.current?.pollution || {}
  const location = data.location || {}
  
  const temperature = weather.tp || "--"
  const humidity = weather.hu || "--"
  const windSpeed = weather.ws || "--"
  const windDirection = weather.wd || "--"

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="rounded-xl border border-gray-700 p-6 w-full max-w-4xl shadow-lg space-y-4">
        {/* Location input and submit button */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="City"
            className="flex-1 p-2 rounded-md bg-gray-100 text-black focus:outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-md bg-gray-100 text-black focus:outline-none"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-md bg-gray-100 text-black focus:outline-none"
          />
          <button 
            onClick={handleSubmit}
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
          >
            Submit
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-800 border border-red-600 rounded-md p-3 text-red-200">
            {error}
          </div>
        )}

        {/* Weather card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10">
            {/* <div className="text-lg mb-2">
              {location.city ? `${location.city}, ${location.state}, ${location.country}` : "Location"}
            </div> */}
            <div className="text-sm mb-4">Today, {dateOnly}</div>
            <div className="text-6xl font-bold mb-2">
              {temperature}°C
            </div>
            {pollution.aqius && (
              <div className="text-sm">
                Air Quality Index: {pollution.aqius}
              </div>
            )}
          </div>
        </div>

        {/* Additional info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-800 rounded-md p-4">
            <div className="font-semibold text-gray-300">Humidity</div>
            <div className="text-xl">{humidity}%</div>
          </div>
          <div className="bg-gray-800 rounded-md p-4">
            <div className="font-semibold text-gray-300">Wind Speed</div>
            <div className="text-xl">{windSpeed} m/s</div>
          </div>
          <div className="bg-gray-800 rounded-md p-4">
            <div className="font-semibold text-gray-300">Wind Direction</div>
            <div className="text-xl">{windDirection}°</div>
          </div>
          <div className="bg-gray-800 rounded-md p-4">
            <div className="font-semibold text-gray-300">Air Quality</div>
            <div className="text-xl">
              {pollution.aqius ? (
                <span className={
                  pollution.aqius <= 50 ? "text-green-400" :
                  pollution.aqius <= 100 ? "text-yellow-400" :
                  pollution.aqius <= 150 ? "text-orange-400" : "text-red-400"
                }>
                  {pollution.aqius}
                </span>
              ) : "--"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;