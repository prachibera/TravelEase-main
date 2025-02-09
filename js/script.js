document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.getElementById('home-link');
    const hotelBookingsLink = document.getElementById('hotel-bookings');
    const roadmapLink = document.getElementById('roadmap');
    const homeSection = document.getElementById('home-section');
    const hotelSection = document.getElementById('hotel-booking-section');
    const roadmapSection = document.getElementById('roadmap-section');

    const searchHotelsBtn = document.getElementById('search-hotels');
    const hotelResults = document.getElementById('hotel-results');

    const trainBtn = document.getElementById('train-btn');
    const busBtn = document.getElementById('bus-btn');
    const carBtn = document.getElementById('car-btn');
    const viewRoadmapBtn = document.getElementById('view-roadmap');
    const roadmapOutput = document.getElementById('roadmap-output');

    let travelMedium = '';  // Initialize as empty string

    // Navigation controls
    hotelBookingsLink.addEventListener('click', () => {
        homeSection.classList.add('hidden');
        roadmapSection.classList.add('hidden');
        hotelSection.classList.remove('hidden');
    });

    roadmapLink.addEventListener('click', () => {
        homeSection.classList.add('hidden');
        hotelSection.classList.add('hidden');
        roadmapSection.classList.remove('hidden');
    });

    homeLink.addEventListener('click', () => {
        hotelSection.classList.add('hidden');
        roadmapSection.classList.add('hidden');
        homeSection.classList.remove('hidden');
        roadmapOutput.classList.add('hidden');
        hotelResults.innerHTML = '';
    });

    // Sample hotel data
    const hotels = [
        { name: "Hotel Sunshine", location: "digha", rating: 4.5, price: 2500, persons: 2, amenities: ["Swimming Pool", "AC Room", "Restaurant"] },
        { name: "Sea View Resort", location: "digha", rating: 4.0, price: 3000, persons: 3, amenities: ["Swimming Pool", "Garden", "Restaurant", "AC Room"] },
        { name: "City Inn", location: "digha", rating: 3.8, price: 1500, persons: 2, amenities: ["AC Room", "Non-AC Room"] },
        { name: "Luxury Stay", location: "digha", rating: 5.0, price: 4500, persons: 4, amenities: ["Swimming Pool", "Garden", "Restaurant", "AC Room"] },
        { name: "Royal Palace", location: "digha", rating: 1.0, price: 500, persons: 4, amenities: ["Swimming Pool", "Garden", "Restaurant", "AC Room"] },
        { name: "Piku;s Inn", location: "digha", rating: 2.0, price: 4100, persons: 4, amenities: ["Swimming Pool", "Garden", "Restaurant", "AC Room"] },
    ];

    // Handle hotel search
    searchHotelsBtn.addEventListener('click', () => {
        const location = document.getElementById('hotel-location').value.toLowerCase();
        const rating = parseFloat(document.getElementById('hotel-rating').value);
        const price = parseFloat(document.getElementById('hotel-price').value);
        const persons = parseInt(document.getElementById('hotel-persons').value);

        const selectedAmenities = [];
        if (document.getElementById('hotel-pool').checked) selectedAmenities.push('Swimming Pool');


        const filteredHotels = hotels.filter(hotel => {
            return (!location || hotel.location.toLowerCase().includes(location)) &&
                   (!rating || hotel.rating >= rating) &&
                   (!price || hotel.price <= price) &&
                   (!persons || hotel.persons >= persons) &&
                   selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
        });

        hotelResults.innerHTML = '';
        if (filteredHotels.length > 0) {
            filteredHotels.forEach(hotel => {
                hotelResults.innerHTML += `
                    <div class="hotel-item">
                        <h3>${hotel.name}</h3>
                        <p>Location: ${hotel.location}</p>
                        <p>Rating: ${hotel.rating}</p>
                        <p>Price: ₹${hotel.price}</p>
                        <p>Amenities: ${hotel.amenities.join(', ')}</p>
                    </div>
                `;
            });
        } else {
            hotelResults.innerHTML = '<p>No hotels found based on your criteria.</p>';
        }
    });

    // Sample train routes
    const trainRoutes = {
        "kanchrapara-digha": [
            { stop: "Kanchrapara", description: "Local Train Available" },
            { stop: "DumDum", description: "Via Metro" },
            { stop: "Howrah", description: "Express & Local Train Available" },
            { stop: "Digha", description: "" }
        ],
        "Kalyani-Adisaptagram": [
            { stop: "Kalyani", description: "Local Train Available" },
            { stop: "Naihati", description: "Local Train Available" },
            { stop: "Bandel", description: "Express & Local Train Available" },
            { stop: "Adisaptagram", description: "" }
        ],
        "Kalyani-Kanchrapara": [
            { stop: "Kalyani", description: "Local Train Available" },
            { stop: "Kanchrapara", description: "Local Train Available" },
        ],
    };

    // Handle roadmap logic
    
    trainBtn.addEventListener('click', () => {
        travelMedium = 'train';
        trainBtn.style.backgroundColor = '#45a049';
        busBtn.style.backgroundColor = '';
        carBtn.style.backgroundColor = '';
    });

    busBtn.addEventListener('click', () => {
        travelMedium = 'bus';
        busBtn.style.backgroundColor = '#45a049';
        trainBtn.style.backgroundColor = '';
        carBtn.style.backgroundColor = '';
    });

    carBtn.addEventListener('click', () => {
        travelMedium = 'car';
        carBtn.style.backgroundColor = '#45a049';
        trainBtn.style.backgroundColor = '';
        busBtn.style.backgroundColor = '';
    });

    viewRoadmapBtn.addEventListener('click', () => {
        const location = document.getElementById('location').value;
        const destination = document.getElementById('destination').value;

        if (!location || !destination) {
            alert('Please enter both location and destination.');
            return;
        }

        if (!travelMedium) {
            alert('Please select a medium for travel.');
            return;
        }

        roadmapOutput.classList.remove('hidden');

        if (travelMedium === 'train') {
            const routeKey = `${location}-${destination}`;
            const route = trainRoutes[routeKey];

            if (route) {
                let roadmapHTML = `
                    <h1>Train Route from ${location} to ${destination}</h1>
                    <ul class="roadmap-list">
                `;
                route.forEach(stop => {
                    roadmapHTML += `
                        <li>
                            <strong>${stop.stop}</strong> 
                            <span>${stop.description}</span>
                        </li>
                    `;
                });
                roadmapHTML += `</ul>`;
                roadmapHTML += `
                    <h1>For complete route, track here: <a href="https://www.google.com/maps/dir/${location}/${destination}" target="_blank">Google Maps</a></h1>
                `;
                roadmapOutput.innerHTML = roadmapHTML;
            } else {
                roadmapOutput.innerHTML = `<h1>No predefined train route found between ${location} and ${destination}.</h1>`;
            }
        } else if (travelMedium === 'bus') {
            roadmapOutput.innerHTML = `
                <h1>Bus Route from ${location} to ${destination}</h1>
                <h1>Check Google Maps for the best bus route.</h1>
                <h1><a href="https://www.google.com/maps/dir/${location}/${destination}" target="_blank">Open in Google Maps</a></h1>
            `;
        }
        else if (travelMedium === 'car') {
            roadmapOutput.innerHTML = `
                <h1>Bus Route from ${location} to ${destination}</h1>
                <h1>Check Google Maps for the best bus route.</h1>
                <h1><a href="https://www.google.com/maps/dir/${location}/${destination}" target="_blank">Open in Google Maps</a></h1>
            `;
        }
    });
});

let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let videoBtn = document.querySelectorAll('.vid-btn');

window.onscroll = () =>{
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    loginForm.classList.remove('active');
}

menu.addEventListener('click', () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

searchBtn.addEventListener('click', () =>{
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');
});

formBtn.addEventListener('click', () =>{
    loginForm.classList.add('active');
});

formClose.addEventListener('click', () =>{
    loginForm.classList.remove('active');
});

videoBtn.forEach(btn =>{
    btn.addEventListener('click', ()=>{
        document.querySelector('.controls .active').classList.remove('active');
        btn.classList.add('active');
        let src = btn.getAttribute('data-src');
        document.querySelector('#video-slider').src = src;
    });
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    loop:true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
    },
});
// Voice Search
const searchInput = document.getElementById("search");
const suggestionsBox = document.getElementById("suggestions");

// Function to fetch suggestions from API
async function fetchSuggestions(query) {
    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }
    try {
        const response = await fetch(`https://api.datamuse.com/sug?s=${query}`);
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}

// Display suggestions in dropdown
function displaySuggestions(suggestions) {
    suggestionsBox.innerHTML = "";
    if (suggestions.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }
    suggestions.forEach(item => {
        const div = document.createElement("div");
        div.textContent = item.word;
        div.onclick = () => {
            searchInput.value = item.word;
            suggestionsBox.style.display = "none";
        };
        suggestionsBox.appendChild(div);
    });
    suggestionsBox.style.display = "block";
}

// Listen for input changes
searchInput.addEventListener("input", () => {
    fetchSuggestions(searchInput.value);
});

// Voice Search
function startVoiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = event => {
        searchInput.value = event.results[0][0].transcript;
        fetchSuggestions(searchInput.value);
    };
    recognition.start();
}