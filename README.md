Weather Dashboard.

Overview
The Weather Dashboard is an interactive and fully functional web application that allows users to search for and view current weather conditions and forecasts. It offers an intuitive interface with modern features such as location-based data retrieval, dynamic rendering using Angular signals, and a responsive design that works seamlessly across desktop and mobile devices.

This project meets all the specified requirements and is ready for use. It is deployed on Vercel with server-side rendering (SSR) enabled.


Live Demo
You can view the live demo of the Weather Dashboard: https://weather-app-alpha-lyart-75.vercel.app


Key Features:

Location Search: Users can search for weather information by entering a city or zip code (Only US, as weatherapi.com provides zip-code search only for US). The search functionality includes autocomplete suggestions powered by the Google Maps API.

Current Weather Display: The dashboard displays current weather data, including temperature, wind speed, humidity, precipitation, and pressure for the user's location or a searched location.

14-Day Weather Forecast: Provides a 14-day forecast with detailed weather data for each day. This data includes temperature, wind speed, and humidity, accessible through paginated material tabs.

Hourly Weather Data: Detailed hourly weather data for a selected date from the 14-day forecast, also displayed in paginated material tabs.

Responsive Design: The dashboard is designed to work well on both desktop and mobile devices.

Theme and Unit Toggle: Users can toggle between dark and light themes and switch between Celsius and Fahrenheit units.


Technology Stack:

Framework: Angular v17

API: WeatherAPI (WeatherAPI.com)

Styling: SCSS

CSS Framework: Bootstrap

Component Library: Angular Material v17

Application Architecture
The Weather Dashboard is built using Angular 17 with a focus on modern development practices:

Standalone Components: All components are implemented as standalone, promoting a modular and decoupled architecture.

Signals: The application leverages Angular's signal-based reactivity model for dynamic data binding and efficient state management.

Server-Side Rendering (SSR): The app is deployed on Vercel with SSR enabled, ensuring faster load times and improved performance.

Bootstrap: For Responsiveness.
Material Design: The UI is built using Angular Material components, ensuring a consistent and accessible user experience.

UI Components
Top Toolbar:

Features a logo, a search input with autocomplete functionality, and toggle buttons for temperature units (Celsius/Fahrenheit) and theme switching (Dark/Light mode).
The location search utilizes Google Maps API for accurate location suggestions.
Major Cities Weather Overview:

A material card displaying the current temperature and weather conditions for major cities in India. Data is displayed in Material chips.
Current Day Weather:

Displays the current weather data for the user's geolocation or a searched location. Includes detailed information on temperature, wind speed, humidity, precipitation, and pressure.
14-Day Forecast:

A material card with paginated tabs displaying the 14-day weather forecast. Each tab shows detailed weather information, including temperature and wind speed.
Hourly Forecast:

A material card with paginated tabs showing hourly weather data for a selected day from the 14-day forecast. Includes all relevant weather metrics.

How to Set Up and Run the Project:

Make sure you have:

 Installed node v20+

 Installed Angular v17+ globally

 Installed npm v8+


Clone the Repository:

git clone https://github.com/akroidankur/WeatherApp.git

Navigate to the Project Directory:
cd weather-dashboard

Install Dependencies:
npm install or npm i

Obtain a WeatherAPI Key:
Sign up at WeatherAPI.com to obtain a free API key.

Configure Environment Variables:
Replace API keys and Base URLs as per requirements in src/environments/*:

PRODUCTION: true,

ENVIRONMENT_TYPE: 'prod',

API_KEY: 'your_api_key',

API_BASE_URL: 'https://api.weatherapi.com/v1'

Run the Application:
npm run start:dev

Access the Application:
Open your browser and navigate to http://localhost:4200.

Build the Application:
npm run build:prod

Test SSR in Local:
npm run serve:ssr

Deployment
The application is deployed on Vercel with SSR enabled. The deployment process includes setting up environment variables on Vercel for the WeatherAPI and Google Maps API keys.

License
This project is licensed under the MIT License.