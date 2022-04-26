/*
import {API_USERNAME} from "../.env";
import {API_PASSWORD} from "../.env";

export function API_HTTP_BASIC_AUTH_HEADER() {
  if (API_USERNAME === '' || API_PASSWORD === '') {
    return {};
  } else {
    return {
      'Authorization': 'Basic ' + btoa(API_USERNAME + ':' + API_PASSWORD)
    };
  }
}

function API_CORS_HEADERS() {
  return new Headers({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  });
}
*/