import axios from "axios";

const form = document.querySelector("form") as HTMLFormElement;
const addressInput = document.getElementById("address") as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyAIhie9VinzgqLgDyQlrogZ1MHJ7bsbN3I";

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not find location!");
      }
      const coordinates = response.data.results[0].geometry.location;
      console.log(coordinates);
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: coordinates,
        zoom: 8,
      });

      new google.maps.Marker({
        position: coordinates,
        map: map,
      });
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
    });
  addressInput.value = "";
}

form.addEventListener("submit", searchAddressHandler);
