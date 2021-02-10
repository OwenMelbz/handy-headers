// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from 'node-fetch'
import { data_get } from 'laravel-js-helpers'
import moment from 'moment'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

export default async (req, res) => {

  const response = (await fetch(req.query.url))
  const headers = JSON.parse(JSON.stringify(response.headers.raw()))

  let age = data_get(headers, 'age.0')

  if (age) {
    age = moment.duration(age * 1000).locale('en').humanize()
  }

  let last_modified = data_get(headers, 'last-modified.0')

  if (last_modified) {
    last_modified = moment(last_modified).calendar()
  }

  let cache_control = data_get(headers, 'cache-control', []) || []
  let max_age = null

  if (cache_control.length) {
    cache_control.forEach(entry => {
      const [header, value] = entry.split('=')
      if (header === 'max-age') {
        max_age = moment.duration(value * 1000).locale('en').humanize()
      }
    })
  }

  let expires = data_get(headers, 'expires.0')

  if (expires) {
    expires = moment(expires).calendar(null, {
      sameElse: 'LLLL'
    })
  }

  let encoding = (data_get(headers, 'content-encoding', []) || []).join(', ') || null

  const contentType = data_get(headers, 'content-type.0', 'text/undefined') || ''

  let body = null

  if (contentType.indexOf('text') !== -1) {
    body = await response.text()
  } else if (contentType.indexOf('image') !== -1) {
    body = req.query.url;
  } else {
    const base64 = (await response.buffer()).toString('base64')
    body = `data:${contentType};base64,${base64}`
  }

  const result = {
    display: {
      'Status': `${response.status} - ${response.statusText}`,
      'Redirected To': response.redirected ? response.url : null,
      'Authentication': data_get(headers, 'www-authenticate.0') || null,
      'Cache Control': cache_control.join(', '),
      'CF Cache': data_get(headers, 'cf-cache-status.0') || null,
      'Last Modified': last_modified,
      'Age': age,
      'Max Age': max_age,
      'Expires': expires,
      'Encoding': encoding,
      'Content Type': contentType,
    },
    log: {
      image: contentType.indexOf('image') !== -1,
      headers: headers,
      body,
    },
  }

  res.status(200).json(result)
}
