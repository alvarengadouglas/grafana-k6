import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  thresholds: {
      http_req_failed: ['rate<0.01'],
      http_req_duration: ['p(95)<900'],
      http_req_duration: ['p(90)<700'],
  }
}

const jsonStructure = {
  "id": 20,
  "title": "DANVOUY Womens T Shirt Casual Cotton Short",
  "price": 12.99,
  "description": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
  "category": "women's clothing",
  "image": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
  "rating": {
    "rate": 3.6,
    "count": 145
  }
};


function checkFieldsInJson(jsonKeyModel, responseJson){
  let statusPass = false;
  for (let key in jsonKeyModel) {
      let isObject = typeof jsonKeyModel[key] === 'object' && jsonKeyModel[key] !== null && typeof responseJson[key] === 'object' && responseJson[key] !== null;
      
      if (isObject) {
          checkFieldsInJson(jsonKeyModel[key], key);
      }

      if (responseJson.hasOwnProperty(key)) {
          statusPass = true;
      }else{
        statusPass = false;
      }
  }
  return statusPass;
}

export default function () {
  const response = http.get('https://fakestoreapi.com/products');

  check(response, {
    'Status was 200': (r) => r.status == 200,
    'Checking server in header': (r) => r.headers['Server'] === 'cloudflare',
    'Checking content-type': (r) => r.headers['Content-Type'] === 'application/json; charset=utf-8',
    'Body contains [ID] key': (r) => r.json()[0].hasOwnProperty('id')
  });

  response.json().forEach(function(item){
    check(item, {'Contract Validation': (item) => checkFieldsInJson(jsonStructure, item)})
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data)
  }
}