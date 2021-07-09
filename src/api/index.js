import store from '../store'

export default {
  async request(url, method, params) {
    let default_url = 'http://bastion.somee.com/api/'

    let default_headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': store.getters.getToken
    }

    let request_params = {
      method: method,
      headers: default_headers
    }

    if (params) {
      request_params.body = typeof params.body === 'object' ? JSON.stringify(params.body) : params.body
      request_params.headers = Object.assign(default_headers, params.headers)
    }

    return await fetch(default_url + url, request_params)
  },

  async post(url, params) {
    return await this.request(url, 'POST', params)
  },

  async get(url, params) {
    return await this.request(url, 'GET', params)
  },
}
