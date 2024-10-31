import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  }
}

export const options = {
  thresholds: {
      http_req_failed: ['rate<0.01'],
      http_req_duration: ['p(95)<200'],
  }
}

export default function () {
  const response = http.get('http://test.k6.io')
  check(response, {'Status was 200': (r) => r.status == 200})
  sleep(1);
}