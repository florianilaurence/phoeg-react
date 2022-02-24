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

export const fetch_api = (input, init) => fetch(input, {headers: API_HTTP_BASIC_AUTH_HEADER(),...init}); //TODO merge headers that are already present in init ?